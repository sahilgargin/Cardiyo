const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// All Banks
const BANKS = [
  { id: 'bank_adib', name: 'Abu Dhabi Islamic Bank', shortName: 'ADIB', logo: '🏦', country: 'AE', primaryColor: '#00A651', gradient: ['#00A651', '#008C44'] },
  { id: 'bank_emiratesnbd', name: 'Emirates NBD', shortName: 'Emirates NBD', logo: '🏦', country: 'AE', primaryColor: '#C8102E', gradient: ['#C8102E', '#A00D26'] },
  { id: 'bank_fab', name: 'First Abu Dhabi Bank', shortName: 'FAB', logo: '🏦', country: 'AE', primaryColor: '#7B1FA2', gradient: ['#7B1FA2', '#6A1B9A'] },
  { id: 'bank_mashreq', name: 'Mashreq Bank', shortName: 'Mashreq', logo: '🏦', country: 'AE', primaryColor: '#E31837', gradient: ['#E31837', '#C0102D'] },
  { id: 'bank_wio', name: 'Wio Bank', shortName: 'wio', logo: '🏦', country: 'AE', primaryColor: '#00D4AA', gradient: ['#00D4AA', '#00B88F'] },
  { id: 'bank_citi', name: 'Citibank UAE', shortName: 'Citi', logo: '🏦', country: 'AE', primaryColor: '#003D7A', gradient: ['#003D7A', '#002855'] },
];

// All Cards - 100+ cards
const CARDS = [
  // ADIB Cards (22)
  { id: 'adib_cc_1', name: 'ADIB Covered Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_2', name: 'ADIB Infinite Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_3', name: 'ADIB Platinum Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_4', name: 'ADIB Gold Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_5', name: 'ADIB Classic Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_6', name: 'ADIB Islamic Platinum Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_7', name: 'ADIB Etihad Guest Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_8', name: 'ADIB Touchpoints Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_9', name: 'ADIB Traveller Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_10', name: 'ADIB Business Platinum Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_11', name: 'ADIB Smiles Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_12', name: 'ADIB Rewards Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_13', name: 'ADIB Silver Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_14', name: 'ADIB Prestige Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_15', name: 'ADIB Signature Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_16', name: 'ADIB World Elite Mastercard', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_17', name: 'ADIB Cashback Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_18', name: 'ADIB Shopping Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_19', name: 'ADIB Student Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_20', name: 'ADIB Family Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_21', name: 'ADIB Select Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_22', name: 'ADIB Premier Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  
  // ADIB Accounts (5)
  { id: 'adib_acc_1', name: 'ADIB Current Account', type: 'Bank Account', network: 'Account', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_acc_2', name: 'ADIB Savings Account', type: 'Bank Account', network: 'Account', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_acc_3', name: 'ADIB Premium Account', type: 'Bank Account', network: 'Account', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_acc_4', name: 'ADIB Business Account', type: 'Bank Account', network: 'Account', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_acc_5', name: 'ADIB Ghina Account', type: 'Bank Account', network: 'Account', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },

  // Emirates NBD Cards (15)
  { id: 'enbd_cc_1', name: 'Skywards Signature Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_2', name: 'Emirates NBD Platinum Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_3', name: 'Emirates NBD Titanium Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_4', name: 'World Elite Mastercard', type: 'Credit Card', network: 'Mastercard', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_5', name: 'Emirates NBD Infinite Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_6', name: 'Lulu Mastercard', type: 'Credit Card', network: 'Mastercard', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_7', name: 'U By Emaar Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_8', name: 'Emirates NBD Visa Signature', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_9', name: 'Emirates NBD Gold Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_10', name: 'Emirates NBD Classic Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_11', name: 'Najm Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_12', name: 'Emirates Islamic Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_13', name: 'Visa Cashback Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_14', name: 'Business Platinum Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_15', name: 'Skywards Infinite Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },

  // Emirates NBD Accounts (5)
  { id: 'enbd_acc_1', name: 'Emirates NBD Current Account', type: 'Bank Account', network: 'Account', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_acc_2', name: 'Emirates NBD Savings Account', type: 'Bank Account', network: 'Account', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_acc_3', name: 'Liv. Account', type: 'Bank Account', network: 'Account', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_acc_4', name: 'Premium Banking Account', type: 'Bank Account', network: 'Account', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_acc_5', name: 'Business Current Account', type: 'Bank Account', network: 'Account', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },

  // FAB Cards (12)
  { id: 'fab_cc_1', name: 'FAB Platinum Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_2', name: 'FAB Infinite Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_3', name: 'FAB Etihad Guest Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_4', name: 'FAB Cashback Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_5', name: 'FAB Signature Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_6', name: 'FAB World Elite Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_7', name: 'FAB Gold Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_8', name: 'FAB Classic Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_9', name: 'FAB Titanium Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_10', name: 'FAB Business Platinum', type: 'Credit Card', network: 'Mastercard', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_11', name: 'FAB Rewards Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_12', name: 'FAB Premium Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },

  // FAB Accounts (5)
  { id: 'fab_acc_1', name: 'FAB Current Account', type: 'Bank Account', network: 'Account', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_acc_2', name: 'FAB Savings Account', type: 'Bank Account', network: 'Account', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_acc_3', name: 'FAB Priority Account', type: 'Bank Account', network: 'Account', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_acc_4', name: 'FAB Private Account', type: 'Bank Account', network: 'Account', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_acc_5', name: 'FAB Business Account', type: 'Bank Account', network: 'Account', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },

  // Mashreq Cards (10)
  { id: 'mashreq_cc_1', name: 'Mashreq Gold Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_2', name: 'Mashreq Platinum Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_3', name: 'Mashreq Salam Card', type: 'Credit Card', network: 'Visa', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_4', name: 'Mashreq Infinite Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_5', name: 'Mashreq Skywards Card', type: 'Credit Card', network: 'Visa', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_6', name: 'Mashreq Signature Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_7', name: 'Mashreq Classic Card', type: 'Credit Card', network: 'Visa', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_8', name: 'Mashreq Cashback Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_9', name: 'Mashreq World Elite', type: 'Credit Card', network: 'Mastercard', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_10', name: 'Mashreq Business Card', type: 'Credit Card', network: 'Visa', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },

  // Mashreq Accounts (4)
  { id: 'mashreq_acc_1', name: 'Mashreq Current Account', type: 'Bank Account', network: 'Account', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_acc_2', name: 'Mashreq Savings Account', type: 'Bank Account', network: 'Account', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_acc_3', name: 'Mashreq Elite Account', type: 'Bank Account', network: 'Account', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_acc_4', name: 'Mashreq Neo Account', type: 'Bank Account', network: 'Account', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },

  // Wio Bank Cards (8)
  { id: 'wio_cc_1', name: 'wio Mastercard', type: 'Debit Card', network: 'Mastercard', gradient: ['#00D4AA', '#00B88F'], bankId: 'bank_wio' },
  { id: 'wio_cc_2', name: 'wio Virtual Card', type: 'Virtual Card', network: 'Mastercard', gradient: ['#00D4AA', '#00B88F'], bankId: 'bank_wio' },
  { id: 'wio_cc_3', name: 'wio Business Card', type: 'Debit Card', network: 'Mastercard', gradient: ['#00D4AA', '#00B88F'], bankId: 'bank_wio' },
  { id: 'wio_cc_4', name: 'wio Plus Card', type: 'Debit Card', network: 'Mastercard', gradient: ['#00D4AA', '#00B88F'], bankId: 'bank_wio' },
  { id: 'wio_cc_5', name: 'wio Premium Card', type: 'Debit Card', network: 'Mastercard', gradient: ['#00D4AA', '#00B88F'], bankId: 'bank_wio' },
  { id: 'wio_cc_6', name: 'wio Travel Card', type: 'Prepaid Card', network: 'Mastercard', gradient: ['#00D4AA', '#00B88F'], bankId: 'bank_wio' },
  { id: 'wio_cc_7', name: 'wio Student Card', type: 'Debit Card', network: 'Mastercard', gradient: ['#00D4AA', '#00B88F'], bankId: 'bank_wio' },
  { id: 'wio_cc_8', name: 'wio Family Card', type: 'Debit Card', network: 'Mastercard', gradient: ['#00D4AA', '#00B88F'], bankId: 'bank_wio' },

  // Wio Accounts (3)
  { id: 'wio_acc_1', name: 'wio Current Account', type: 'Bank Account', network: 'Account', gradient: ['#00D4AA', '#00B88F'], bankId: 'bank_wio' },
  { id: 'wio_acc_2', name: 'wio Business Account', type: 'Bank Account', network: 'Account', gradient: ['#00D4AA', '#00B88F'], bankId: 'bank_wio' },
  { id: 'wio_acc_3', name: 'wio Savings Pocket', type: 'Bank Account', network: 'Account', gradient: ['#00D4AA', '#00B88F'], bankId: 'bank_wio' },

  // Citibank Cards (12)
  { id: 'citi_cc_1', name: 'Citi Prestige Card', type: 'Credit Card', network: 'Visa', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_cc_2', name: 'Citi Premier Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_cc_3', name: 'Citi Rewards Card', type: 'Credit Card', network: 'Visa', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_cc_4', name: 'Citi Cashback Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_cc_5', name: 'Citi Simplicity Card', type: 'Credit Card', network: 'Visa', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_cc_6', name: 'Citi Platinum Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_cc_7', name: 'Citi Gold Card', type: 'Credit Card', network: 'Visa', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_cc_8', name: 'Citi Emirates Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_cc_9', name: 'Citi Business Card', type: 'Credit Card', network: 'Visa', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_cc_10', name: 'Citi Ultimate Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_cc_11', name: 'Citi World Elite', type: 'Credit Card', network: 'Mastercard', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_cc_12', name: 'Citi Signature Card', type: 'Credit Card', network: 'Visa', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },

  // Citibank Accounts (4)
  { id: 'citi_acc_1', name: 'Citi Current Account', type: 'Bank Account', network: 'Account', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_acc_2', name: 'Citi Savings Account', type: 'Bank Account', network: 'Account', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_acc_3', name: 'Citigold Account', type: 'Bank Account', network: 'Account', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
  { id: 'citi_acc_4', name: 'Citi Priority Account', type: 'Bank Account', network: 'Account', gradient: ['#003D7A', '#002855'], bankId: 'bank_citi' },
];

async function setupAllCards() {
  console.log('🏦 Setting up banks...\n');

  for (const bank of BANKS) {
    await db.collection('config').doc('banks').collection('items').doc(bank.id).set({
      ...bank,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ ${bank.name}`);
  }

  console.log('\n💳 Setting up cards...\n');

  for (const card of CARDS) {
    await db.collection('cards').doc(card.id).set({
      ...card,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ ${card.name}`);
  }

  console.log(`\n🎉 Setup complete!`);
  console.log(`📊 Total: ${BANKS.length} banks, ${CARDS.length} cards/accounts\n`);
  process.exit(0);
}

setupAllCards().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
