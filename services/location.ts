import { db, auth } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

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
      // Check if user has saved area
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists() && userDoc.data().area) {
        console.log('📍 Using saved area:', userDoc.data().area);
        return userDoc.data().area;
      }
    }
    
    // Default to Downtown Dubai for new users
    console.log('📍 Using default area: Downtown Dubai');
    return 'Downtown Dubai';
  } catch (error) {
    console.error('Error detecting area:', error);
    return 'Dubai';
  }
}

export async function getAllAreas(): Promise<Area[]> {
  try {
    const areasSnapshot = await getDocs(collection(db, 'areas'));
    
    const areas = areasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Area[];
    
    // Sort by name
    areas.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`📍 Loaded ${areas.length} areas from Firestore`);
    return areas;
  } catch (error) {
    console.error('Error getting areas:', error);
    return [];
  }
}
