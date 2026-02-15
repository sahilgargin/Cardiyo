const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCChFeHHxvFmijMsVEsG0xUPoSn_bZwIJ4",
  authDomain: "my-vibe-app-af0db.firebaseapp.com",
  projectId: "my-vibe-app-af0db",
  storageBucket: "my-vibe-app-af0db.firebasestorage.app",
  messagingSenderId: "260028785813",
  appId: "1:260028785813:web:1eec8dadb13137fe3b279c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cards = [
  // Emirates NBD Cards
  {
    id: 'emirates-nbd-platinum',
    bankId: 'emirates-nbd',
    name: 'Platinum Credit Card',
    type: 'Platinum',
    network: 'mastercard',
    benefits: [
      'Lounge access at Dubai Airport',
      '2x rewards on dining',
      'Travel insurance up to $500K',
      'No foreign transaction fees'
    ],
    annualFee: 0,
    rewardRate: '2 points per AED',
    featured: true,
  },
  {
    id: 'emirates-nbd-infinite',
    bankId: 'emirates-nbd',
    name: 'Infinite Credit Card',
    type: 'Infinite',
    network: 'visa',
    benefits: [
      'Unlimited lounge access worldwide',
      '5x rewards on international spend',
      'Complimentary golf rounds',
      'Personal concierge service'
    ],
    annualFee: 2000,
    rewardRate: '5 points per AED',
    featured: true,
  },
  {
    id: 'emirates-nbd-signature',
    bankId: 'emirates-nbd',
    name: 'Signature Credit Card',
    type: 'Signature',
    network: 'visa',
    benefits: [
      '4x rewards on shopping',
      'Complimentary movie tickets',
      'Airport meet & greet',
      'Dining discounts up to 25%'
    ],
    annualFee: 800,
    rewardRate: '4 points per AED',
    featured: false,
  },

  // ADCB Cards
  {
    id: 'adcb-traveller',
    bankId: 'adcb',
    name: 'Traveller Credit Card',
    type: 'Traveller',
    network: 'visa',
    benefits: [
      '3 miles per AED on travel',
      'Free airport transfers',
      'Travel insurance',
      'No forex markup'
    ],
    annualFee: 500,
    rewardRate: '3 miles per AED',
    featured: true,
  },
  {
    id: 'adcb-islamic',
    bankId: 'adcb',
    name: 'Islamic Credit Card',
    type: 'Islamic Gold',
    network: 'mastercard',
    benefits: [
      'Sharia compliant',
      '2x rewards on all purchases',
      'Cashback on utilities',
      'Free supplementary cards'
    ],
    annualFee: 0,
    rewardRate: '2 points per AED',
    featured: false,
  },
  {
    id: 'adcb-touchpoints',
    bankId: 'adcb',
    name: 'TouchPoints Credit Card',
    type: 'TouchPoints Platinum',
    network: 'visa',
    benefits: [
      '10x points on dining',
      'Entertainment discounts',
      'Fuel cashback',
      'Partner merchant offers'
    ],
    annualFee: 300,
    rewardRate: '10 points per AED on dining',
    featured: true,
  },

  // Mashreq Cards
  {
    id: 'mashreq-platinum',
    bankId: 'mashreq',
    name: 'Platinum Credit Card',
    type: 'Platinum',
    network: 'visa',
    benefits: [
      'Airport lounge access',
      'Dining privileges',
      'Shopping rewards',
      'Travel benefits'
    ],
    annualFee: 400,
    rewardRate: '3 points per AED',
    featured: false,
  },
  {
    id: 'mashreq-skywards',
    bankId: 'mashreq',
    name: 'Emirates Skywards Credit Card',
    type: 'Skywards Signature',
    network: 'visa',
    benefits: [
      'Earn Skywards miles',
      'Business class discounts',
      'Free companion tickets',
      'Priority check-in'
    ],
    annualFee: 1500,
    rewardRate: '4 Skywards miles per AED',
    featured: true,
  },
  {
    id: 'mashreq-cashback',
    bankId: 'mashreq',
    name: 'Cashback Credit Card',
    type: 'Cashback Gold',
    network: 'mastercard',
    benefits: [
      '5% cashback on fuel',
      '3% cashback on groceries',
      'No minimum spend',
      'Instant cashback'
    ],
    annualFee: 0,
    rewardRate: 'Up to 5% cashback',
    featured: true,
  },
];

async function seedCards() {
  console.log('\n🃏 Seeding credit cards...');
  
  for (const card of cards) {
    await setDoc(doc(db, 'cards', card.id), card);
    console.log(`  ✓ ${card.name} (${card.type})`);
  }
  
  console.log('✅ Cards seeded!');
}

module.exports = { seedCards };
