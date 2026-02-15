const { seedBranding } = require('./seedBranding');
const { seedOffers } = require('./seedOffers');
const { seedCards } = require('./seedCards');
const { updateCardBranding } = require('./updateCardBranding');

async function main() {
  console.log('🌱 Starting database seeding...\n');
  
  try {
    await seedBranding();
    await seedCards();
    await updateCardBranding();
    await seedOffers();
    console.log('\n✅ All seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
