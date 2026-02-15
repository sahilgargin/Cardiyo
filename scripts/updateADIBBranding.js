const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, writeBatch } = require('firebase/firestore');

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

const CARD_DESIGNS = {
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
  'adib-cashback-card': {
    gradient: { colors: ['#27AE60', '#229954'], angle: 135 },
    textColor: '#FFFFFF',
    chipColor: '#F1C40F',
    accentColor: '#F39C12',
    networkLogo: 'visa',
    pattern: 'cashback'
  }
};

async function updateADIBBranding() {
  console.log('Updating ADIB card branding...');
  
  for (const [cardId, design] of Object.entries(CARD_DESIGNS)) {
    await setDoc(doc(db, 'branding/cards/items', cardId), design);
    console.log('Updated:', cardId);
  }
  
  console.log('Done!');
}

updateADIBBranding()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
