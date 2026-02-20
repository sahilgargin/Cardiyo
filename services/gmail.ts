import { auth, db } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export async function connectGmail(): Promise<{ authUrl: string }> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const initiateAuth = httpsCallable(functions, 'initiateGmailAuth');
  const result = await initiateAuth();
  
  return result.data as { authUrl: string };
}

export async function syncGmail(daysBack: number = 30): Promise<{
  success: boolean;
  messagesScanned: number;
  transactionsFound: number;
  transfersFound: number;
  newCardsDetected: number;
  duplicatesSkipped: number;
}> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const sync = httpsCallable(functions, 'syncGmail');
  const result = await sync({ daysBack });
  
  return result.data as any;
}

export async function getGmailSyncStatus(): Promise<{
  connected: boolean;
  email?: string;
  lastSync?: Date;
  transactionsFound?: number;
  messagesScanned?: number;
  autoSync?: boolean;
}> {
  const user = auth.currentUser;
  if (!user) return { connected: false };

  try {
    const syncDoc = await getDoc(doc(db, 'users', user.uid, 'sync', 'gmail'));
    
    if (!syncDoc.exists()) {
      return { connected: false };
    }

    const data = syncDoc.data();
    return {
      connected: data.connected || false,
      email: data.email,
      lastSync: data.lastSync?.toDate(),
      transactionsFound: data.transactionsFound,
      messagesScanned: data.messagesScanned,
      autoSync: data.autoSync || false,
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return { connected: false };
  }
}
