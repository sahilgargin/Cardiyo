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
  if (!user) {
    console.log('No user logged in');
    return [];
  }

  try {
    console.log('Fetching cards for user:', user.uid);
    const cardsRef = collection(db, 'users', user.uid, 'cards');
    const snapshot = await getDocs(query(cardsRef));
    
    console.log('User cards found:', snapshot.size);
    
    const userCards: UserCard[] = [];
    
    for (const cardDoc of snapshot.docs) {
      const cardData = cardDoc.data();
      console.log('Processing card:', cardDoc.id, cardData);
      
      // Get card details from cards collection
      const cardRef = doc(db, 'cards', cardData.cardId);
      const cardSnap = await getDoc(cardRef);
      
      if (!cardSnap.exists()) {
        console.log('Card not found in cards collection:', cardData.cardId);
        continue;
      }
      
      const card = cardSnap.data();
      console.log('Card details:', card);
      
      // Get bank details
      const bankRef = doc(db, 'banks', cardData.bankId);
      const bankSnap = await getDoc(bankRef);
      
      if (!bankSnap.exists()) {
        console.log('Bank not found:', cardData.bankId);
        continue;
      }
      
      const bank = bankSnap.data();
      console.log('Bank details:', bank);
      
      // Get card branding
      const branding = await getCardBranding(cardData.cardId, cardData.bankId);
      console.log('Card branding:', branding);
      
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
    
    console.log('Total user cards loaded:', userCards.length);
    return userCards;
  } catch (error) {
    console.error('Error getting user cards:', error);
    return [];
  }
}

export async function getAllBanks(): Promise<BankOption[]> {
  try {
    console.log('Fetching all banks...');
    const banksSnapshot = await getDocs(collection(db, 'banks'));
    console.log('Banks found:', banksSnapshot.size);
    
    const banks = banksSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      logo: doc.data().logo,
    }));
    
    console.log('Banks:', banks);
    return banks;
  } catch (error) {
    console.error('Error getting banks:', error);
    return [];
  }
}

export async function getCardsByBank(bankId: string): Promise<CardOption[]> {
  try {
    console.log('Fetching cards for bank:', bankId);
    const cardsSnapshot = await getDocs(collection(db, 'cards'));
    
    const cards = cardsSnapshot.docs
      .filter(doc => doc.data().bankId === bankId)
      .map(doc => ({
        id: doc.id,
        name: doc.data().name,
        type: doc.data().type,
        benefits: doc.data().benefits || [],
      }));
    
    console.log('Cards found for bank:', cards.length, cards);
    return cards;
  } catch (error) {
    console.error('Error getting cards:', error);
    return [];
  }
}

export async function addCardToUser(bankId: string, cardId: string, lastFourDigits: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) {
    console.log('Cannot add card: No user logged in');
    return false;
  }

  try {
    console.log('Adding card to user:', { userId: user.uid, bankId, cardId, lastFourDigits });
    const cardsRef = collection(db, 'users', user.uid, 'cards');
    const docRef = await addDoc(cardsRef, {
      bankId,
      cardId,
      lastFourDigits,
      addedAt: new Date(),
    });
    console.log('Card added successfully with ID:', docRef.id);
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
    console.log('Card removed successfully');
    return true;
  } catch (error) {
    console.error('Error removing card:', error);
    return false;
  }
}
