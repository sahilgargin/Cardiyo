import { db, auth } from '../firebaseConfig';
import { collection, query, getDocs, doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { getCardBranding, CardBranding } from './branding';

export interface UserCard {
  id: string;
  cardId: string;
  bankId: string;
  cardName: string;
  bankName: string;
  cardType: string;
  lastFourDigits: string;
  addedAt: Date;
  branding: CardBranding;
}

export interface BankOption {
  id: string;
  name: string;
  logo?: string;
}

export interface CardOption {
  id: string;
  name: string;
  type: string;
  benefits: string[];
}

export async function getUserCards(): Promise<UserCard[]> {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const cardsRef = collection(db, 'users', user.uid, 'cards');
    const snapshot = await getDocs(query(cardsRef));
    
    const userCards: UserCard[] = [];
    
    for (const cardDoc of snapshot.docs) {
      const cardData = cardDoc.data();
      
      const cardRef = doc(db, 'cards', cardData.cardId);
      const cardSnap = await getDoc(cardRef);
      
      if (!cardSnap.exists()) continue;
      
      const card = cardSnap.data();
      
      const bankRef = doc(db, 'banks', cardData.bankId);
      const bankSnap = await getDoc(bankRef);
      
      if (!bankSnap.exists()) continue;
      
      const bank = bankSnap.data();
      const branding = await getCardBranding(cardData.cardId, cardData.bankId);
      
      userCards.push({
        id: cardDoc.id,
        cardId: cardData.cardId,
        bankId: cardData.bankId,
        cardName: card.name,
        bankName: bank.name,
        cardType: card.type,
        lastFourDigits: cardData.lastFourDigits || '****',
        addedAt: cardData.addedAt?.toDate() || new Date(),
        branding: branding,
      });
    }
    
    return userCards;
  } catch (error) {
    console.error('Error getting user cards:', error);
    return [];
  }
}

export async function getAllBanks(): Promise<BankOption[]> {
  try {
    const banksSnapshot = await getDocs(collection(db, 'banks'));
    
    return banksSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      logo: doc.data().logo,
    }));
  } catch (error) {
    console.error('Error getting banks:', error);
    return [];
  }
}

export async function getCardsByBank(bankId: string): Promise<CardOption[]> {
  try {
    const cardsSnapshot = await getDocs(collection(db, 'cards'));
    
    return cardsSnapshot.docs
      .filter(doc => doc.data().bankId === bankId)
      .map(doc => ({
        id: doc.id,
        name: doc.data().name,
        type: doc.data().type,
        benefits: doc.data().benefits || [],
      }));
  } catch (error) {
    console.error('Error getting cards:', error);
    return [];
  }
}

export async function addCardToUser(bankId: string, cardId: string, lastFourDigits: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const cardsRef = collection(db, 'users', user.uid, 'cards');
    await addDoc(cardsRef, {
      bankId,
      cardId,
      lastFourDigits,
      addedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error adding card:', error);
    return false;
  }
}

export async function removeCard(userCardId: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    await deleteDoc(doc(db, 'users', user.uid, 'cards', userCardId));
    return true;
  } catch (error) {
    console.error('Error removing card:', error);
    return false;
  }
}
