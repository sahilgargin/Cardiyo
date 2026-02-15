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
  console.log('\n🌱 Seeding app branding...');
  
  // App branding
  await setDoc(doc(db, 'branding', 'app'), {
    primaryGradient: {
      colors: ['#9BFF32', '#3DEEFF'],
      angle: 135
    },
    secondaryGradient: {
      colors: ['#FF97EB', '#FFA97C'],
      angle: 135
    },
    backgroundColor: '#060612',
    surfaceColor: '#1a1a1a',
    textPrimary: '#F9F9F9',
    textSecondary: '#888888',
    success: '#9BFF32',
    error: '#FF6B6B',
    warning: '#FFB800',
    tagline: 'Smart cards, smarter offers'
  });
  console.log('  ✓ App branding');

  // Categories
  const categories = [
    { id: 'dining', name: 'Dining', emoji: '🍽️', gradient: { colors: ['#FF6B6B', '#FF8E53'], angle: 135 } },
    { id: 'shopping', name: 'Shopping', emoji: '🛍️', gradient: { colors: ['#9BFF32', '#3DEEFF'], angle: 135 } },
    { id: 'entertainment', name: 'Entertainment', emoji: '🎬', gradient: { colors: ['#FF97EB', '#D994FF'], angle: 135 } },
    { id: 'travel', name: 'Travel', emoji: '✈️', gradient: { colors: ['#3DEEFF', '#4A9FFF'], angle: 135 } },
    { id: 'wellness', name: 'Wellness', emoji: '💪', gradient: { colors: ['#FFEFA0', '#FFA97C'], angle: 135 } },
    { id: 'fuel', name: 'Fuel', emoji: '⛽', gradient: { colors: ['#FFB800', '#FF8E53'], angle: 135 } },
  ];

  for (const category of categories) {
    await setDoc(doc(db, 'branding/categories/items', category.id), category);
    console.log(`  ✓ Category: ${category.name}`);
  }

  // Banks with country data
  const banks = [
    // UAE Banks
    { id: 'emirates-nbd', name: 'Emirates NBD', logo: '', country: 'AE' },
    { id: 'adcb', name: 'ADCB', logo: '', country: 'AE' },
    { id: 'mashreq', name: 'Mashreq Bank', logo: '', country: 'AE' },
    { id: 'fab', name: 'First Abu Dhabi Bank', logo: '', country: 'AE' },
    { id: 'rakbank', name: 'RAKBANK', logo: '', country: 'AE' },
    
    // Saudi Banks
    { id: 'alrajhi', name: 'Al Rajhi Bank', logo: '', country: 'SA' },
    { id: 'sab', name: 'Saudi Awwal Bank', logo: '', country: 'SA' },
    { id: 'alinma', name: 'Alinma Bank', logo: '', country: 'SA' },
    { id: 'riyad', name: 'Riyad Bank', logo: '', country: 'SA' },
  ];

  for (const bank of banks) {
    await setDoc(doc(db, 'banks', bank.id), bank);
    console.log(`  ✓ Bank: ${bank.name} (${bank.country})`);
  }

  console.log('✅ App branding seeded!');
}

module.exports = { seedBranding };
