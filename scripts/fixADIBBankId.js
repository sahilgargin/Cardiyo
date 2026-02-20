const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

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

async function fixADIBCards() {
  console.log('Fixing ADIB card bankIds...');
  
  const cardsSnap = await getDocs(collection(db, 'cards'));
  let count = 0;
  
  for (const cardDoc of cardsSnap.docs) {
    const data = cardDoc.data();
    if (data.bankId === 'adib') {
      await updateDoc(doc(db, 'cards', cardDoc.id), {
        bankId: 'bank_adib'
      });
      console.log('Fixed:', cardDoc.id);
      count++;
    }
  }
  
  console.log('Updated', count, 'cards');
  process.exit(0);
}

fixADIBCards().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
