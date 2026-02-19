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

// Simple SVG card templates as data URLs
const CARD_TEMPLATES = {
  'green-cashback': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyZWVuIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMjdBRTYwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMjI5OTU0Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9InVybCgjZ3JlZW4pIiByeD0iMjAiLz48cmVjdCB4PSIzMCIgeT0iMTAwIiB3aWR0aD0iNjAiIGhlaWdodD0iNDUiIGZpbGw9IiNGMUM0MEYiIHJ4PSI4Ii8+PC9zdmc+',
  
  'blue-platinum': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImJsdWUiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMyQzNFNTAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzNDQ5NUUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0idXJsKCNibHVlKSIgcng9IjIwIi8+PHJlY3QgeD0iMzAiIHk9IjEwMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQ1IiBmaWxsPSIjQzBDMEMwIiByeD0iOCIvPjwvc3ZnPg==',
  
  'dark-infinite': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImRhcmsiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxYTFhMmUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwZjM0NjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0idXJsKCNkYXJrKSIgcng9IjIwIi8+PHJlY3QgeD0iMzAiIHk9IjEwMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQ1IiBmaWxsPSIjRkZENzAwIiByeD0iOCIvPjwvc3ZnPg=='
};

const CARD_IMAGE_MAPPING = {
  'adib-cashback-card': 'green-cashback',
  'adib-share-platinum': 'blue-platinum',
  'adib-share-infinite': 'dark-infinite',
  'adib-booking-platinum': 'blue-platinum'
};

async function createCardPlaceholders() {
  console.log('\n🎨 Creating card placeholder images...\n');
  
  // Store templates in a collection
  for (const [templateId, dataUrl] of Object.entries(CARD_TEMPLATES)) {
    await setDoc(doc(db, 'cardTemplates', templateId), {
      dataUrl,
      createdAt: new Date()
    });
    console.log(`  ✓ Saved template: ${templateId}`);
  }
  
  console.log('\n📸 Assigning templates to cards...\n');
  
  // Update cards with template references
  for (const [cardId, templateId] of Object.entries(CARD_IMAGE_MAPPING)) {
    await setDoc(doc(db, 'cards', cardId), {
      imageTemplate: templateId,
      imageUrl: CARD_TEMPLATES[templateId]
    }, { merge: true });
    console.log(`  ✓ Assigned ${templateId} to ${cardId}`);
  }
  
  console.log('\n✅ Done!');
  process.exit(0);
}

createCardPlaceholders().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
