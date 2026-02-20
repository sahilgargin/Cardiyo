import { db, auth } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

export interface Area {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export async function detectUserArea(): Promise<string> {
  try {
    const user = auth.currentUser;
    
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists() && userDoc.data().area) {
        console.log('📍 Using saved area:', userDoc.data().area);
        return userDoc.data().area;
      }
    }

    // Return default prompt to select area
    console.log('📍 No saved area, prompting user to select');
    return 'Tap to select your area';
  } catch (error) {
    console.error('Error detecting area:', error);
    return 'Tap to select your area';
  }
}

export async function getAllAreas(): Promise<Area[]> {
  try {
    const areasSnapshot = await getDocs(collection(db, 'areas'));
    
    const areas = areasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Area[];
    
    areas.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`📍 Loaded ${areas.length} areas`);
    return areas;
  } catch (error) {
    console.error('Error getting areas:', error);
    return [];
  }
}
