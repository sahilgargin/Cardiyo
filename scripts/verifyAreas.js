const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs } = require('firebase/firestore');

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

async function verifyAreas() {
  console.log('\n🔍 Verifying areas in database...\n');
  
  // Check one specific area
  const downtownDoc = await getDoc(doc(db, 'areas', 'downtown-dubai'));
  
  if (downtownDoc.exists()) {
    console.log('✅ Downtown Dubai exists:');
    console.log(JSON.stringify(downtownDoc.data(), null, 2));
  } else {
    console.log('❌ Downtown Dubai not found');
  }
  
  console.log('\n📊 Checking all areas...\n');
  
  // Get all areas
  const areasSnapshot = await getDocs(collection(db, 'areas'));
  console.log(`Total areas: ${areasSnapshot.size}`);
  
  if (areasSnapshot.size > 0) {
    console.log('\nFirst 3 areas:');
    areasSnapshot.docs.slice(0, 3).forEach(doc => {
      console.log(`\n${doc.id}:`, JSON.stringify(doc.data(), null, 2));
    });
  }
  
  process.exit(0);
}

verifyAreas().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
