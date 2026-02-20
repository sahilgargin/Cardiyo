export interface ParsedTransaction {
  amount: number;
  merchant: string;
  cardLastFour: string | null;
  bankName: string | null;
  currency: string;
  category: string;
  date: Date;
  source: 'email' | 'sms' | 'manual';
  rawText?: string;
  confidence: 'high' | 'medium' | 'low';
  suggestedCard?: {
    bankName: string;
    cardLastFour: string;
    cardName?: string;
  };
}

const BANK_PATTERNS = {
  ADIB: {
    keywords: ['adib', 'adibank', 'abu dhabi islamic'],
    domains: ['adib.ae'],
    smsFrom: ['ADIB', 'ADIBANK']
  },
  'Emirates NBD': {
    keywords: ['emiratesnbd', 'emirates nbd', 'enbd'],
    domains: ['emiratesnbd.com'],
    smsFrom: ['EmiratesNBD', 'ENBD']
  },
  FAB: {
    keywords: ['fab', 'first abu dhabi bank', 'bankfab'],
    domains: ['bankfab.com'],
    smsFrom: ['FAB', 'FirstAD']
  },
  Mashreq: {
    keywords: ['mashreq', 'mashreqbank'],
    domains: ['mashreq.com'],
    smsFrom: ['Mashreq', 'MASHREQ']
  }
};

const MERCHANT_CATEGORIES: { [key: string]: { keywords: string[]; icon: string } } = {
  Dining: {
    keywords: ['restaurant', 'cafe', 'coffee', 'starbucks', 'mcdonald', 'kfc', 'pizza', 'burger', 'food', 'dining', 'eatery', 'bistro'],
    icon: 'restaurant'
  },
  Groceries: {
    keywords: ['carrefour', 'lulu', 'spinneys', 'west zone', 'choithrams', 'waitrose', 'supermarket', 'grocery', 'mart'],
    icon: 'cart'
  },
  Fuel: {
    keywords: ['enoc', 'eppco', 'adnoc', 'emarat', 'fuel', 'petrol', 'gas station'],
    icon: 'battery-charging'
  },
  Transport: {
    keywords: ['uber', 'careem', 'taxi', 'metro', 'bus', 'parking', 'salik', 'toll', 'rta'],
    icon: 'car'
  },
  Entertainment: {
    keywords: ['cinema', 'vox', 'reel', 'movie', 'theatre', 'gym', 'fitness', 'sports', 'game'],
    icon: 'game-controller'
  },
  Shopping: {
    keywords: ['mall', 'amazon', 'noon', 'namshi', 'fashion', 'clothing', 'store', 'shop', 'boutique'],
    icon: 'bag'
  },
  Travel: {
    keywords: ['hotel', 'airline', 'emirates', 'etihad', 'flydubai', 'booking', 'airbnb', 'travel'],
    icon: 'airplane'
  },
  Healthcare: {
    keywords: ['hospital', 'clinic', 'pharmacy', 'medical', 'doctor', 'health'],
    icon: 'medical'
  },
  Utilities: {
    keywords: ['dewa', 'etisalat', 'du', 'telecom', 'electricity', 'water', 'bill'],
    icon: 'flash'
  },
  Education: {
    keywords: ['school', 'university', 'course', 'tuition', 'education', 'training'],
    icon: 'school'
  }
};

export function parseEmailTransaction(emailBody: string, from: string): ParsedTransaction | null {
  console.log('📧 Parsing email transaction...');
  
  // Detect bank
  let bankName: string | null = null;
  for (const [bank, patterns] of Object.entries(BANK_PATTERNS)) {
    if (patterns.domains.some(domain => from.toLowerCase().includes(domain))) {
      bankName = bank;
      break;
    }
  }

  // Extract amount - multiple patterns
  const amountPatterns = [
    /AED\s*(\d+(?:,\d{3})*\.?\d{0,2})/i,
    /amount[:\s]+AED\s*(\d+(?:,\d{3})*\.?\d{0,2})/i,
    /(?:debited|charged|spent)\s+AED\s*(\d+(?:,\d{3})*\.?\d{0,2})/i,
    /(\d+(?:,\d{3})*\.?\d{2})\s*AED/i
  ];

  let amount: number | null = null;
  for (const pattern of amountPatterns) {
    const match = emailBody.match(pattern);
    if (match) {
      amount = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }

  if (!amount) {
    console.log('❌ No amount found');
    return null;
  }

  // Extract merchant - multiple patterns
  const merchantPatterns = [
    /(?:at|merchant[:\s]+)([A-Z][A-Z0-9\s&'-]+?)(?:\s+on|\s+dated|\s+AED|\.|\n)/i,
    /(?:transaction at|purchase at)\s+([A-Z][A-Z0-9\s&'-]+?)(?:\s|$)/i,
    /(?:spent at|used at)\s+([A-Z][A-Z0-9\s&'-]+?)(?:\s|$)/i
  ];

  let merchant = 'Unknown Merchant';
  let confidence: 'high' | 'medium' | 'low' = 'low';
  
  for (const pattern of merchantPatterns) {
    const match = emailBody.match(pattern);
    if (match) {
      merchant = match[1].trim();
      confidence = 'high';
      break;
    }
  }

  // Extract card last 4 digits
  const cardPatterns = [
    /card\s+(?:ending|number)?\s*[*x\s]*(\d{4})/i,
    /[*x]{12}(\d{4})/i,
    /\*\*\*\*\s*(\d{4})/i
  ];

  let cardLastFour: string | null = null;
  for (const pattern of cardPatterns) {
    const match = emailBody.match(pattern);
    if (match) {
      cardLastFour = match[1];
      break;
    }
  }

  // Extract date
  const datePatterns = [
    /(?:on|dated?)\s+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i
  ];

  let transactionDate = new Date();
  for (const pattern of datePatterns) {
    const match = emailBody.match(pattern);
    if (match) {
      transactionDate = new Date(match[1]);
      break;
    }
  }

  const category = categorizeTransaction(merchant);

  return {
    amount,
    merchant,
    cardLastFour,
    bankName,
    currency: 'AED',
    category,
    date: transactionDate,
    source: 'email',
    rawText: emailBody.substring(0, 200),
    confidence,
    suggestedCard: cardLastFour && bankName ? {
      bankName,
      cardLastFour,
      cardName: `${bankName} Card ending ${cardLastFour}`
    } : undefined
  };
}

export function parseSMSTransaction(smsBody: string, from: string): ParsedTransaction | null {
  console.log('📱 Parsing SMS transaction...');
  
  // Detect bank from SMS sender
  let bankName: string | null = null;
  for (const [bank, patterns] of Object.entries(BANK_PATTERNS)) {
    if (patterns.smsFrom.some(sender => from.toUpperCase().includes(sender))) {
      bankName = bank;
      break;
    }
  }

  // Extract amount
  const amountMatch = smsBody.match(/AED\s*(\d+(?:,\d{3})*\.?\d{0,2})/i) ||
                      smsBody.match(/(\d+(?:,\d{3})*\.?\d{2})\s*AED/i);

  if (!amountMatch) return null;

  const amount = parseFloat(amountMatch[1].replace(/,/g, ''));

  // Extract merchant
  const merchantMatch = smsBody.match(/(?:at|on)\s+([A-Z][A-Z0-9\s&'-]+?)(?:\s+on|\s+dated|\.|\n)/i);
  const merchant = merchantMatch?.[1]?.trim() || 'Unknown Merchant';

  // Extract card
  const cardMatch = smsBody.match(/[*x]{4}(\d{4})/i);
  const cardLastFour = cardMatch?.[1] || null;

  const category = categorizeTransaction(merchant);

  return {
    amount,
    merchant,
    cardLastFour,
    bankName,
    currency: 'AED',
    category,
    date: new Date(),
    source: 'sms',
    rawText: smsBody,
    confidence: 'high',
    suggestedCard: cardLastFour && bankName ? {
      bankName,
      cardLastFour,
      cardName: `${bankName} Card ending ${cardLastFour}`
    } : undefined
  };
}

export function categorizeTransaction(merchant: string): string {
  const merchantLower = merchant.toLowerCase();

  for (const [category, data] of Object.entries(MERCHANT_CATEGORIES)) {
    if (data.keywords.some(keyword => merchantLower.includes(keyword))) {
      return category;
    }
  }

  return 'Other';
}

export function getCategoryIcon(category: string): string {
  return MERCHANT_CATEGORIES[category]?.icon || 'cash';
}
