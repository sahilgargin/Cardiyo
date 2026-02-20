export function parseTransaction(body: string, from: string): any | null {
  const bankPatterns: {[key: string]: string[]} = {
    ADIB: ["adib.ae", "adibank"],
    "Emirates NBD": ["emiratesnbd.com", "emiratesnbd"],
    FAB: ["bankfab.com", "fab"],
    Mashreq: ["mashreq.com", "mashreqbank"],
  };

  let bankName = "";
  for (const [bank, patterns] of Object.entries(bankPatterns)) {
    if (patterns.some((p) => from.toLowerCase().includes(p))) {
      bankName = bank;
      break;
    }
  }

  if (!bankName) return null;

  // Enhanced amount extraction
  const amountPatterns = [
    /AED\s*(\d+(?:,\d{3})*\.?\d{0,2})/i,
    /amount[:\s]+AED\s*(\d+(?:,\d{3})*\.?\d{0,2})/i,
    /(\d+(?:,\d{3})*\.?\d{2})\s*AED/i,
  ];

  let amount: number | null = null;
  for (const pattern of amountPatterns) {
    const match = body.match(pattern);
    if (match) {
      amount = parseFloat(match[1].replace(/,/g, ""));
      break;
    }
  }

  if (!amount) return null;

  // Enhanced merchant extraction
  const merchantPatterns = [
    /(?:at|merchant[:\s]+)([A-Z][A-Z0-9\s&'-]+?)(?:\s+on|\s+dated|\s+AED|\.|\n)/i,
    /(?:transaction at|purchase at)\s+([A-Z][A-Z0-9\s&'-]+?)(?:\s|$)/i,
  ];

  let merchant = "Unknown Merchant";
  for (const pattern of merchantPatterns) {
    const match = body.match(pattern);
    if (match) {
      merchant = match[1].trim();
      break;
    }
  }

  // Card extraction
  const cardPatterns = [
    /card\s+(?:ending|number)?\s*[*x\s]*(\d{4})/i,
    /[*x]{12}(\d{4})/i,
    /\*\*\*\*\s*(\d{4})/i,
  ];

  let cardLastFour: string | null = null;
  for (const pattern of cardPatterns) {
    const match = body.match(pattern);
    if (match) {
      cardLastFour = match[1];
      break;
    }
  }

  return {
    amount,
    merchant,
    cardLastFour: cardLastFour || null,
    bankName,
    currency: "AED",
    type: "debit",
    category: categorize(merchant),
    date: new Date(),
  };
}

function categorize(merchant: string): string {
  const m = merchant.toLowerCase();
  if (/restaurant|cafe|food|starbucks|mcdonald|kfc/.test(m)) return "Dining";
  if (/carrefour|lulu|spinneys|grocery|supermarket/.test(m)) return "Groceries";
  if (/enoc|eppco|adnoc|fuel|petrol/.test(m)) return "Fuel";
  if (/vox|cinema|gym|fitness|entertainment/.test(m)) return "Entertainment";
  if (/mall|amazon|noon|shop|fashion/.test(m)) return "Shopping";
  if (/hotel|airline|emirates|travel/.test(m)) return "Travel";
  if (/uber|careem|taxi|salik|parking|rta/.test(m)) return "Transport";
  if (/hospital|clinic|pharmacy|medical/.test(m)) return "Healthcare";
  if (/dewa|etisalat|du|utility/.test(m)) return "Utilities";
  return "Other";
}
