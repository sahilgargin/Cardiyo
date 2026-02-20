const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setupBranding() {
  console.log('🎨 Setting up branding in Firestore...\n');

  // App-wide branding
  const appBranding = {
    primaryColor: '#9BFF32',
    secondaryColor: '#3DEEFF',
    backgroundColor: '#060612',
    surfaceColor: '#1a1a1a',
    textPrimary: '#FFFFFF',
    textSecondary: '#999999',
    success: '#9BFF32',
    warning: '#FFD93D',
    error: '#FF6B6B',
    primaryGradient: {
      colors: ['#9BFF32', '#3DEEFF'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 }
    },
    logo: '💳',
    appName: 'Cardiyo',
    tagline: 'Smart credit card tracking for UAE',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('config').doc('branding').set(appBranding);
  console.log('✅ App branding created');

  // Bank branding
  const banks = [
    {
      id: 'bank_adib',
      name: 'Abu Dhabi Islamic Bank',
      shortName: 'ADIB',
      logo: '🏦',
      primaryColor: '#00A651',
      gradient: ['#00A651', '#008C44'],
      country: 'AE'
    },
    {
      id: 'bank_emiratesnbd',
      name: 'Emirates NBD',
      shortName: 'Emirates NBD',
      logo: '🏦',
      primaryColor: '#C8102E',
      gradient: ['#C8102E', '#A00D26'],
      country: 'AE'
    },
    {
      id: 'bank_fab',
      name: 'First Abu Dhabi Bank',
      shortName: 'FAB',
      logo: '🏦',
      primaryColor: '#7B1FA2',
      gradient: ['#7B1FA2', '#6A1B9A'],
      country: 'AE'
    },
    {
      id: 'bank_mashreq',
      name: 'Mashreq Bank',
      shortName: 'Mashreq',
      logo: '🏦',
      primaryColor: '#E31837',
      gradient: ['#E31837', '#C0102D'],
      country: 'AE'
    }
  ];

  for (const bank of banks) {
    await db.collection('config').doc('banks').collection('items').doc(bank.id).set({
      ...bank,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ ${bank.name} branding created`);
  }

  console.log('\n🎉 Branding setup complete!\n');
  process.exit(0);
}

setupBranding().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
