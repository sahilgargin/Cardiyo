import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  category: string;
  categoryEmoji: string;
  type: 'nearby' | 'online';
  location?: string;
  distance?: number;
  merchantName: string;
  cardId?: string;
  cardName?: string;
  bankName?: string;
  expiryDate: string;
  termsAndConditions: string;
  gradient: [string, string];
}

export async function getOffersByLocation(
  userLat: number, 
  userLng: number, 
  radiusKm: number = 10,
  categoryFilter?: string
): Promise<Offer[]> {
  try {
    let offersQuery = collection(db, 'offers');
    
    if (categoryFilter) {
      offersQuery = query(offersQuery, where('category', '==', categoryFilter)) as any;
    }

    const offersSnapshot = await getDocs(offersQuery);
    const offers: Offer[] = [];

    for (const offerDoc of offersSnapshot.docs) {
      const data = offerDoc.data();
      
      let distance: number | undefined;
      if (data.type === 'nearby' && data.latitude && data.longitude) {
        distance = calculateDistance(userLat, userLng, data.latitude, data.longitude);
        if (distance > radiusKm) continue;
      }

      let categoryData: any = null;
      try {
        const categoryDoc = await getDoc(doc(db, 'branding/categories/items', data.category));
        categoryData = categoryDoc.exists() ? categoryDoc.data() : null;
      } catch (error) {
        // Silent fail
      }

      offers.push({
        id: offerDoc.id,
        title: data.title,
        description: data.description,
        discount: data.discount,
        category: data.category,
        categoryEmoji: categoryData?.emoji || '🏷️',
        type: data.type,
        location: data.location,
        distance: distance,
        merchantName: data.merchantName,
        cardId: data.cardId,
        cardName: data.cardName,
        bankName: data.bankName,
        expiryDate: data.expiryDate,
        termsAndConditions: data.termsAndConditions,
        gradient: categoryData?.gradient?.colors || ['#9BFF32', '#3DEEFF'],
      });
    }

    return offers.sort((a, b) => {
      if (a.distance && b.distance) return a.distance - b.distance;
      if (a.distance) return -1;
      if (b.distance) return 1;
      return 0;
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
}

export async function getOffersByCard(userId: string): Promise<Offer[]> {
  try {
    const userCardsSnapshot = await getDocs(collection(db, 'users', userId, 'cards'));
    const userCardIds = userCardsSnapshot.docs.map(doc => doc.data().cardId);

    if (userCardIds.length === 0) return [];

    const offersSnapshot = await getDocs(collection(db, 'offers'));
    const offers: Offer[] = [];
    
    for (const offerDoc of offersSnapshot.docs) {
      const data = offerDoc.data();
      
      if (!userCardIds.includes(data.cardId)) continue;
      
      let categoryData: any = null;
      try {
        const categoryDoc = await getDoc(doc(db, 'branding/categories/items', data.category));
        categoryData = categoryDoc.exists() ? categoryDoc.data() : null;
      } catch (error) {
        // Silent fail
      }

      offers.push({
        id: offerDoc.id,
        title: data.title,
        description: data.description,
        discount: data.discount,
        category: data.category,
        categoryEmoji: categoryData?.emoji || '🏷️',
        type: data.type,
        location: data.location,
        merchantName: data.merchantName,
        cardId: data.cardId,
        cardName: data.cardName,
        bankName: data.bankName,
        expiryDate: data.expiryDate,
        termsAndConditions: data.termsAndConditions,
        gradient: categoryData?.gradient?.colors || ['#9BFF32', '#3DEEFF'],
      });
    }

    return offers;
  } catch (error) {
    console.error('Error fetching card offers:', error);
    return [];
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
