import {onCall, HttpsError} from "firebase-functions/v2/https";
import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {google} from "googleapis";
import {defineSecret} from "firebase-functions/params";

admin.initializeApp();
const db = admin.firestore();

// Use Firebase secrets instead of hardcoded values
const googleClientId = defineSecret("GOOGLE_CLIENT_ID");
const googleClientSecret = defineSecret("GOOGLE_CLIENT_SECRET");

const BANK_PATTERNS: {[key: string]: string[]} = {
  ADIB: ["adib.ae", "adibank"],
  ENBD: ["emiratesnbd.com", "emiratesnbd"],
  FAB: ["bankfab.com", "fab"],
  Mashreq: ["mashreq.com", "mashreqbank"],
};

export const initiateGmailAuth = onCall({secrets: [googleClientId, googleClientSecret]}, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  const oauth2Client = new google.auth.OAuth2(
    googleClientId.value(),
    googleClientSecret.value(),
    "https://us-central1-my-vibe-app-af0db.cloudfunctions.net/gmailCallback"
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    state: request.auth.uid,
    prompt: "consent",
  });

  return {authUrl};
});

export const gmailCallback = onRequest({secrets: [googleClientId, googleClientSecret]}, async (req, res) => {
  const {code, state} = req.query;

  if (!code || !state) {
    res.status(400).send("Missing parameters");
    return;
  }

  const userId = state as string;

  const oauth2Client = new google.auth.OAuth2(
    googleClientId.value(),
    googleClientSecret.value(),
    "https://us-central1-my-vibe-app-af0db.cloudfunctions.net/gmailCallback"
  );

  try {
    const {tokens} = await oauth2Client.getToken(code as string);

    await db
      .collection("users")
      .doc(userId)
      .collection("emailTokens")
      .add({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(tokens.expiry_date || Date.now() + 3600000),
        provider: "google",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #9BFF32, #3DEEFF);
              padding: 20px;
            }
            .card {
              background: white;
              padding: 40px;
              border-radius: 24px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.15);
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            h1 { color: #060612; font-size: 28px; margin-bottom: 12px; }
            p { color: #666; font-size: 16px; margin-bottom: 32px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✅ Gmail Connected!</h1>
            <p>Return to the app and tap "Sync Now"</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).send("Authentication failed");
  }
});

export const syncGmail = onCall<{daysBack?: number}>({secrets: [googleClientId, googleClientSecret]}, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  const userId = request.auth.uid;
  const daysBack = request.data.daysBack || 30;

  try {
    const userCardsSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("cards")
      .get();

    const userCards = userCardsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const tokensSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("emailTokens")
      .where("provider", "==", "google")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (tokensSnapshot.empty) {
      throw new HttpsError("not-found", "No Gmail connection found");
    }

    const tokenData = tokensSnapshot.docs[0].data();

    const oauth2Client = new google.auth.OAuth2(
      googleClientId.value(),
      googleClientSecret.value(),
      "https://us-central1-my-vibe-app-af0db.cloudfunctions.net/gmailCallback"
    );

    oauth2Client.setCredentials({
      access_token: tokenData.accessToken,
      refresh_token: tokenData.refreshToken,
    });

    const gmail = google.gmail({version: "v1", auth: oauth2Client});

    const afterDate = new Date();
    afterDate.setDate(afterDate.getDate() - daysBack);
    const afterTimestamp = Math.floor(afterDate.getTime() / 1000);

    const bankDomains = Object.values(BANK_PATTERNS).flat();
    const fromQuery = bankDomains.map((d) => `from:${d}`).join(" OR ");
    const searchQuery = `(${fromQuery}) after:${afterTimestamp}`;

    const listResponse = await gmail.users.messages.list({
      userId: "me",
      q: searchQuery,
      maxResults: 100,
    });

    const messages = listResponse.data.messages || [];
    let transactionsFound = 0;

    for (const message of messages.slice(0, 50)) {
      try {
        const fullMessage = await gmail.users.messages.get({
          userId: "me",
          id: message.id || "",
          format: "full",
        });

        const headers = fullMessage.data.payload?.headers || [];
        const from =
          headers.find(
            (h) => h.name?.toLowerCase() === "from"
          )?.value || "";

        let body = "";
        const payload = fullMessage.data.payload;

        if (payload?.body?.data) {
          body = Buffer.from(
            payload.body.data,
            "base64"
          ).toString("utf-8");
        } else if (payload?.parts) {
          const textPart = payload.parts.find(
            (p) => p.mimeType === "text/plain"
          );
          if (textPart?.body?.data) {
            body = Buffer.from(
              textPart.body.data,
              "base64"
            ).toString("utf-8");
          }
        }

        const transaction = parseTransaction(body, from);

        if (transaction) {
          let matchedCard = null;
          if (transaction.cardLastFour) {
            matchedCard = userCards.find(
              (card: any) => card.lastFourDigits === transaction.cardLastFour
            );
          }

          await db.collection("transactions").add({
            ...transaction,
            userId,
            cardId: matchedCard?.id || null,
            cardName: matchedCard?.cardName || null,
            source: "email",
            emailId: message.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          transactionsFound++;
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    }

    return {
      success: true,
      messagesScanned: messages.length,
      transactionsFound,
    };
  } catch (error: any) {
    console.error("Sync error:", error);
    throw new HttpsError("internal", error.message);
  }
});

function parseTransaction(body: string, from: string): any | null {
  let bankName = "";
  for (const [bank, patterns] of Object.entries(BANK_PATTERNS)) {
    if (patterns.some((p) => from.toLowerCase().includes(p))) {
      bankName = bank;
      break;
    }
  }

  if (!bankName) return null;

  const amountMatch = body.match(
    /(?:AED|amount)\s*(\d+(?:,\d{3})*\.?\d{0,2})/i
  );
  const merchantMatch = body.match(/(?:at|merchant)\s+([A-Z\s&]+)/i);
  const cardMatch = body.match(/(?:card ending|ending)\s+[*\s]*(\d{4})/i);

  if (!amountMatch) return null;

  const merchant = merchantMatch?.[1]?.trim() || "Unknown";

  return {
    amount: parseFloat(amountMatch[1].replace(/,/g, "")),
    merchant,
    cardLastFour: cardMatch?.[1] || null,
    bankName,
    currency: "AED",
    type: "debit",
    category: categorize(merchant),
    date: new Date(),
  };
}

function categorize(merchant: string): string {
  const m = merchant.toLowerCase();
  if (/restaurant|cafe|food|starbucks/.test(m)) return "Dining";
  if (/carrefour|lulu|spinneys/.test(m)) return "Groceries";
  if (/enoc|eppco|adnoc|fuel/.test(m)) return "Fuel";
  if (/vox|cinema|gym/.test(m)) return "Entertainment";
  if (/mall|amazon|noon/.test(m)) return "Shopping";
  if (/hotel|airline/.test(m)) return "Travel";
  if (/uber|careem|taxi|salik/.test(m)) return "Transport";
  return "Other";
}
