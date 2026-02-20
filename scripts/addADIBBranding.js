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

const ADIB_BRANDING = {
  'adib-cashback-card': {
    gradient: { colors: ['#27AE60', '#229954'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#F1C40F',
    accentColor: '#F39C12',
    networkLogo: 'visa',
    pattern: 'cashback'
  },
  'adib-share-infinite': {
    gradient: { colors: ['#1a1a2e', '#0f3460'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#FFD700',
    accentColor: '#FFD700',
    networkLogo: 'visa',
    pattern: 'infinite'
  },
  'adib-share-platinum': {
    gradient: { colors: ['#2C3E50', '#34495E'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#C0C0C0',
    accentColor: '#3498DB',
    networkLogo: 'visa',
    pattern: 'geometric'
  },
  'adib-share-classic': {
    gradient: { colors: ['#34495E', '#2C3E50'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#BDC3C7',
    accentColor: '#1ABC9C',
    networkLogo: 'visa',
    pattern: 'waves'
  }
};

async function addADIBBranding() {
  console.log('\n🎨 Adding ADIB card branding...');
  
  for (const [cardId, branding] of Object.entries(ADIB_BRANDING)) {
    await setDoc(doc(db, 'branding/cards/items', cardId), branding);
    console.log(`  ✓ Added branding for ${cardId}`);
  }
  
  console.log('\n✅ Done!');
  process.exit(0);
}

addADIBBranding().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
