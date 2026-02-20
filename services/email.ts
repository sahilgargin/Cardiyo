import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { parseBankSMS, saveTransaction, Transaction } from './sms';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = '260028785813-e3j7h0rjs8bo3uhnbd1h000f00g7vl5h.apps.googleusercontent.com';

// Gmail API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
];

// Bank email patterns
const BANK_EMAIL_PATTERNS = {
  ADIB: {
    from: ['noreply@adib.ae', 'alerts@adib.ae', 'notifications@adib.ae', 'adib.ae'],
    subjects: ['transaction', 'purchase', 'payment', 'card', 'trx'],
  },
  ENBD: {
    from: ['noreply@emiratesnbd.com', 'alerts@emiratesnbd.com', 'emiratesnbd.com'],
    subjects: ['transaction', 'purchase', 'card'],
  },
  FAB: {
    from: ['noreply@bankfab.com', 'alerts@bankfab.com', 'bankfab.com'],
    subjects: ['transaction', 'purchase'],
  },
  Mashreq: {
    from: ['noreply@mashreq.com', 'alerts@mashreq.com', 'mashreq.com'],
    subjects: ['transaction', 'purchase'],
  },
};

export interface EmailTransaction {
  emailId: string;
  from: string;
  subject: string;
  body: string;
  date: Date;
  transaction?: Transaction;
}

/**
 * Hook to handle Google OAuth
 */
export function useGoogleAuth() {
  const redirectUri = makeRedirectUri({
    scheme: 'cardiyo',
    path: 'redirect'
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: CLIENT_ID,
    scopes: SCOPES,
    redirectUri,
  });

  return { request, response, promptAsync };
}

/**
 * Fetch Gmail messages
 */
export async function fetchGmailMessages(accessToken: string, daysBack: number = 30): Promise<EmailTransaction[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const afterDate = new Date();
    afterDate.setDate(afterDate.getDate() - daysBack);
    const afterTimestamp = Math.floor(afterDate.getTime() / 1000);

    const bankFromAddresses = Object.values(BANK_EMAIL_PATTERNS)
      .flatMap(bank => bank.from)
      .map(email => `from:${email}`)
      .join(' OR ');

    const searchQuery = `(${bankFromAddresses}) after:${afterTimestamp}`;

    console.log('Searching Gmail:', searchQuery);

    const listResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(searchQuery)}&maxResults=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const listData = await listResponse.json();

    if (listData.error) {
      throw new Error(listData.error.message || 'Failed to fetch emails');
    }

    if (!listData.messages) {
      console.log('No bank emails found');
      return [];
    }

    console.log(`Found ${listData.messages.length} bank emails`);

    const emailTransactions: EmailTransaction[] = [];

    for (const message of listData.messages.slice(0, 50)) {
      try {
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const messageData = await messageResponse.json();

        const headers = messageData.payload.headers;
        const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || '';
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '';
        const dateStr = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

        let body = '';
        if (messageData.payload.body.data) {
          body = decodeBase64(messageData.payload.body.data);
        } else if (messageData.payload.parts) {
          const textPart = messageData.payload.parts.find((p: any) => p.mimeType === 'text/plain');
          if (textPart?.body.data) {
            body = decodeBase64(textPart.body.data);
          } else {
            const htmlPart = messageData.payload.parts.find((p: any) => p.mimeType === 'text/html');
            if (htmlPart?.body.data) {
              body = decodeBase64(htmlPart.body.data);
              body = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
            }
          }
        }

        const transaction = parseEmailTransaction(body, from);

        emailTransactions.push({
          emailId: message.id,
          from,
          subject,
          body: body.substring(0, 500),
          date: new Date(dateStr),
          transaction: transaction || undefined,
        });

        if (transaction) {
          console.log('Found transaction:', transaction.merchant, transaction.amount);
          await saveTransaction(transaction);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }

    return emailTransactions;
  } catch (error: any) {
    console.error('Error fetching Gmail messages:', error);
    throw error;
  }
}

function decodeBase64(base64: string): string {
  try {
    const base64Decoded = base64.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64Decoded.length % 4;
    const paddedBase64 = padding ? base64Decoded + '='.repeat(4 - padding) : base64Decoded;
    return atob(paddedBase64);
  } catch (error) {
    console.error('Error decoding base64:', error);
    return '';
  }
}

function parseEmailTransaction(emailBody: string, from: string): Transaction | null {
  let bankName = '';
  for (const [bank, config] of Object.entries(BANK_EMAIL_PATTERNS)) {
    if (config.from.some(email => from.toLowerCase().includes(email.toLowerCase()))) {
      bankName = bank;
      break;
    }
  }

  if (!bankName) {
    return null;
  }

  return parseBankSMS(emailBody, bankName);
}

export async function saveEmailAccessToken(accessToken: string, refreshToken?: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'users', user.uid, 'emailTokens'), {
      accessToken,
      refreshToken,
      provider: 'google',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000),
    });
    
    console.log('Email access token saved');
  } catch (error) {
    console.error('Error saving email token:', error);
  }
}

export async function getEmailAccessToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const tokensQuery = query(
      collection(db, 'users', user.uid, 'emailTokens'),
      where('provider', '==', 'google'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const snapshot = await getDocs(tokensQuery);
    
    if (snapshot.empty) return null;

    const tokenDoc = snapshot.docs[0];
    const tokenData = tokenDoc.data();

    const expiresAt = tokenData.expiresAt?.toDate() || new Date(0);
    if (expiresAt < new Date()) {
      console.log('Email token expired');
      return null;
    }

    return tokenData.accessToken;
  } catch (error) {
    console.error('Error getting email token:', error);
    return null;
  }
}
