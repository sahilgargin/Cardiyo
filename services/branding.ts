import { db } from '../firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export interface AppBranding {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  primaryGradient: {
    colors: string[];
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
  darkGradient: {
    colors: string[];
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
  brandName: string;
  tagline: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export async function getAppBranding(): Promise<AppBranding> {
  try {
    const brandingDoc = await getDoc(doc(db, 'config', 'branding'));
    
    if (brandingDoc.exists()) {
      return brandingDoc.data() as AppBranding;
    }
  } catch (error) {
    console.error('Error loading branding:', error);
  }

  // Default branding
  return {
    primaryColor: '#9BFF32',
    secondaryColor: '#3DEEFF',
    backgroundColor: '#060612',
    surfaceColor: '#1a1a2e',
    textPrimary: '#FFFFFF',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    primaryGradient: {
      colors: ['#9BFF32', '#3DEEFF'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 }
    },
    darkGradient: {
      colors: ['#060612', '#1a1a2e', '#060612'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 }
    },
    brandName: 'Cardiyo',
    tagline: 'Smart credit card management'
  };
}

export async function getAllCategories(): Promise<Category[]> {
  return [
    { id: 'dining', name: 'Dining', icon: 'restaurant', color: '#FF6B6B' },
    { id: 'groceries', name: 'Groceries', icon: 'cart', color: '#4ECDC4' },
    { id: 'fuel', name: 'Fuel', icon: 'battery-charging', color: '#FFD93D' },
    { id: 'shopping', name: 'Shopping', icon: 'bag', color: '#FF8B94' },
    { id: 'entertainment', name: 'Entertainment', icon: 'game-controller', color: '#A8E6CF' },
    { id: 'travel', name: 'Travel', icon: 'airplane', color: '#9BFF32' },
    { id: 'transport', name: 'Transport', icon: 'car', color: '#95E1D3' },
    { id: 'healthcare', name: 'Healthcare', icon: 'medical', color: '#FF6B9D' },
    { id: 'utilities', name: 'Utilities', icon: 'flash', color: '#FFA07A' },
    { id: 'education', name: 'Education', icon: 'school', color: '#98D8C8' },
  ];
}
