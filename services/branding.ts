import { db } from '../firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export interface AppBranding {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  primaryGradient: {
    colors: string[];
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
  logo: string;
  appName: string;
  tagline: string;
}

export interface BankBranding {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  gradient: string[];
  country: string;
}

export interface CardBranding {
  gradient: string[];
  textColor: string;
  chipColor: string;
  accentColor: string;
  networkLogo: string;
  pattern?: string;
}

// Cache for branding data
let appBrandingCache: AppBranding | null = null;
let bankBrandingCache: Map<string, BankBranding> = new Map();
let cardBrandingCache: Map<string, CardBranding> = new Map();

/**
 * Get app-wide branding from Firestore
 */
export async function getAppBranding(): Promise<AppBranding> {
  try {
    // Return cache if available
    if (appBrandingCache) {
      return appBrandingCache;
    }

    const brandingDoc = await getDoc(doc(db, 'config', 'branding'));
    
    if (brandingDoc.exists()) {
      appBrandingCache = brandingDoc.data() as AppBranding;
      return appBrandingCache;
    }

    // Fallback to default if not in Firestore
    return getDefaultBranding();
  } catch (error) {
    console.error('Error fetching app branding:', error);
    return getDefaultBranding();
  }
}

/**
 * Get bank branding from Firestore
 */
export async function getBankBranding(bankId: string): Promise<BankBranding | null> {
  try {
    // Check cache
    if (bankBrandingCache.has(bankId)) {
      return bankBrandingCache.get(bankId)!;
    }

    const bankDoc = await getDoc(doc(db, 'config', 'banks', 'items', bankId));
    
    if (bankDoc.exists()) {
      const branding = bankDoc.data() as BankBranding;
      bankBrandingCache.set(bankId, branding);
      return branding;
    }

    return null;
  } catch (error) {
    console.error('Error fetching bank branding:', error);
    return null;
  }
}

/**
 * Get all banks branding
 */
export async function getAllBanksBranding(): Promise<BankBranding[]> {
  try {
    const banksSnapshot = await getDocs(collection(db, 'config', 'banks', 'items'));
    
    const banks: BankBranding[] = [];
    banksSnapshot.forEach(doc => {
      const branding = { id: doc.id, ...doc.data() } as BankBranding;
      bankBrandingCache.set(doc.id, branding);
      banks.push(branding);
    });

    return banks;
  } catch (error) {
    console.error('Error fetching all banks branding:', error);
    return [];
  }
}

/**
 * Get card branding from Firestore
 */
export async function getCardBranding(cardId: string): Promise<CardBranding> {
  try {
    // Check cache
    if (cardBrandingCache.has(cardId)) {
      return cardBrandingCache.get(cardId)!;
    }

    const cardDoc = await getDoc(doc(db, 'branding', 'cards', 'items', cardId));
    
    if (cardDoc.exists()) {
      const branding = cardDoc.data() as CardBranding;
      cardBrandingCache.set(cardId, branding);
      return branding;
    }

    // Return default if not found
    return getDefaultCardBranding();
  } catch (error) {
    console.error('Error fetching card branding:', error);
    return getDefaultCardBranding();
  }
}

/**
 * Clear branding cache (call this when branding is updated)
 */
export function clearBrandingCache() {
  appBrandingCache = null;
  bankBrandingCache.clear();
  cardBrandingCache.clear();
}

/**
 * Default app branding (fallback)
 */
function getDefaultBranding(): AppBranding {
  return {
    primaryColor: '#9BFF32',
    secondaryColor: '#3DEEFF',
    backgroundColor: '#060612',
    surfaceColor: '#1a1a1a',
    textPrimary: '#FFFFFF',
    textSecondary: '#999999',
    success: '#9BFF32',
    warning: '#FFD93D',
    error: '#FF6B6B',
    primaryGradient: {
      colors: ['#9BFF32', '#3DEEFF'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 }
    },
    logo: '💳',
    appName: 'Cardiyo',
    tagline: 'Smart credit card tracking for UAE',
  };
}

/**
 * Default card branding (fallback)
 */
function getDefaultCardBranding(): CardBranding {
  return {
    gradient: ['#1a1a1a', '#2a2a2a'],
    textColor: '#FFFFFF',
    chipColor: '#FFD700',
    accentColor: '#9BFF32',
    networkLogo: 'card',
  };
}
