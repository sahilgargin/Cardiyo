import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface Bank {
  id: string;
  name: string;
  logo?: string;
  country: 'AE' | 'SA'; // UAE or Saudi Arabia
}

export async function getBanksByCountry(countryCode: 'AE' | 'SA'): Promise<Bank[]> {
  try {
    console.log('Fetching banks for country:', countryCode);
    const banksQuery = query(
      collection(db, 'banks'),
      where('country', '==', countryCode)
    );
    
    const snapshot = await getDocs(banksQuery);
    console.log('Banks found:', snapshot.size);
    
    const banks = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      logo: doc.data().logo,
      country: doc.data().country,
    }));
    
    return banks;
  } catch (error) {
    console.error('Error fetching banks:', error);
    return [];
  }
}

export async function getAllBanks(): Promise<Bank[]> {
  try {
    const snapshot = await getDocs(collection(db, 'banks'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      logo: doc.data().logo,
      country: doc.data().country,
    }));
  } catch (error) {
    console.error('Error fetching all banks:', error);
    return [];
  }
}
