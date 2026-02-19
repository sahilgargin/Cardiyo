const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');

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

const CARD_FIXES = {
  'adib-cashback-card': {
    network: 'Visa',
    imageUrl: null // Will remove broken image
  }
};

async function fixADIBCards() {
  console.log('\n🔧 Fixing ADIB cards...');
  
  for (const [cardId, updates] of Object.entries(CARD_FIXES)) {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    
    if (cardDoc.exists()) {
      await updateDoc(cardRef, updates);
      console.log(`  ✓ Fixed ${cardId}:`, updates);
    } else {
      console.log(`  ⚠️  Card ${cardId} not found`);
    }
  }
  
  console.log('\n✅ Done!');
  process.exit(0);
}

fixADIBCards().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
