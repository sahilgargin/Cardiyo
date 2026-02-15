import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

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

export async function getOffersByLocation(userLat: number, userLng: number, radiusKm: number = 10): Promise<Offer[]> {
  try {
    const offersSnapshot = await getDocs(collection(db, 'offers'));
    const offers: Offer[] = [];

    for (const offerDoc of offersSnapshot.docs) {
      const data = offerDoc.data();
      
      // Calculate distance if it's a nearby offer
      let distance: number | undefined;
      if (data.type === 'nearby' && data.latitude && data.longitude) {
        distance = calculateDistance(userLat, userLng, data.latitude, data.longitude);
        
        // Skip if outside radius
        if (distance > radiusKm) continue;
      }

      // Get category branding - FIXED PATH
      let categoryData: any = null;
      try {
        const categoryDoc = await getDoc(doc(db, 'branding/categories/items', data.category));
        categoryData = categoryDoc.exists() ? categoryDoc.data() : null;
      } catch (error) {
        console.log('Category branding not found:', data.category);
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

    // Sort by distance (nearby first)
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
    // Get user's cards
    const userCardsSnapshot = await getDocs(collection(db, 'users', userId, 'cards'));
    const userCardIds = userCardsSnapshot.docs.map(doc => doc.data().cardId);

    if (userCardIds.length === 0) return [];

    // Get all offers and filter by user's cards
    const offersSnapshot = await getDocs(collection(db, 'offers'));
    
    const offers: Offer[] = [];
    for (const offerDoc of offersSnapshot.docs) {
      const data = offerDoc.data();
      
      // Skip if not for user's cards
      if (!userCardIds.includes(data.cardId)) continue;
      
      let categoryData: any = null;
      try {
        const categoryDoc = await getDoc(doc(db, 'branding/categories/items', data.category));
        categoryData = categoryDoc.exists() ? categoryDoc.data() : null;
      } catch (error) {
        console.log('Category branding not found:', data.category);
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
  const R = 6371; // Earth's radius in km
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
