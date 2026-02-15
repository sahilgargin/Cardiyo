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

const offers = [
  {
    id: 'offer-1',
    title: '20% Off at Top Restaurants',
    description: 'Enjoy dining discounts at over 100 premium restaurants across Dubai',
    discount: '20% OFF',
    category: 'dining',
    type: 'nearby',
    location: 'Dubai Mall',
    latitude: 25.1972,
    longitude: 55.2744,
    merchantName: 'Multiple Restaurants',
    cardId: 'emirates-nbd-platinum',
    cardName: 'Emirates NBD Platinum',
    bankName: 'Emirates NBD',
    expiryDate: '2026-12-31',
    termsAndConditions: 'Valid on weekdays only. Maximum discount AED 100 per transaction.',
  },
  {
    id: 'offer-2',
    title: 'Buy 1 Get 1 Movie Tickets',
    description: 'Get a free movie ticket when you buy one at VOX Cinemas',
    discount: 'BOGO',
    category: 'entertainment',
    type: 'nearby',
    location: 'Mall of Emirates',
    latitude: 25.1180,
    longitude: 55.2006,
    merchantName: 'VOX Cinemas',
    cardId: 'adcb-traveller',
    cardName: 'ADCB Traveller',
    bankName: 'ADCB',
    expiryDate: '2026-06-30',
    termsAndConditions: 'Valid Monday to Thursday only. Not valid on public holidays.',
  },
  {
    id: 'offer-3',
    title: '50% Off Shopping at Noon',
    description: 'Get up to 50% discount on fashion, electronics, and home items',
    discount: '50% OFF',
    category: 'shopping',
    type: 'online',
    merchantName: 'Noon.com',
    cardId: 'emirates-nbd-platinum',
    cardName: 'Emirates NBD Platinum',
    bankName: 'Emirates NBD',
    expiryDate: '2026-12-31',
    termsAndConditions: 'Maximum discount AED 200. Valid on selected categories.',
  },
  {
    id: 'offer-4',
    title: 'Free Delivery on Amazon',
    description: 'Get free same-day delivery on orders over AED 100',
    discount: 'FREE DELIVERY',
    category: 'shopping',
    type: 'online',
    merchantName: 'Amazon.ae',
    cardId: 'adcb-traveller',
    cardName: 'ADCB Traveller',
    bankName: 'ADCB',
    expiryDate: '2026-12-31',
    termsAndConditions: 'Valid for Prime members. Minimum order AED 100.',
  },
  {
    id: 'offer-5',
    title: '2 AED per Litre Cashback on Fuel',
    description: 'Get AED 2 cashback per litre at ENOC and EPPCO stations',
    discount: 'AED 2/L',
    category: 'fuel',
    type: 'nearby',
    location: 'All UAE',
    latitude: 25.2048,
    longitude: 55.2708,
    merchantName: 'ENOC/EPPCO',
    cardId: 'emirates-nbd-platinum',
    cardName: 'Emirates NBD Platinum',
    bankName: 'Emirates NBD',
    expiryDate: '2026-12-31',
    termsAndConditions: 'Maximum cashback AED 50 per month. Valid at participating stations.',
  },
  {
    id: 'offer-6',
    title: 'Spa & Wellness 30% Off',
    description: 'Relax and rejuvenate with 30% off at premium spas',
    discount: '30% OFF',
    category: 'wellness',
    type: 'nearby',
    location: 'Jumeirah',
    latitude: 25.2285,
    longitude: 55.2609,
    merchantName: 'Talise Spa',
    cardId: 'adcb-traveller',
    cardName: 'ADCB Traveller',
    bankName: 'ADCB',
    expiryDate: '2026-09-30',
    termsAndConditions: 'Advance booking required. Valid Monday to Friday.',
  },
];

async function seedOffers() {
  console.log('\n🌱 Seeding offers...');
  
  for (const offer of offers) {
    await setDoc(doc(db, 'offers', offer.id), offer);
    console.log(`  ✓ ${offer.title}`);
  }
  
  console.log('✅ Offers seeded!');
}

module.exports = { seedOffers };
