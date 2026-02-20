import { db, auth } from '../firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface TransactionRule {
  id: string;
  merchantPattern: string; // e.g., "CAREEM*", "Salary from*"
  accountLastFour?: string;
  cardLastFour?: string;
  transactionType: 'spend' | 'income' | 'credit_card_payment' | 'account_transfer' | 'investment' | 'loan';
  category: string;
  includeInSpending: boolean;
  createdAt: Date;
}

export async function saveTransactionRule(rule: {
  merchantPattern: string;
  accountLastFour?: string;
  cardLastFour?: string;
  transactionType: string;
  category: string;
  includeInSpending: boolean;
}): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  const ruleId = `${rule.merchantPattern}_${rule.accountLastFour || rule.cardLastFour || 'any'}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  await setDoc(doc(db, 'users', user.uid, 'transactionRules', ruleId), {
    ...rule,
    createdAt: serverTimestamp(),
  });

  console.log('✅ Transaction rule saved:', ruleId);
}

export async function getTransactionRules(): Promise<TransactionRule[]> {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const rulesDoc = await getDoc(doc(db, 'users', user.uid, 'transactionPreferences', 'rules'));
    
    if (!rulesDoc.exists()) return [];

    const data = rulesDoc.data();
    return Object.entries(data.rules || {}).map(([id, rule]: [string, any]) => ({
      id,
      ...rule,
      createdAt: rule.createdAt?.toDate?.() || new Date(),
    }));
  } catch (error) {
    console.error('Error loading rules:', error);
    return [];
  }
}

export async function applyUserRules(transaction: any, rules: TransactionRule[]): Promise<any> {
  for (const rule of rules) {
    // Check if merchant matches pattern
    const merchantMatches = transaction.merchant.toLowerCase().includes(rule.merchantPattern.toLowerCase());
    
    // Check if card/account matches
    const cardMatches = rule.cardLastFour ? transaction.cardLastFour === rule.cardLastFour : true;
    const accountMatches = rule.accountLastFour ? transaction.accountLastFour === rule.accountLastFour : true;

    if (merchantMatches && cardMatches && accountMatches) {
      return {
        ...transaction,
        transactionType: rule.transactionType,
        category: rule.category,
        includeInSpending: rule.includeInSpending,
        appliedRule: rule.id,
      };
    }
  }

  return transaction;
}
