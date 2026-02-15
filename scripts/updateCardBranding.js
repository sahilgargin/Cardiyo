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

const cardBrandings = [
  // Emirates NBD Cards
  {
    id: 'emirates-nbd-platinum',
    gradient: { colors: ['#2C3E50', '#34495E'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#D4AF37',
    networkLogo: 'mastercard',
    pattern: 'geometric',
    accentColor: '#C41E3A',
  },
  {
    id: 'emirates-nbd-infinite',
    gradient: { colors: ['#1A1A2E', '#16213E'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#FFD700',
    networkLogo: 'visa',
    pattern: 'waves',
    accentColor: '#C41E3A',
  },
  {
    id: 'emirates-nbd-signature',
    gradient: { colors: ['#8B0000', '#A52A2A'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#FFD700',
    networkLogo: 'visa',
    pattern: 'dots',
    accentColor: '#FFD700',
  },

  // ADCB Cards
  {
    id: 'adcb-traveller',
    gradient: { colors: ['#1E3A8A', '#1E40AF'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#60A5FA',
    networkLogo: 'visa',
    pattern: 'travel',
    accentColor: '#3B82F6',
  },
  {
    id: 'adcb-islamic',
    gradient: { colors: ['#065F46', '#047857'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#D4AF37',
    networkLogo: 'mastercard',
    pattern: 'islamic',
    accentColor: '#10B981',
  },
  {
    id: 'adcb-touchpoints',
    gradient: { colors: ['#7C3AED', '#6D28D9'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#A78BFA',
    networkLogo: 'visa',
    pattern: 'dots',
    accentColor: '#8B5CF6',
  },

  // Mashreq Cards
  {
    id: 'mashreq-platinum',
    gradient: { colors: ['#374151', '#1F2937'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#9CA3AF',
    networkLogo: 'visa',
    pattern: 'lines',
    accentColor: '#E31E24',
  },
  {
    id: 'mashreq-skywards',
    gradient: { colors: ['#0C4A6E', '#075985'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#D4AF37',
    networkLogo: 'visa',
    pattern: 'skywards',
    accentColor: '#0EA5E9',
  },
  {
    id: 'mashreq-cashback',
    gradient: { colors: ['#B91C1C', '#991B1B'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#FCD34D',
    networkLogo: 'mastercard',
    pattern: 'cashback',
    accentColor: '#F59E0B',
  },
];

async function updateCardBranding() {
  console.log('\n🎨 Updating card branding...');
  
  for (const branding of cardBrandings) {
    await setDoc(doc(db, 'branding/cards/items', branding.id), branding);
    console.log(`  ✓ ${branding.id}`);
  }
  
  console.log('✅ Card branding updated!');
}

module.exports = { updateCardBranding };
