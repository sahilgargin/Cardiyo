const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection } = require('firebase/firestore');

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

async function seedBranding() {
  console.log('🌱 Starting branding seed...\n');

  // 1. App Branding
  console.log('📱 Seeding app branding...');
  await setDoc(doc(db, 'branding', 'app'), {
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
    primaryGradient: {
      colors: ['#9BFF32', '#3DEEFF'],
      angle: 45
    },
    secondaryGradient: {
      colors: ['#FF97EB', '#FFA97C'],
      angle: 45
    }
  });
  console.log('  ✓ App branding');

  // 2. Categories
  console.log('\n🏷️  Seeding categories...');
  const categories = [
    {
      id: 'dining',
      name: 'Dining',
      icon: 'restaurant',
      emoji: '🍽️',
      gradient: { colors: ['#FF97EB', '#FFEFA0'], angle: 135 },
      description: 'Restaurants, cafes, and food delivery'
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: 'cart',
      emoji: '🛍️',
      gradient: { colors: ['#9BFF32', '#3DEEFF'], angle: 135 },
      description: 'Retail stores and online shopping'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: 'film',
      emoji: '🎬',
      gradient: { colors: ['#D994FF', '#FFA97C'], angle: 135 },
      description: 'Movies, concerts, and events'
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: 'airplane',
      emoji: '✈️',
      gradient: { colors: ['#3DEEFF', '#9BFF32'], angle: 135 },
      description: 'Flights, hotels, and bookings'
    },
    {
      id: 'wellness',
      name: 'Wellness',
      icon: 'fitness',
      emoji: '💪',
      gradient: { colors: ['#FFA97C', '#FF97EB'], angle: 135 },
      description: 'Gym, spa, and health'
    },
    {
      id: 'fuel',
      name: 'Fuel',
      icon: 'car',
      emoji: '⛽',
      gradient: { colors: ['#FFEFA0', '#D994FF'], angle: 135 },
      description: 'Petrol stations and charging'
    }
  ];

  for (const category of categories) {
    await setDoc(doc(db, 'branding/categories/items', category.id), category);
    console.log(`  ✓ ${category.name}`);
  }

  // 3. Banks
  console.log('\n🏦 Seeding banks...');
  const banks = [
    {
      id: 'emirates-nbd',
      name: 'Emirates NBD',
      logo: 'https://example.com/enbd-logo.png',
      gradient: { colors: ['#C41E3A', '#8B1428'], angle: 135 },
      accentColor: '#FFD700'
    },
    {
      id: 'adcb',
      name: 'ADCB',
      logo: 'https://example.com/adcb-logo.png',
      gradient: { colors: ['#005EB8', '#003D82'], angle: 135 },
      accentColor: '#87CEEB'
    },
    {
      id: 'mashreq',
      name: 'Mashreq',
      logo: 'https://example.com/mashreq-logo.png',
      gradient: { colors: ['#E31E24', '#B71C1C'], angle: 135 },
      accentColor: '#FFD700'
    }
  ];

  for (const bank of banks) {
    await setDoc(doc(db, 'banks', bank.id), bank);
    console.log(`  ✓ ${bank.name}`);
  }

  // 4. Cards
  console.log('\n💳 Seeding cards...');
  const cards = [
    {
      id: 'emirates-nbd-platinum',
      bankId: 'emirates-nbd',
      name: 'Emirates NBD Platinum',
      type: 'Platinum',
      benefits: ['Lounge Access', 'Travel Insurance', '2X Points'],
      gradient: { colors: ['#2C3E50', '#1A252F'], angle: 135 },
      textColor: '#E8E8E8',
      chipColor: '#D4AF37',
      networkLogo: 'mastercard'
    },
    {
      id: 'adcb-traveller',
      bankId: 'adcb',
      name: 'ADCB Traveller',
      type: 'Gold',
      benefits: ['Travel Rewards', 'No Foreign Fees', 'Airport Transfers'],
      gradient: { colors: ['#1E3A8A', '#1E40AF'], angle: 135 },
      textColor: '#FFFFFF',
      chipColor: '#FFD700',
      networkLogo: 'visa'
    },
    {
      id: 'mashreq-cashback',
      bankId: 'mashreq',
      name: 'Mashreq Cashback',
      type: 'Signature',
      benefits: ['5% Cashback', 'Fuel Rewards', 'Dining Offers'],
      gradient: { colors: ['#7C2D12', '#991B1B'], angle: 135 },
      textColor: '#F5F5F5',
      chipColor: '#C0C0C0',
      networkLogo: 'mastercard'
    }
  ];

  for (const card of cards) {
    await setDoc(doc(db, 'cards', card.id), card);
    console.log(`  ✓ ${card.name}`);
  }

  console.log('\n✅ Branding seed complete!');
}

module.exports = { seedBranding };
