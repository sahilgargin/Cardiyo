const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, writeBatch } = require('firebase/firestore');

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

const ADIB_CARDS = [
  // ==================== SHARE VISA CARDS ====================
  {
    id: 'adib-share-infinite',
    bankId: 'adib',
    name: 'ADIB Share Visa Infinite',
    nameAr: 'بطاقة أديب شير فيزا إنفينت',
    type: 'Infinite',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/share-card/share-visa-infinite-card/infinite-card-listing.png',
    annualFee: 495,
    joinFeeWaiver: 'First year free',
    rewardRate: 3.0,
    rewardType: 'cashback',
    benefits: [
      '3% unlimited cashback on all spending',
      'Complimentary airport lounge access worldwide',
      'Visa Infinite concierge service',
      'Travel insurance up to AED 2 million',
      'Purchase protection up to AED 5,000',
      'Priority Pass membership',
      'Concierge service 24/7',
      'Free supplementary cards',
      'Emergency card replacement worldwide'
    ],
    eligibility: { minSalary: 25000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true },
    category: 'share'
  },
  {
    id: 'adib-share-platinum',
    bankId: 'adib',
    name: 'ADIB Share Visa Platinum',
    nameAr: 'بطاقة أديب شير فيزا بلاتينيوم',
    type: 'Platinum',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/share-card/share-visa-platinum-card/platinum-card-listing.png',
    annualFee: 195,
    joinFeeWaiver: 'First year free',
    rewardRate: 2.0,
    rewardType: 'cashback',
    benefits: [
      '2% unlimited cashback on all spending',
      '4 complimentary airport lounge visits per year',
      'Travel insurance up to AED 1 million',
      'Purchase protection up to AED 2,500',
      'Emergency card replacement worldwide',
      'Free supplementary cards',
      'SMS transaction alerts'
    ],
    eligibility: { minSalary: 10000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true },
    category: 'share'
  },
  {
    id: 'adib-share-classic',
    bankId: 'adib',
    name: 'ADIB Share Visa Classic',
    nameAr: 'بطاقة أديب شير فيزا كلاسيك',
    type: 'Classic',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/share-card/share-visa-classic-card/classic-card-listing.png',
    annualFee: 99,
    joinFeeWaiver: 'First year free',
    rewardRate: 1.0,
    rewardType: 'cashback',
    benefits: [
      '1% unlimited cashback on all spending',
      'Global acceptance at millions of locations',
      'Contactless payments',
      'Free supplementary cards',
      'SMS alerts',
      'Online banking access'
    ],
    eligibility: { minSalary: 5000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true },
    category: 'share'
  },

  // ==================== CASHBACK VISA CARD ====================
  {
    id: 'adib-cashback-card',
    bankId: 'adib',
    name: 'ADIB Cashback Visa Card',
    nameAr: 'بطاقة أديب كاش باك فيزا',
    type: 'Cashback',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/cashback-card/cashback-card-listing.png',
    annualFee: 0,
    joinFeeWaiver: 'Lifetime free',
    rewardRate: 1.5,
    rewardType: 'cashback',
    benefits: [
      '1.5% cashback on groceries and fuel',
      '0.75% cashback on all other purchases',
      'No annual fee - lifetime free',
      'Instant cashback credit',
      'No minimum spend required',
      'Contactless payments',
      'Mobile wallet compatible'
    ],
    eligibility: { minSalary: 5000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true },
    category: 'cashback'
  },

  // ==================== BOOKING.COM CARD ====================
  {
    id: 'adib-booking-platinum',
    bankId: 'adib',
    name: 'ADIB Booking.com Platinum Card',
    nameAr: 'بطاقة أديب بوكينج دوت كوم بلاتينيوم',
    type: 'Platinum',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/bookingcom-card/booking-platinum-listing.png',
    annualFee: 250,
    joinFeeWaiver: 'First year free',
    rewardRate: 6.0,
    rewardType: 'bookingcom-credit',
    benefits: [
      '6% Booking.com credit on all card spend',
      'AED 150 Booking.com credit on first purchase',
      'Genius Level 2 status',
      '10% discount on select properties',
      'Free breakfast at select hotels',
      'Room upgrades when available',
      'Travel insurance',
      '2 complimentary lounge visits per year'
    ],
    eligibility: { minSalary: 10000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true },
    category: 'booking'
  },

  // ==================== SMILES COVERED CARDS ====================
  {
    id: 'adib-smiles-covered-signature',
    bankId: 'adib',
    name: 'ADIB Smiles Covered Signature',
    nameAr: 'بطاقة أديب سمايلز المغطاة سيجنتشر',
    type: 'Signature',
    network: 'Mastercard',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/smiles-covered-card/smiles-signature-listing.png',
    annualFee: 195,
    joinFeeWaiver: 'None',
    rewardRate: 4.0,
    rewardType: 'smiles',
    benefits: [
      '20,000 bonus Smiles on activation',
      '4 Smiles per AED 1 on Emirates flights',
      '2 Smiles per AED 1 on international spend',
      '1 Smile per AED 1 on local spend',
      'Covered card - requires security deposit',
      'Build credit history',
      'Airport lounge access (4 visits/year)'
    ],
    eligibility: { minSalary: 0, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, covered: true },
    category: 'smiles-covered'
  },
  {
    id: 'adib-smiles-covered-classic',
    bankId: 'adib',
    name: 'ADIB Smiles Covered Classic',
    nameAr: 'بطاقة أديب سمايلز المغطاة كلاسيك',
    type: 'Classic',
    network: 'Mastercard',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/smiles-covered-card/smiles-classic-listing.png',
    annualFee: 99,
    joinFeeWaiver: 'None',
    rewardRate: 2.0,
    rewardType: 'smiles',
    benefits: [
      '10,000 bonus Smiles on activation',
      '2 Smiles per AED 1 on Emirates flights',
      '1 Smile per AED 1 on all other spend',
      'Covered card - requires security deposit',
      'Build credit history',
      'Global acceptance'
    ],
    eligibility: { minSalary: 0, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, covered: true },
    category: 'smiles-covered'
  },

  // ==================== ISLAMIC COVERED CARD ====================
  {
    id: 'adib-islamic-covered',
    bankId: 'adib',
    name: 'ADIB Islamic Covered Card',
    nameAr: 'بطاقة أديب الإسلامية المغطاة',
    type: 'Covered',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/islamic-covered-card/covered-card-listing.png',
    annualFee: 0,
    joinFeeWaiver: 'Lifetime free',
    rewardRate: 0,
    rewardType: 'none',
    benefits: [
      'No annual fees',
      'Sharia-compliant covered card',
      'Requires security deposit',
      'Build credit history',
      'Global acceptance',
      'Contactless payments',
      'Online shopping enabled',
      'Mobile wallet compatible'
    ],
    eligibility: { minSalary: 0, minAge: 18 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, covered: true, islamic: true },
    category: 'covered'
  },

  // ==================== ETIHAD GUEST CARDS ====================
  {
    id: 'adib-etihad-infinite',
    bankId: 'adib',
    name: 'ADIB Etihad Guest Infinite',
    nameAr: 'بطاقة أديب ضيف الاتحاد إنفينت',
    type: 'Infinite',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/etihad-guest-card/etihad-infinite-card-listing.png',
    annualFee: 750,
    joinFeeWaiver: 'None',
    rewardRate: 4.0,
    rewardType: 'etihad-miles',
    benefits: [
      '50,000 bonus Etihad Guest Miles on first purchase',
      '4 Etihad Guest Miles per AED on Etihad flights',
      '2 Etihad Guest Miles per AED on all other spend',
      'Complimentary airport lounge access worldwide',
      'Travel insurance up to AED 2 million',
      'Visa Infinite concierge service',
      'Priority Pass membership',
      'Free supplementary cards',
      'No foreign exchange markup on Etihad bookings'
    ],
    eligibility: { minSalary: 25000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, milesProgram: 'Etihad Guest' },
    category: 'etihad'
  },
  {
    id: 'adib-etihad-platinum',
    bankId: 'adib',
    name: 'ADIB Etihad Guest Platinum',
    nameAr: 'بطاقة أديب ضيف الاتحاد بلاتينيوم',
    type: 'Platinum',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/etihad-guest-card/etihad-platinum-card-listing.png',
    annualFee: 350,
    joinFeeWaiver: 'None',
    rewardRate: 3.0,
    rewardType: 'etihad-miles',
    benefits: [
      '25,000 bonus Etihad Guest Miles on first purchase',
      '3 Etihad Guest Miles per AED on Etihad flights',
      '1.5 Etihad Guest Miles per AED on all other spend',
      '4 complimentary lounge visits per year',
      'Travel insurance up to AED 1 million',
      'Free supplementary cards',
      'Priority check-in at Etihad counters'
    ],
    eligibility: { minSalary: 12000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, milesProgram: 'Etihad Guest' },
    category: 'etihad'
  },
  {
    id: 'adib-etihad-classic',
    bankId: 'adib',
    name: 'ADIB Etihad Guest Classic',
    nameAr: 'بطاقة أديب ضيف الاتحاد كلاسيك',
    type: 'Classic',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/etihad-guest-card/etihad-classic-card-listing.png',
    annualFee: 150,
    joinFeeWaiver: 'First year free',
    rewardRate: 1.5,
    rewardType: 'etihad-miles',
    benefits: [
      '10,000 bonus Etihad Guest Miles on first purchase',
      '2 Etihad Guest Miles per AED on Etihad flights',
      '1 Etihad Guest Mile per AED on all other spend',
      'Free supplementary cards',
      'Online account management'
    ],
    eligibility: { minSalary: 5000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, milesProgram: 'Etihad Guest' },
    category: 'etihad'
  },

  // ==================== EMIRATES SKYWARDS CARDS ====================
  {
    id: 'adib-skywards-signature',
    bankId: 'adib',
    name: 'ADIB Emirates Skywards Signature',
    nameAr: 'بطاقة أديب طيران الإمارات سكاي واردز سيجنتشر',
    type: 'Signature',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/skywards-card/skywards-signature-listing.png',
    annualFee: 495,
    joinFeeWaiver: 'None',
    rewardRate: 3.0,
    rewardType: 'skywards-miles',
    benefits: [
      '40,000 bonus Skywards Miles on first purchase',
      '3 Skywards Miles per AED on Emirates & flydubai',
      '1.5 Skywards Miles per AED on all other spend',
      'Complimentary Emirates Skywards Silver tier',
      'Travel insurance up to AED 2 million',
      'Airport lounge access',
      'Golf privileges worldwide',
      'Free supplementary cards'
    ],
    eligibility: { minSalary: 25000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, milesProgram: 'Emirates Skywards' },
    category: 'skywards'
  },
  {
    id: 'adib-skywards-platinum',
    bankId: 'adib',
    name: 'ADIB Emirates Skywards Platinum',
    nameAr: 'بطاقة أديب طيران الإمارات سكاي واردز بلاتينيوم',
    type: 'Platinum',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/skywards-card/skywards-platinum-listing.png',
    annualFee: 295,
    joinFeeWaiver: 'First year free',
    rewardRate: 2.0,
    rewardType: 'skywards-miles',
    benefits: [
      '25,000 bonus Skywards Miles on first purchase',
      '2 Skywards Miles per AED on Emirates & flydubai',
      '1 Skywards Mile per AED on all other spend',
      '4 complimentary lounge visits per year',
      'Travel insurance up to AED 1 million',
      'Free supplementary cards'
    ],
    eligibility: { minSalary: 12000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, milesProgram: 'Emirates Skywards' },
    category: 'skywards'
  },
  {
    id: 'adib-skywards-classic',
    bankId: 'adib',
    name: 'ADIB Emirates Skywards Classic',
    nameAr: 'بطاقة أديب طيران الإمارات سكاي واردز كلاسيك',
    type: 'Classic',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/skywards-card/skywards-classic-listing.png',
    annualFee: 150,
    joinFeeWaiver: 'First year free',
    rewardRate: 1.0,
    rewardType: 'skywards-miles',
    benefits: [
      '10,000 bonus Skywards Miles on first purchase',
      '1.5 Skywards Miles per AED on Emirates & flydubai',
      '0.75 Skywards Miles per AED on all other spend',
      'Free supplementary cards',
      'Online account management'
    ],
    eligibility: { minSalary: 5000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, milesProgram: 'Emirates Skywards' },
    category: 'skywards'
  },

  // ==================== TOUCHPOINTS CARDS ====================
  {
    id: 'adib-touchpoints-platinum',
    bankId: 'adib',
    name: 'ADIB Touchpoints Platinum',
    nameAr: 'بطاقة أديب تاتش بوينتس بلاتينيوم',
    type: 'Platinum',
    network: 'Mastercard',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/touchpoints-card/touchpoints-platinum-listing.png',
    annualFee: 195,
    joinFeeWaiver: 'First year free',
    rewardRate: 2.5,
    rewardType: 'touchpoints',
    benefits: [
      '15,000 bonus Touchpoints on first purchase',
      '2.5 Touchpoints per AED spent',
      'Redeem for flights, hotels, and merchandise',
      'No blackout dates on redemptions',
      'Travel insurance',
      '2 complimentary lounge visits per year',
      'Contactless payments'
    ],
    eligibility: { minSalary: 10000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, rewardsProgram: 'Touchpoints' },
    category: 'touchpoints'
  },
  {
    id: 'adib-touchpoints-classic',
    bankId: 'adib',
    name: 'ADIB Touchpoints Classic',
    nameAr: 'بطاقة أديب تاتش بوينتس كلاسيك',
    type: 'Classic',
    network: 'Mastercard',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/touchpoints-card/touchpoints-classic-listing.png',
    annualFee: 99,
    joinFeeWaiver: 'First year free',
    rewardRate: 1.5,
    rewardType: 'touchpoints',
    benefits: [
      '5,000 bonus Touchpoints on first purchase',
      '1.5 Touchpoints per AED spent',
      'Redeem for flights, hotels, and merchandise',
      'No blackout dates on redemptions',
      'Contactless payments',
      'Mobile wallet compatible'
    ],
    eligibility: { minSalary: 5000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, rewardsProgram: 'Touchpoints' },
    category: 'touchpoints'
  },

  // ==================== EXCEED CARDS ====================
  {
    id: 'adib-exceed-card',
    bankId: 'adib',
    name: 'ADIB Exceed Card',
    nameAr: 'بطاقة أديب إكسيد',
    type: 'Exceed',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/exceed-card/exceed-card-listing.png',
    annualFee: 0,
    joinFeeWaiver: 'Lifetime free',
    rewardRate: 1.0,
    rewardType: 'cashback',
    benefits: [
      'No annual fees - lifetime free',
      '1% cashback on all purchases',
      'Designed for young professionals',
      'Easy online application',
      'Instant card issuance',
      'Contactless payments',
      'Mobile wallet compatible'
    ],
    eligibility: { minSalary: 5000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true },
    category: 'exceed'
  },

  // ==================== BUSINESS CARDS ====================
  {
    id: 'adib-business-platinum',
    bankId: 'adib',
    name: 'ADIB Business Platinum Card',
    nameAr: 'بطاقة أديب الأعمال بلاتينيوم',
    type: 'Business Platinum',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/business-card/business-platinum-listing.png',
    annualFee: 350,
    joinFeeWaiver: 'First year free',
    rewardRate: 1.5,
    rewardType: 'cashback',
    benefits: [
      '1.5% cashback on all business expenses',
      'Extended credit period of up to 55 days',
      'Detailed expense reports',
      'Multiple employee cards',
      'Travel insurance for business trips',
      'Purchase protection',
      'Airport lounge access',
      'Expense management tools'
    ],
    eligibility: { minSalary: 15000, minAge: 21, businessOwner: true },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, business: true },
    category: 'business'
  },
  {
    id: 'adib-business-classic',
    bankId: 'adib',
    name: 'ADIB Business Classic Card',
    nameAr: 'بطاقة أديب الأعمال كلاسيك',
    type: 'Business Classic',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/business-card/business-classic-listing.png',
    annualFee: 150,
    joinFeeWaiver: 'First year free',
    rewardRate: 0.75,
    rewardType: 'cashback',
    benefits: [
      '0.75% cashback on all business expenses',
      'Extended credit period',
      'Multiple employee cards',
      'Expense management tools',
      'Online account management',
      'SMS alerts'
    ],
    eligibility: { minSalary: 8000, minAge: 21, businessOwner: true },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, business: true },
    category: 'business'
  },

  // ==================== CORPORATE CARDS ====================
  {
    id: 'adib-corporate-card',
    bankId: 'adib',
    name: 'ADIB Corporate Card',
    nameAr: 'بطاقة أديب للشركات',
    type: 'Corporate',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/corporate-card/corporate-card-listing.png',
    annualFee: 0,
    joinFeeWaiver: 'Corporate pricing',
    rewardRate: 0,
    rewardType: 'none',
    benefits: [
      'Centralized billing',
      'Corporate expense management',
      'Detailed MIS reports',
      'Customizable spending limits',
      'Travel insurance',
      'Purchase protection',
      'Dedicated corporate relationship manager',
      'Online portal for administrators'
    ],
    eligibility: { minSalary: 0, minAge: 21, corporate: true },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, corporate: true },
    category: 'corporate'
  },

  // ==================== PREPAID CARD ====================
  {
    id: 'adib-prepaid-card',
    bankId: 'adib',
    name: 'ADIB Prepaid Card',
    nameAr: 'بطاقة أديب المدفوعة مسبقاً',
    type: 'Prepaid',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/prepaid-card/prepaid-card-listing.png',
    annualFee: 0,
    joinFeeWaiver: 'Lifetime free',
    rewardRate: 0,
    rewardType: 'none',
    benefits: [
      'No annual fees',
      'No credit check required',
      'Load and reload as needed',
      'Budget control',
      'Perfect for students and expats',
      'Global acceptance',
      'Online shopping enabled',
      'Contactless payments'
    ],
    eligibility: { minSalary: 0, minAge: 18 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true, prepaid: true },
    category: 'prepaid'
  },

  // ==================== EMPLOYEE PLUS ====================
  {
    id: 'adib-employee-plus',
    bankId: 'adib',
    name: 'ADIB Employee Plus Card',
    nameAr: 'بطاقة أديب للموظفين بلس',
    type: 'Employee',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.adib.ae/-/media/project/adib/adibsite/cards/employee-plus-card/employee-card-listing.png',
    annualFee: 99,
    joinFeeWaiver: 'First year free',
    rewardRate: 1.0,
    rewardType: 'cashback',
    benefits: [
      '1% cashback on all purchases',
      'Special discounts at partner merchants',
      'Free card delivery',
      'SMS alerts',
      'Online account management',
      'Emergency cash disbursement',
      'Lost card protection'
    ],
    eligibility: { minSalary: 5000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, samsungPay: true },
    category: 'employee'
  }
];

async function seedADIBComplete() {
  console.log('\n💳 Seeding complete ADIB card portfolio...');
  console.log(`📊 Total cards: ${ADIB_CARDS.length}`);
  
  let batch = writeBatch(db);
  let count = 0;
  
  for (const card of ADIB_CARDS) {
    const cardRef = doc(db, 'cards', card.id);
    batch.set(cardRef, card);
    count++;
    
    if (count % 10 === 0) {
      console.log(`  ✓ Processed ${count}/${ADIB_CARDS.length} cards...`);
    }
    
    // Commit batch every 500 items (Firestore limit)
    if (count % 500 === 0) {
      await batch.commit();
      batch = writeBatch(db);
    }
  }
  
  // Commit remaining
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log('\n📋 Summary by category:');
  const categories = {};
  ADIB_CARDS.forEach(card => {
    categories[card.category] = (categories[card.category] || 0) + 1;
  });
  
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} cards`);
  });
  
  console.log(`\n✅ ${ADIB_CARDS.length} ADIB cards seeded successfully!`);
}

module.exports = { seedADIBComplete, ADIB_CARDS };

if (require.main === module) {
  seedADIBComplete()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}
