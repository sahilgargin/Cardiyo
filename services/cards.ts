import { db, auth } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, where } from 'firebase/firestore';

export interface UserCard {
  id: string;
  cardId: string;
  cardName: string;
  bankId: string;
  bankName: string;
  cardType: string;
  network: string;
  lastFourDigits: string;
  gradient: string[];
  createdAt: Date;
}

export interface Bank {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  country: string;
}

export interface Card {
  id: string;
  name: string;
  type: string;
  network: string;
  gradient: string[];
  bankId: string;
}

export async function getAllBanks(): Promise<Bank[]> {
  try {
    console.log('📊 Loading banks from Firestore...');
    const banksSnapshot = await getDocs(collection(db, 'config', 'banks', 'items'));
    
    const banks = banksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Bank[];
    
    console.log(`✅ Loaded ${banks.length} banks from Firestore`);
    return banks;
  } catch (error) {
    console.error('❌ Error loading banks:', error);
    return [];
  }
}

export async function getCardsByBank(bankId: string): Promise<Card[]> {
  try {
    console.log(`📊 Loading cards for bank: ${bankId}`);
    const cardsQuery = query(collection(db, 'cards'), where('bankId', '==', bankId));
    const cardsSnapshot = await getDocs(cardsQuery);
    
    const cards = cardsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Card[];
    
    console.log(`✅ Loaded ${cards.length} cards for ${bankId}`);
    return cards;
  } catch (error) {
    console.error('❌ Error loading cards:', error);
    return [];
  }
}

export async function addUserCard(cardData: {
  cardId: string;
  cardName: string;
  bankId: string;
  bankName: string;
  cardType: string;
  network: string;
  lastFourDigits: string;
  gradient: string[];
}): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }

  console.log('💳 Adding card to wallet:', cardData.cardName);

  const cardRef = await addDoc(collection(db, 'users', user.uid, 'cards'), {
    ...cardData,
    createdAt: serverTimestamp(),
  });

  console.log('✅ Card added:', cardRef.id);
  return cardRef.id;
}

export async function getUserCards(): Promise<UserCard[]> {
  const user = auth.currentUser;
  
  if (!user) {
    console.error('❌ No user logged in');
    return [];
  }

  console.log('📱 Loading user cards...');

  try {
    const cardsRef = collection(db, 'users', user.uid, 'cards');
    const snapshot = await getDocs(cardsRef);
    
    console.log(`📊 Found ${snapshot.size} cards`);

    if (snapshot.empty) {
      return [];
    }

    const cards = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      
      return {
        id: docSnap.id,
        cardId: data.cardId || '',
        cardName: data.cardName || '',
        bankId: data.bankId || '',
        bankName: data.bankName || '',
        cardType: data.cardType || '',
        network: data.network || 'Visa',
        lastFourDigits: data.lastFourDigits || '0000',
        gradient: data.gradient || ['#1a1a1a', '#2a2a2a'],
        createdAt: data.createdAt?.toDate?.() || new Date(),
      };
    }) as UserCard[];

    console.log(`✅ Loaded ${cards.length} user cards`);
    return cards;
  } catch (error: any) {
    console.error('❌ Error loading cards:', error);
    return [];
  }
}

export async function removeCard(cardId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  await deleteDoc(doc(db, 'users', user.uid, 'cards', cardId));
  console.log('✅ Card removed:', cardId);
}
