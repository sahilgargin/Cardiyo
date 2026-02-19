const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, writeBatch, collection, getDocs, deleteDoc } = require('firebase/firestore');

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

// ==================== EMIRATES NBD CARDS ====================
const EMIRATES_NBD_CARDS = [
  {
    id: 'enbd-skywards-infinite',
    bankId: 'bank_emiratesnbd',
    name: 'Emirates NBD Skywards Infinite',
    nameAr: 'بطاقة بنك الإمارات دبي الوطني سكاي واردز إنفينت',
    type: 'Infinite',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.emiratesnbd.com/assets/images/cards/skywards-infinite.png',
    annualFee: 2000,
    rewardRate: 5.0,
    rewardType: 'skywards-miles',
    benefits: [
      '125,000 bonus Skywards Miles',
      '5 Skywards Miles per AED on Emirates',
      '2 Skywards Miles per AED elsewhere',
      'Unlimited airport lounge access',
      'Golf privileges worldwide',
      'Complimentary travel insurance'
    ],
    eligibility: { minSalary: 50000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'enbd-skywards-signature',
    bankId: 'bank_emiratesnbd',
    name: 'Emirates NBD Skywards Signature',
    nameAr: 'بطاقة بنك الإمارات دبي الوطني سكاي واردز سيجنتشر',
    type: 'Signature',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.emiratesnbd.com/assets/images/cards/skywards-signature.png',
    annualFee: 700,
    rewardRate: 3.0,
    rewardType: 'skywards-miles',
    benefits: [
      '50,000 bonus Skywards Miles',
      '3 Skywards Miles per AED on Emirates',
      '1.5 Skywards Miles per AED elsewhere',
      'Airport lounge access',
      'Travel insurance'
    ],
    eligibility: { minSalary: 25000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'enbd-skywards-platinum',
    bankId: 'bank_emiratesnbd',
    name: 'Emirates NBD Skywards Platinum',
    nameAr: 'بطاقة بنك الإمارات دبي الوطني سكاي واردز بلاتينيوم',
    type: 'Platinum',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.emiratesnbd.com/assets/images/cards/skywards-platinum.png',
    annualFee: 500,
    rewardRate: 2.0,
    rewardType: 'skywards-miles',
    benefits: [
      '25,000 bonus Skywards Miles',
      '2 Skywards Miles per AED on Emirates',
      '1 Skywards Mile per AED elsewhere',
      'Travel insurance'
    ],
    eligibility: { minSalary: 15000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'enbd-u-by-emaar',
    bankId: 'bank_emiratesnbd',
    name: 'Emirates NBD U By Emaar Card',
    nameAr: 'بطاقة بنك الإمارات دبي الوطني يو باي إعمار',
    type: 'Rewards',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.emiratesnbd.com/assets/images/cards/u-by-emaar.png',
    annualFee: 300,
    rewardRate: 4.0,
    rewardType: 'u-points',
    benefits: [
      '4 U Points per AED at Emaar outlets',
      '2 U Points per AED elsewhere',
      'Exclusive Emaar discounts',
      'Priority access to sales'
    ],
    eligibility: { minSalary: 10000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'enbd-titanium',
    bankId: 'bank_emiratesnbd',
    name: 'Emirates NBD Titanium Card',
    nameAr: 'بطاقة بنك الإمارات دبي الوطني تيتانيوم',
    type: 'Titanium',
    network: 'Mastercard',
    currency: 'AED',
    imageUrl: 'https://www.emiratesnbd.com/assets/images/cards/titanium.png',
    annualFee: 600,
    rewardRate: 0,
    rewardType: 'none',
    benefits: [
      'Metal card',
      'Airport lounge access',
      'Concierge service',
      'Travel insurance',
      'Purchase protection'
    ],
    eligibility: { minSalary: 25000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true, metal: true }
  },
  {
    id: 'enbd-lulu',
    bankId: 'bank_emiratesnbd',
    name: 'Emirates NBD Lulu Mastercard',
    nameAr: 'بطاقة بنك الإمارات دبي الوطني لولو',
    type: 'Cashback',
    network: 'Mastercard',
    currency: 'AED',
    imageUrl: 'https://www.emiratesnbd.com/assets/images/cards/lulu.png',
    annualFee: 100,
    rewardRate: 5.0,
    rewardType: 'cashback',
    benefits: [
      '5% cashback at Lulu',
      '1% cashback elsewhere',
      'Exclusive Lulu discounts'
    ],
    eligibility: { minSalary: 5000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'enbd-business-platinum',
    bankId: 'bank_emiratesnbd',
    name: 'Emirates NBD Business Platinum',
    nameAr: 'بطاقة بنك الإمارات دبي الوطني للأعمال بلاتينيوم',
    type: 'Business Platinum',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.emiratesnbd.com/assets/images/cards/business-platinum.png',
    annualFee: 400,
    rewardRate: 1.5,
    rewardType: 'cashback',
    benefits: [
      '1.5% cashback on business expenses',
      'Extended credit period',
      'Expense management tools',
      'Travel insurance'
    ],
    eligibility: { minSalary: 15000, minAge: 21, businessOwner: true },
    features: { contactless: true, applePay: true, googlePay: true, business: true }
  }
];

// ==================== FAB CARDS ====================
const FAB_CARDS = [
  {
    id: 'fab-infinite',
    bankId: 'bank_fab',
    name: 'FAB Infinite Credit Card',
    nameAr: 'بطاقة بنك أبوظبي الأول إنفينت',
    type: 'Infinite',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.bankfab.com/assets/images/cards/infinite.png',
    annualFee: 1500,
    rewardRate: 3.0,
    rewardType: 'fab-rewards',
    benefits: [
      '100,000 bonus FAB Rewards points',
      '3 points per AED spent',
      'Unlimited lounge access',
      'Concierge service',
      'Travel insurance up to AED 5 million'
    ],
    eligibility: { minSalary: 50000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'fab-etihad-signature',
    bankId: 'bank_fab',
    name: 'FAB Etihad Guest Signature',
    nameAr: 'بطاقة بنك أبوظبي الأول ضيف الاتحاد سيجنتشر',
    type: 'Signature',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.bankfab.com/assets/images/cards/etihad-signature.png',
    annualFee: 800,
    rewardRate: 4.0,
    rewardType: 'etihad-miles',
    benefits: [
      '40,000 bonus Etihad Miles',
      '4 Etihad Miles per AED on Etihad',
      '2 Etihad Miles per AED elsewhere',
      'Lounge access',
      'Travel insurance'
    ],
    eligibility: { minSalary: 25000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'fab-cashback',
    bankId: 'bank_fab',
    name: 'FAB Cashback Credit Card',
    nameAr: 'بطاقة بنك أبوظبي الأول كاش باك',
    type: 'Cashback',
    network: 'Mastercard',
    currency: 'AED',
    imageUrl: 'https://www.bankfab.com/assets/images/cards/cashback.png',
    annualFee: 0,
    rewardRate: 2.0,
    rewardType: 'cashback',
    benefits: [
      '2% cashback on all spends',
      'No annual fee',
      'Instant cashback credit'
    ],
    eligibility: { minSalary: 8000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'fab-platinum',
    bankId: 'bank_fab',
    name: 'FAB Platinum Credit Card',
    nameAr: 'بطاقة بنك أبوظبي الأول بلاتينيوم',
    type: 'Platinum',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.bankfab.com/assets/images/cards/platinum.png',
    annualFee: 350,
    rewardRate: 1.5,
    rewardType: 'fab-rewards',
    benefits: [
      '1.5 FAB Rewards points per AED',
      'Airport lounge access',
      'Travel insurance',
      'Purchase protection'
    ],
    eligibility: { minSalary: 12000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'fab-carrefour',
    bankId: 'bank_fab',
    name: 'FAB Carrefour Credit Card',
    nameAr: 'بطاقة بنك أبوظبي الأول كارفور',
    type: 'Cashback',
    network: 'Mastercard',
    currency: 'AED',
    imageUrl: 'https://www.bankfab.com/assets/images/cards/carrefour.png',
    annualFee: 150,
    rewardRate: 4.0,
    rewardType: 'cashback',
    benefits: [
      '4% cashback at Carrefour',
      '1% cashback elsewhere',
      'Exclusive Carrefour offers'
    ],
    eligibility: { minSalary: 5000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  }
];

// ==================== MASHREQ CARDS ====================
const MASHREQ_CARDS = [
  {
    id: 'mashreq-world',
    bankId: 'bank_mashreq',
    name: 'Mashreq World Credit Card',
    nameAr: 'بطاقة مصرف المشرق وورلد',
    type: 'World',
    network: 'Mastercard',
    currency: 'AED',
    imageUrl: 'https://www.mashreq.com/assets/images/cards/world.png',
    annualFee: 1200,
    rewardRate: 0,
    rewardType: 'none',
    benefits: [
      'Unlimited airport lounge access',
      'Mastercard World privileges',
      'Concierge service',
      'Travel insurance',
      'Golf privileges'
    ],
    eligibility: { minSalary: 40000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'mashreq-skywards-platinum',
    bankId: 'bank_mashreq',
    name: 'Mashreq Skywards Platinum',
    nameAr: 'بطاقة مصرف المشرق سكاي واردز بلاتينيوم',
    type: 'Platinum',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.mashreq.com/assets/images/cards/skywards-platinum.png',
    annualFee: 600,
    rewardRate: 3.0,
    rewardType: 'skywards-miles',
    benefits: [
      '30,000 bonus Skywards Miles',
      '3 Skywards Miles per AED on Emirates',
      '1.5 Skywards Miles per AED elsewhere',
      'Travel insurance'
    ],
    eligibility: { minSalary: 15000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'mashreq-smiles',
    bankId: 'bank_mashreq',
    name: 'Mashreq Smiles Credit Card',
    nameAr: 'بطاقة مصرف المشرق سمايلز',
    type: 'Rewards',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.mashreq.com/assets/images/cards/smiles.png',
    annualFee: 300,
    rewardRate: 5.0,
    rewardType: 'smiles',
    benefits: [
      '20,000 bonus Smiles',
      '5 Smiles per AED at Emirates & flydubai',
      '2 Smiles per AED elsewhere',
      'Exclusive Smiles offers'
    ],
    eligibility: { minSalary: 10000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'mashreq-cashback',
    bankId: 'bank_mashreq',
    name: 'Mashreq Cashback Credit Card',
    nameAr: 'بطاقة مصرف المشرق كاش باك',
    type: 'Cashback',
    network: 'Mastercard',
    currency: 'AED',
    imageUrl: 'https://www.mashreq.com/assets/images/cards/cashback.png',
    annualFee: 0,
    rewardRate: 1.0,
    rewardType: 'cashback',
    benefits: [
      '1% cashback on all purchases',
      'No annual fee',
      'Instant cashback'
    ],
    eligibility: { minSalary: 5000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  },
  {
    id: 'mashreq-solitaire',
    bankId: 'bank_mashreq',
    name: 'Mashreq Solitaire Credit Card',
    nameAr: 'بطاقة مصرف المشرق سوليتير',
    type: 'Platinum',
    network: 'Visa',
    currency: 'AED',
    imageUrl: 'https://www.mashreq.com/assets/images/cards/solitaire.png',
    annualFee: 500,
    rewardRate: 2.0,
    rewardType: 'cashback',
    benefits: [
      '2% cashback on all spends',
      'Airport lounge access',
      'Travel insurance',
      'Dining privileges'
    ],
    eligibility: { minSalary: 15000, minAge: 21 },
    features: { contactless: true, applePay: true, googlePay: true }
  }
];

const ALL_CARDS = [
  ...EMIRATES_NBD_CARDS,
  ...FAB_CARDS,
  ...MASHREQ_CARDS
];

async function seedUAEBanks() {
  console.log('\n💳 Seeding UAE bank cards...');
  console.log(`📊 Total cards to seed: ${ALL_CARDS.length}`);
  
  let count = 0;
  
  for (const card of ALL_CARDS) {
    await setDoc(doc(db, 'cards', card.id), card);
    count++;
    
    if (count % 5 === 0) {
      console.log(`  ✓ Processed ${count}/${ALL_CARDS.length} cards...`);
    }
  }
  
  console.log('\n📋 Summary by bank:');
  console.log(`  Emirates NBD: ${EMIRATES_NBD_CARDS.length} cards`);
  console.log(`  FAB: ${FAB_CARDS.length} cards`);
  console.log(`  Mashreq: ${MASHREQ_CARDS.length} cards`);
  
  console.log(`\n✅ ${ALL_CARDS.length} cards seeded successfully!`);
}

seedUAEBanks()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
