import * as SMS from 'expo-sms';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export interface Transaction {
  id?: string;
  userId: string;
  cardId?: string;
  amount: number;
  currency: string;
  merchant: string;
  category?: string;
  type: 'debit' | 'credit';
  date: Date;
  smsBody: string;
  bankName?: string;
  cardLastFour?: string;
  balance?: number;
  approved: boolean;
}

// SMS parsing patterns for UAE banks
const BANK_PATTERNS = {
  ADIB: {
    name: 'Abu Dhabi Islamic Bank',
    sender: ['ADIB', 'AD-ADIB', 'ADIBUAE'],
    patterns: [
      // Pattern 1: "Trx. of AED35.40 on your card ending *298 at SMILES FOOD, UAE is Approved. Avl. card bal is 9934.17"
      {
        regex: /Trx\.\s+of\s+([A-Z]{3})\s*([\d,]+\.?\d*)\s+on\s+your\s+card\s+ending\s+\*?(\d{3,4})\s+at\s+([^,]+).*?is\s+(Approved|Declined).*?(?:Avl\.\s+card\s+bal\s+is\s+([\d,]+\.?\d*))?/i,
        extract: (match: RegExpMatchArray) => ({
          currency: match[1],
          amount: parseFloat(match[2].replace(/,/g, '')),
          cardLastFour: match[3],
          merchant: match[4].trim(),
          approved: match[5].toLowerCase() === 'approved',
          balance: match[6] ? parseFloat(match[6].replace(/,/g, '')) : undefined,
          type: 'debit' as const
        })
      },
      // Pattern 2: "Use Verification Code 815709 to pay QAR 1 at Merchant using card ending 7622"
      {
        regex: /(?:pay|spend)\s+([A-Z]{3})\s*([\d,]+\.?\d*)\s+at\s+([^u]+)\s+using\s+card\s+ending\s+(\d{4})/i,
        extract: (match: RegExpMatchArray) => ({
          currency: match[1],
          amount: parseFloat(match[2].replace(/,/g, '')),
          merchant: match[3].trim(),
          cardLastFour: match[4],
          approved: true,
          type: 'debit' as const
        })
      },
      // Pattern 3: Credit/Refund
      {
        regex: /(?:AED|QAR|USD)\s*([\d,]+\.?\d*)\s+(?:credited|refund).*?card\s+ending\s+\*?(\d{3,4})/i,
        extract: (match: RegExpMatchArray) => ({
          currency: 'AED',
          amount: parseFloat(match[1].replace(/,/g, '')),
          cardLastFour: match[2],
          merchant: 'Refund',
          approved: true,
          type: 'credit' as const
        })
      }
    ]
  },
  ENBD: {
    name: 'Emirates NBD',
    sender: ['ENBD', 'Emirates NBD', 'EmiratesNBD'],
    patterns: [
      {
        regex: /(?:card|a\/c).*?(\d{4}).*?(?:AED|USD)\s*([\d,]+\.?\d*).*?at\s+([A-Z0-9\s]+)/i,
        extract: (match: RegExpMatchArray) => ({
          currency: 'AED',
          amount: parseFloat(match[2].replace(/,/g, '')),
          cardLastFour: match[1],
          merchant: match[3].trim(),
          approved: true,
          type: 'debit' as const
        })
      }
    ]
  },
  FAB: {
    name: 'First Abu Dhabi Bank',
    sender: ['FAB', 'AD-FAB', 'FirstAbuDhabiBank'],
    patterns: [
      {
        regex: /(?:card|a\/c).*?(\d{4}).*?(?:AED|USD)\s*([\d,]+\.?\d*).*?at\s+([A-Z0-9\s]+)/i,
        extract: (match: RegExpMatchArray) => ({
          currency: 'AED',
          amount: parseFloat(match[2].replace(/,/g, '')),
          cardLastFour: match[1],
          merchant: match[3].trim(),
          approved: true,
          type: 'debit' as const
        })
      }
    ]
  },
  Mashreq: {
    name: 'Mashreq Bank',
    sender: ['Mashreq', 'MASHREQ', 'MashreqBank'],
    patterns: [
      {
        regex: /(?:card|a\/c).*?(\d{4}).*?(?:AED|USD)\s*([\d,]+\.?\d*).*?at\s+([A-Z0-9\s]+)/i,
        extract: (match: RegExpMatchArray) => ({
          currency: 'AED',
          amount: parseFloat(match[2].replace(/,/g, '')),
          cardLastFour: match[1],
          merchant: match[3].trim(),
          approved: true,
          type: 'debit' as const
        })
      }
    ]
  }
};

export async function parseBankSMS(smsBody: string, sender: string): Promise<Transaction | null> {
  const user = auth.currentUser;
  if (!user) return null;

  // Find which bank this SMS is from
  let bankName = '';
  let patterns: any[] = [];
  
  for (const [bank, config] of Object.entries(BANK_PATTERNS)) {
    if (config.sender.some(s => sender.toUpperCase().includes(s.toUpperCase()))) {
      bankName = config.name;
      patterns = config.patterns;
      break;
    }
  }
  
  if (!bankName) {
    console.log('Unknown sender:', sender);
    return null;
  }
  
  // Try to parse with bank patterns
  for (const pattern of patterns) {
    const match = smsBody.match(pattern.regex);
    if (match) {
      const extracted = pattern.extract(match);
      
      // Try to match card from user's wallet
      const cardId = await matchCardByLastFour(extracted.cardLastFour);
      
      return {
        userId: user.uid,
        cardId,
        amount: extracted.amount,
        currency: extracted.currency,
        merchant: extracted.merchant,
        type: extracted.type,
        date: new Date(),
        smsBody,
        bankName,
        cardLastFour: extracted.cardLastFour,
        balance: extracted.balance,
        approved: extracted.approved,
      };
    }
  }
  
  console.log('No pattern matched for SMS:', smsBody.substring(0, 50));
  return null;
}

async function matchCardByLastFour(lastFour: string): Promise<string | undefined> {
  try {
    const user = auth.currentUser;
    if (!user) return undefined;
    
    // Query user's cards
    const cardsRef = collection(db, 'users', user.uid, 'cards');
    const cardsSnapshot = await getDocs(cardsRef);
    
    for (const cardDoc of cardsSnapshot.docs) {
      const cardData = cardDoc.data();
      if (cardData.lastFourDigits === lastFour) {
        return cardDoc.id;
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Error matching card:', error);
    return undefined;
  }
}

export async function saveTransaction(transaction: Transaction): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    // Check for duplicates (same amount, merchant, card within 1 minute)
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const duplicateQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      where('amount', '==', transaction.amount),
      where('merchant', '==', transaction.merchant),
      where('date', '>=', oneMinuteAgo)
    );
    
    const duplicates = await getDocs(duplicateQuery);
    if (!duplicates.empty) {
      console.log('Duplicate transaction detected, skipping');
      return false;
    }
    
    // Auto-categorize based on merchant
    transaction.category = categorizeMerchant(transaction.merchant);
    
    await addDoc(collection(db, 'transactions'), {
      ...transaction,
      createdAt: new Date(),
    });
    
    console.log('Transaction saved:', transaction.merchant, transaction.amount);
    return true;
  } catch (error) {
    console.error('Error saving transaction:', error);
    return false;
  }
}

function categorizeMerchant(merchant: string): string {
  const merchantLower = merchant.toLowerCase();
  
  // Dining
  if (merchantLower.includes('restaurant') || merchantLower.includes('cafe') || 
      merchantLower.includes('food') || merchantLower.includes('smiles food') ||
      merchantLower.includes('mcdonald') || merchantLower.includes('starbucks') ||
      merchantLower.includes('kfc') || merchantLower.includes('subway')) {
    return 'Dining';
  }
  
  // Groceries
  if (merchantLower.includes('carrefour') || merchantLower.includes('lulu') ||
      merchantLower.includes('spinneys') || merchantLower.includes('waitrose') ||
      merchantLower.includes('supermarket') || merchantLower.includes('hypermarket')) {
    return 'Groceries';
  }
  
  // Fuel
  if (merchantLower.includes('petrol') || merchantLower.includes('enoc') ||
      merchantLower.includes('eppco') || merchantLower.includes('adnoc') ||
      merchantLower.includes('emarat') || merchantLower.includes('fuel')) {
    return 'Fuel';
  }
  
  // Entertainment
  if (merchantLower.includes('cinema') || merchantLower.includes('vox') ||
      merchantLower.includes('reel') || merchantLower.includes('spotify') ||
      merchantLower.includes('netflix') || merchantLower.includes('gym')) {
    return 'Entertainment';
  }
  
  // Shopping
  if (merchantLower.includes('mall') || merchantLower.includes('store') ||
      merchantLower.includes('amazon') || merchantLower.includes('noon') ||
      merchantLower.includes('fashion') || merchantLower.includes('boutique')) {
    return 'Shopping';
  }
  
  // Travel
  if (merchantLower.includes('airline') || merchantLower.includes('emirates') ||
      merchantLower.includes('flydubai') || merchantLower.includes('etihad') ||
      merchantLower.includes('hotel') || merchantLower.includes('booking')) {
    return 'Travel';
  }
  
  // Transport
  if (merchantLower.includes('taxi') || merchantLower.includes('uber') ||
      merchantLower.includes('careem') || merchantLower.includes('parking') ||
      merchantLower.includes('salik') || merchantLower.includes('rta')) {
    return 'Transport';
  }
  
  return 'Other';
}

export async function getUserTransactions(limitCount: number = 50): Promise<Transaction[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    } as Transaction));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function getSpendingByCategory(startDate: Date, endDate: Date): Promise<{ [category: string]: number }> {
  try {
    const user = auth.currentUser;
    if (!user) return {};
    
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      where('type', '==', 'debit'),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    
    const snapshot = await getDocs(q);
    const spending: { [category: string]: number } = {};
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const category = data.category || 'Other';
      spending[category] = (spending[category] || 0) + data.amount;
    });
    
    return spending;
  } catch (error) {
    console.error('Error calculating spending:', error);
    return {};
  }
}

export async function getTransactionsByCard(cardId: string): Promise<Transaction[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      where('cardId', '==', cardId),
      orderBy('date', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    } as Transaction));
  } catch (error) {
    console.error('Error fetching card transactions:', error);
    return [];
  }
}
