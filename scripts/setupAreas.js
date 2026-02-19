const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const DUBAI_AREAS = [
  // Central Dubai
  { id: 'downtown', name: 'Downtown Dubai', city: 'Dubai', country: 'AE', lat: 25.1972, lng: 55.2744 },
  { id: 'business_bay', name: 'Business Bay', city: 'Dubai', country: 'AE', lat: 25.1897, lng: 55.2633 },
  { id: 'difc', name: 'DIFC', city: 'Dubai', country: 'AE', lat: 25.2127, lng: 55.2812 },
  { id: 'burj_khalifa', name: 'Burj Khalifa', city: 'Dubai', country: 'AE', lat: 25.1972, lng: 55.2744 },
  
  // Marina & Beach
  { id: 'dubai_marina', name: 'Dubai Marina', city: 'Dubai', country: 'AE', lat: 25.0805, lng: 55.1396 },
  { id: 'jbr', name: 'JBR', city: 'Dubai', country: 'AE', lat: 25.0781, lng: 55.1323 },
  { id: 'palm_jumeirah', name: 'Palm Jumeirah', city: 'Dubai', country: 'AE', lat: 25.1124, lng: 55.1390 },
  { id: 'jumeirah', name: 'Jumeirah', city: 'Dubai', country: 'AE', lat: 25.2294, lng: 55.2593 },
  
  // JLT & Clusters
  { id: 'jlt', name: 'Jumeirah Lakes Towers', city: 'Dubai', country: 'AE', lat: 25.0714, lng: 55.1440 },
  { id: 'dmcc', name: 'DMCC', city: 'Dubai', country: 'AE', lat: 25.0715, lng: 55.1441 },
  
  // Sports City & Communities
  { id: 'dubai_sports_city', name: 'Dubai Sports City', city: 'Dubai', country: 'AE', lat: 25.0420, lng: 55.2131 },
  { id: 'motor_city', name: 'Motor City', city: 'Dubai', country: 'AE', lat: 25.0451, lng: 55.2305 },
  { id: 'dubai_hills', name: 'Dubai Hills Estate', city: 'Dubai', country: 'AE', lat: 25.0945, lng: 55.2460 },
  { id: 'arabian_ranches', name: 'Arabian Ranches', city: 'Dubai', country: 'AE', lat: 25.0522, lng: 55.2631 },
  
  // Old Dubai
  { id: 'deira', name: 'Deira', city: 'Dubai', country: 'AE', lat: 25.2703, lng: 55.3255 },
  { id: 'bur_dubai', name: 'Bur Dubai', city: 'Dubai', country: 'AE', lat: 25.2631, lng: 55.2972 },
  { id: 'karama', name: 'Karama', city: 'Dubai', country: 'AE', lat: 25.2494, lng: 55.3045 },
  
  // Others
  { id: 'al_barsha', name: 'Al Barsha', city: 'Dubai', country: 'AE', lat: 25.1122, lng: 55.1976 },
  { id: 'silicon_oasis', name: 'Silicon Oasis', city: 'Dubai', country: 'AE', lat: 25.1197, lng: 55.3783 },
  { id: 'international_city', name: 'International City', city: 'Dubai', country: 'AE', lat: 25.1685, lng: 55.4131 },
];

async function setupAreas() {
  console.log('📍 Setting up Dubai areas...\n');

  for (const area of DUBAI_AREAS) {
    await db.collection('areas').doc(area.id).set({
      ...area,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ ${area.name}`);
  }

  console.log('\n🎉 Areas setup complete!\n');
  process.exit(0);
}

setupAreas().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
