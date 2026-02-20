const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const CARDS = [
  // ADIB Cards (22)
  { id: 'adib_cc_1', name: 'ADIB Covered Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_2', name: 'ADIB Infinite Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_3', name: 'ADIB Platinum Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_4', name: 'ADIB Gold Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_5', name: 'ADIB Classic Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_6', name: 'ADIB Islamic Platinum', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_7', name: 'ADIB Etihad Guest', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_8', name: 'ADIB Touchpoints', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_9', name: 'ADIB Traveller Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_10', name: 'ADIB Business Platinum', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_11', name: 'ADIB Smiles Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_12', name: 'ADIB Rewards Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_13', name: 'ADIB Silver Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_14', name: 'ADIB Prestige Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_15', name: 'ADIB Signature Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_16', name: 'ADIB World Elite', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_17', name: 'ADIB Cashback Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_18', name: 'ADIB Shopping Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_19', name: 'ADIB Student Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_20', name: 'ADIB Family Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_21', name: 'ADIB Select Card', type: 'Credit Card', network: 'Visa', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },
  { id: 'adib_cc_22', name: 'ADIB Premier Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#00A651', '#008C44'], bankId: 'bank_adib' },

  // Emirates NBD (7)
  { id: 'enbd_cc_1', name: 'Skywards Signature Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_2', name: 'Platinum Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_3', name: 'Titanium Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_4', name: 'World Elite Mastercard', type: 'Credit Card', network: 'Mastercard', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_5', name: 'Infinite Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_6', name: 'Lulu Mastercard', type: 'Credit Card', network: 'Mastercard', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },
  { id: 'enbd_cc_7', name: 'U By Emaar Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#C8102E', '#A00D26'], bankId: 'bank_emiratesnbd' },

  // FAB (5)
  { id: 'fab_cc_1', name: 'FAB Platinum Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_2', name: 'FAB Infinite Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_3', name: 'FAB Etihad Guest Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_4', name: 'FAB Cashback Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },
  { id: 'fab_cc_5', name: 'FAB Signature Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#7B1FA2', '#6A1B9A'], bankId: 'bank_fab' },

  // Mashreq (5)
  { id: 'mashreq_cc_1', name: 'Mashreq Gold Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_2', name: 'Mashreq Platinum Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_3', name: 'Mashreq Salam Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_4', name: 'Mashreq Infinite Credit Card', type: 'Credit Card', network: 'Mastercard', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
  { id: 'mashreq_cc_5', name: 'Mashreq Skywards Credit Card', type: 'Credit Card', network: 'Visa', gradient: ['#E31837', '#C0102D'], bankId: 'bank_mashreq' },
];

async function setupCards() {
  console.log('💳 Setting up cards database...\n');

  for (const card of CARDS) {
    await db.collection('cards').doc(card.id).set({
      ...card,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ ${card.name}`);
  }

  console.log(`\n🎉 ${CARDS.length} cards setup complete!\n`);
  process.exit(0);
}

setupCards().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
