const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function setupProfessionalBranding() {
  console.log('🎨 Setting up professional branding...\n');

  // Professional color palette - 60-30-10 rule
  const brandingData = {
    // Primary colors
    primaryColor: '#9BFF32',        // Accent - energetic green (10% usage)
    secondaryColor: '#3DEEFF',      // Secondary accent - electric blue (10% usage)
    backgroundColor: '#060612',     // Primary - deep space (60% usage)
    surfaceColor: '#1a1a2e',        // Secondary - elevated surfaces (30% usage)
    
    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    
    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Gradients
    primaryGradient: {
      colors: ['#9BFF32', '#3DEEFF'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 }
    },
    darkGradient: {
      colors: ['#060612', '#1a1a2e', '#060612'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 }
    },
    
    // Brand identity
    brandName: 'Cardiyo',
    tagline: 'Smart credit card management',
    logoUrl: '/assets/logo.svg',
    
    // Typography
    fontFamily: {
      primary: 'SF Pro Display',
      secondary: 'Inter',
      mono: 'SF Mono'
    },
    
    // Spacing scale (8pt grid)
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48
    },
    
    // Border radius
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      full: 9999
    },
    
    // Shadows
    shadows: {
      sm: '0 2px 8px rgba(0,0,0,0.1)',
      md: '0 4px 16px rgba(0,0,0,0.15)',
      lg: '0 8px 32px rgba(0,0,0,0.2)',
      glow: '0 0 20px rgba(155, 255, 50, 0.3)'
    },
    
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('config').doc('branding').set(brandingData);
  console.log('✅ Professional app branding created\n');

  // Update bank branding with professional colors
  const banks = [
    {
      id: 'bank_adib',
      name: 'Abu Dhabi Islamic Bank',
      shortName: 'ADIB',
      primaryColor: '#00A651',
      secondaryColor: '#008C44',
      gradient: ['#00A651', '#006B33'],
      country: 'AE',
      logo: 'https://www.adib.ae/images/logo.svg'
    },
    {
      id: 'bank_emiratesnbd',
      name: 'Emirates NBD',
      shortName: 'Emirates NBD',
      primaryColor: '#C8102E',
      secondaryColor: '#A00D26',
      gradient: ['#C8102E', '#8B0A1D'],
      country: 'AE',
      logo: 'https://www.emiratesnbd.com/images/logo.svg'
    },
    {
      id: 'bank_fab',
      name: 'First Abu Dhabi Bank',
      shortName: 'FAB',
      primaryColor: '#7B1FA2',
      secondaryColor: '#6A1B9A',
      gradient: ['#7B1FA2', '#5E1780'],
      country: 'AE',
      logo: 'https://www.bankfab.com/images/logo.svg'
    },
    {
      id: 'bank_mashreq',
      name: 'Mashreq Bank',
      shortName: 'Mashreq',
      primaryColor: '#E31837',
      secondaryColor: '#C0102D',
      gradient: ['#E31837', '#A00D24'],
      country: 'AE',
      logo: 'https://www.mashreq.com/images/logo.svg'
    }
  ];

  for (const bank of banks) {
    await db.collection('config').doc('banks').collection('items').doc(bank.id).set({
      ...bank,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ ${bank.name} branding updated`);
  }

  console.log('\n🎉 Professional branding setup complete!\n');
  process.exit(0);
}

setupProfessionalBranding().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
