const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

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

async function fixCashbackBranding() {
  console.log('\n🔧 Fixing ADIB Cashback Card branding...');
  
  // First check the card data
  const cardDoc = await getDoc(doc(db, 'cards', 'adib-cashback-card'));
  if (cardDoc.exists()) {
    console.log('\nCard data:');
    const data = cardDoc.data();
    console.log('  Network:', data.network);
    console.log('  Name:', data.name);
  }
  
  // Set correct branding
  const branding = {
    gradient: { 
      colors: ['#27AE60', '#229954'], 
      angle: 135 
    },
    textColor: '#FFFFFF',
    chipColor: '#F1C40F',
    accentColor: '#F39C12',
    networkLogo: 'visa',  // IMPORTANT: Visa not Mastercard
    pattern: 'cashback'
  };
  
  await setDoc(doc(db, 'branding/cards/items', 'adib-cashback-card'), branding);
  console.log('\n✅ Branding updated!');
  console.log('Network logo set to:', branding.networkLogo);
  
  // Verify
  const brandingDoc = await getDoc(doc(db, 'branding/cards/items', 'adib-cashback-card'));
  if (brandingDoc.exists()) {
    console.log('\nVerified branding:');
    console.log(JSON.stringify(brandingDoc.data(), null, 2));
  }
  
  process.exit(0);
}

fixCashbackBranding().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
