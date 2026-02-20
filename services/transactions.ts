import { db, auth } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  cardId: string | null;
  cardName: string;
  bankName: string | null;
  currency: string;
  category: string;
  date: Date;
  source: 'email' | 'sms' | 'manual';
  type: 'debit' | 'credit';
  
  // New fields for advanced categorization
  transactionType: 'spend' | 'income' | 'credit_card_payment' | 'account_transfer' | 'investment' | 'loan';
  includeInSpending: boolean;
  isTransfer?: boolean;
  
  needsCardSuggestion?: boolean;
  suggestedCard?: {
    bankName: string;
    lastFourDigits: string;
    isAccount?: boolean;
  };
  appliedRule?: string;
  createdAt: Date;
}

export async function getUserTransactions(): Promise<Transaction[]> {
  const user = auth.currentUser;
  
  if (!user) {
    console.error('❌ No user logged in');
    return [];
  }

  console.log('📊 Loading transactions...');

  try {
    const txnQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(txnQuery);
    
    console.log(`✅ Found ${snapshot.size} transactions`);

    const transactions = snapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        id: doc.id,
        amount: data.amount || 0,
        merchant: data.merchant || 'Unknown Merchant',
        cardId: data.cardId || null,
        cardName: data.cardName || 'Unknown Card',
        bankName: data.bankName || null,
        currency: data.currency || 'AED',
        category: data.category || 'Other',
        date: data.date?.toDate?.() || new Date(),
        source: data.source || 'manual',
        type: data.type || 'debit',
        transactionType: data.transactionType || 'spend',
        includeInSpending: data.includeInSpending !== false,
        isTransfer: data.isTransfer || false,
        needsCardSuggestion: data.needsCardSuggestion || false,
        suggestedCard: data.suggestedCard || undefined,
        appliedRule: data.appliedRule || undefined,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      };
    }) as Transaction[];

    return transactions;
  } catch (error: any) {
    console.error('❌ Error loading transactions:', error);
    return [];
  }
}

export async function updateTransaction(
  transactionId: string,
  updates: {
    transactionType?: string;
    category?: string;
    includeInSpending?: boolean;
    merchant?: string;
  }
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  await updateDoc(doc(db, 'transactions', transactionId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  console.log('✅ Transaction updated:', transactionId);
}

export async function addManualTransaction(data: {
  amount: number;
  merchant: string;
  cardId: string;
  cardName: string;
  category: string;
  date: Date;
  transactionType?: string;
  includeInSpending?: boolean;
}): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  console.log('💳 Adding manual transaction:', data);

  const txnRef = await addDoc(collection(db, 'transactions'), {
    ...data,
    userId: user.uid,
    currency: 'AED',
    type: 'debit',
    source: 'manual',
    transactionType: data.transactionType || 'spend',
    includeInSpending: data.includeInSpending !== false,
    createdAt: serverTimestamp(),
  });

  console.log('✅ Transaction added:', txnRef.id);
  return txnRef.id;
}
