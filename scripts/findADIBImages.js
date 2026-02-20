const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDocs, collection } = require('firebase/firestore');
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
const db = getFirestore(app);

// Real ADIB card image URLs (testing different patterns)
const ADIB_IMAGE_URLS = {
  // Share Cards
  'adib-share-infinite': [
    'https://www.adib.ae/en/-/media/images/adib/cards/credit-cards/share/adib-share-infinite-card.png',
    'https://cdn.adib.ae/cards/share-infinite.png',
    'https://www.adib.ae/cards/images/share-infinite.png'
  ],
  'adib-share-platinum': [
    'https://www.adib.ae/en/-/media/images/adib/cards/credit-cards/share/adib-share-platinum-card.png',
    'https://cdn.adib.ae/cards/share-platinum.png'
  ],
  'adib-share-classic': [
    'https://www.adib.ae/en/-/media/images/adib/cards/credit-cards/share/adib-share-classic-card.png',
    'https://cdn.adib.ae/cards/share-classic.png'
  ],
  
  // Cashback
  'adib-cashback-card': [
    'https://www.adib.ae/en/-/media/images/adib/cards/credit-cards/cashback/adib-cashback-card.png',
    'https://cdn.adib.ae/cards/cashback.png'
  ],
  
  // Booking.com
  'adib-booking-platinum': [
    'https://www.adib.ae/en/-/media/images/adib/cards/credit-cards/booking/adib-booking-platinum.png',
    'https://cdn.adib.ae/cards/booking.png'
  ],
  
  // Etihad
  'adib-etihad-infinite': [
    'https://www.adib.ae/en/-/media/images/adib/cards/credit-cards/etihad/adib-etihad-infinite.png',
    'https://cdn.adib.ae/cards/etihad-infinite.png'
  ],
  'adib-etihad-platinum': [
    'https://www.adib.ae/en/-/media/images/adib/cards/credit-cards/etihad/adib-etihad-platinum.png'
  ],
  
  // Skywards
  'adib-skywards-signature': [
    'https://www.adib.ae/en/-/media/images/adib/cards/credit-cards/skywards/adib-skywards-signature.png'
  ],
  'adib-skywards-platinum': [
    'https://www.adib.ae/en/-/media/images/adib/cards/credit-cards/skywards/adib-skywards-platinum.png'
  ],
  
  // Touchpoints
  'adib-touchpoints-platinum': [
    'https://www.adib.ae/en/-/media/images/adib/cards/credit-cards/touchpoints/adib-touchpoints.png'
  ]
};

function testImageUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function findWorkingImages() {
  console.log('\n🔍 Testing ADIB card image URLs...\n');
  
  const workingUrls = {};
  
  for (const [cardId, urls] of Object.entries(ADIB_IMAGE_URLS)) {
    console.log(`Testing ${cardId}...`);
    
    for (const url of urls) {
      const works = await testImageUrl(url);
      if (works) {
        console.log(`  ✅ Found: ${url}`);
        workingUrls[cardId] = url;
        break;
      } else {
        console.log(`  ❌ Failed: ${url}`);
      }
    }
    
    if (!workingUrls[cardId]) {
      console.log(`  ⚠️  No working URL found for ${cardId}`);
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`Found ${Object.keys(workingUrls).length} working URLs out of ${Object.keys(ADIB_IMAGE_URLS).length} cards\n`);
  
  if (Object.keys(workingUrls).length > 0) {
    console.log('💾 Updating database...\n');
    
    for (const [cardId, imageUrl] of Object.entries(workingUrls)) {
      const cardRef = doc(db, 'cards', cardId);
      await updateDoc(cardRef, { imageUrl });
      console.log(`  ✓ Updated ${cardId}`);
    }
  }
  
  console.log('\n✅ Done!');
  process.exit(0);
}

findWorkingImages().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
