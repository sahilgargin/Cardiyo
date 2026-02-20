const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadString, getDownloadURL } = require('firebase/storage');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');
const https = require('https');

const firebaseConfig = {
  apiKey: "AIzaSyCChFeHHxvFmijMsVEsG0xUPoSn_bZwIJ4",
  authDomain: "my-vibe-app-af0db.firebaseapp.com",
  projectId: "my-vibe-app-af0db",
  storageBucket: "my-vibe-app-af0db.firebasestorage.app",
  messagingSenderId: "260028785813",
  appId: "1:260028785813:web:1eec8dadb13137fe3b279c"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Card images as base64 or URLs to download
const CARD_IMAGES = {
  'adib-cashback-card': 'https://www.adib.ae/-/media/project/adib/adibsite/cards/cashback-card/cashback-card-listing.png',
  'adib-share-infinite': 'https://www.adib.ae/-/media/project/adib/adibsite/cards/share-card/share-visa-infinite-card/infinite-card-listing.png',
  'adib-share-platinum': 'https://www.adib.ae/-/media/project/adib/adibsite/cards/share-card/share-visa-platinum-card/platinum-card-listing.png',
  'adib-booking-platinum': 'https://www.adib.ae/-/media/project/adib/adibsite/cards/bookingcom-card/booking-platinum-listing.png'
};

async function uploadCardImages() {
  console.log('\n📸 Uploading card images to Firebase Storage...\n');
  
  for (const [cardId, imageUrl] of Object.entries(CARD_IMAGES)) {
    try {
      console.log(`Processing ${cardId}...`);
      
      // For now, just update the database with the image URL
      // In production, you'd download and re-upload to your storage
      const cardRef = doc(db, 'cards', cardId);
      const cardDoc = await getDoc(cardRef);
      
      if (cardDoc.exists()) {
        await updateDoc(cardRef, {
          imageUrl: imageUrl
        });
        console.log(`  ✓ Updated ${cardId} with image URL`);
      } else {
        console.log(`  ⚠️  Card ${cardId} not found in database`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error processing ${cardId}:`, error.message);
    }
  }
  
  console.log('\n✅ Done!');
  process.exit(0);
}

uploadCardImages().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
