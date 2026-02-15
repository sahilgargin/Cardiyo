import { db } from '../firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export interface Gradient {
  colors: [string, string];
  angle: number;
}

export interface AppBranding {
  appName: string;
  tagline: string;
  backgroundColor: string;
  surfaceColor: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  primaryGradient: Gradient;
  secondaryGradient: Gradient;
}

export interface CategoryBranding {
  id: string;
  name: string;
  icon: string;
  emoji: string;
  gradient: Gradient;
  description: string;
}

export interface CardBranding {
  gradient: Gradient;
  textColor: string;
  chipColor: string;
  networkLogo: string;
}

// Cache
let appBrandingCache: AppBranding | null = null;
let categoriesCache: CategoryBranding[] | null = null;

export async function getAppBranding(): Promise<AppBranding> {
  if (appBrandingCache) return appBrandingCache;

  try {
    const docRef = doc(db, 'branding', 'app');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      appBrandingCache = docSnap.data() as AppBranding;
      return appBrandingCache;
    }
  } catch (error) {
    console.error('Error fetching app branding:', error);
  }

  // Fallback
  return {
    appName: 'Cardiyo',
    tagline: 'Smart cards, smarter offers',
    backgroundColor: '#060612',
    surfaceColor: '#1a1a1a',
    textPrimary: '#F9F9F9',
    textSecondary: '#888888',
    success: '#9BFF32',
    error: '#FF97EB',
    warning: '#FFEFA0',
    info: '#3DEEFF',
    primaryGradient: { colors: ['#9BFF32', '#3DEEFF'], angle: 45 },
    secondaryGradient: { colors: ['#FF97EB', '#FFA97C'], angle: 45 },
  };
}

export async function getAllCategories(): Promise<CategoryBranding[]> {
  if (categoriesCache) return categoriesCache;

  try {
    const categoriesRef = collection(db, 'branding/categories/items');
    const snapshot = await getDocs(categoriesRef);
    
    categoriesCache = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CategoryBranding));
    
    return categoriesCache;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCardBranding(cardId: string, bankId: string): Promise<CardBranding> {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardSnap = await getDoc(cardRef);

    if (cardSnap.exists()) {
      const cardData = cardSnap.data();
      return {
        gradient: cardData.gradient || { colors: ['#2C3E50', '#1A252F'], angle: 135 },
        textColor: cardData.textColor || '#FFFFFF',
        chipColor: cardData.chipColor || '#FFD700',
        networkLogo: cardData.networkLogo || 'mastercard',
      };
    }
  } catch (error) {
    console.error('Error fetching card branding:', error);
  }

  // Fallback
  return {
    gradient: { colors: ['#2C3E50', '#1A252F'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#FFD700',
    networkLogo: 'mastercard',
  };
}
