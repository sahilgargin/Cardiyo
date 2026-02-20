import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const FUNCTIONS_BASE_URL = 'https://us-central1-my-vibe-app-af0db.cloudfunctions.net';

export async function connectGmail(): Promise<{ authUrl: string }> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  try {
    const idToken = await user.getIdToken();
    
    const response = await fetch(`${FUNCTIONS_BASE_URL}/initiateGmailAuth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ data: {} })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Function error:', errorText);
      throw new Error('Failed to initiate Gmail auth. Please check if Cloud Functions are deployed.');
    }

    const result = await response.json();
    return result.result || result;
  } catch (error: any) {
    console.error('Connect Gmail error:', error);
    throw new Error(error.message || 'Failed to connect Gmail');
  }
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

  try {
    const idToken = await user.getIdToken();
    
    const response = await fetch(`${FUNCTIONS_BASE_URL}/syncGmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ data: { daysBack } })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sync error:', errorText);
      
      if (errorText.includes('not-found')) {
        throw new Error('No Gmail connection found. Please connect Gmail first.');
      }
      
      throw new Error('Failed to sync Gmail. Please try again.');
    }

    const result = await response.json();
    return result.result || result;
  } catch (error: any) {
    console.error('Sync Gmail error:', error);
    throw new Error(error.message || 'Failed to sync Gmail');
  }
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
