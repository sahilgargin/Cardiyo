const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

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

// Read the CSV file from Downloads
const csvPath = path.join(process.env.HOME, 'Downloads', '8-digit.csv');

console.log(`\n📂 Reading file: ${csvPath}\n`);

if (!fs.existsSync(csvPath)) {
  console.error('❌ File not found!');
  console.log('Please ensure the file is at:', csvPath);
  process.exit(1);
}

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

console.log(`📊 Total lines in CSV: ${lines.length}\n`);

// Parse CSV
const binToImage = {};
let header = '';

lines.forEach((line, index) => {
  if (index === 0) {
    header = line;
    console.log('CSV Header:', line, '\n');
    return;
  }
  
  const parts = line.split(',');
  if (parts.length >= 2) {
    const bin = parts[0].trim().replace(/"/g, '');
    const imageUrl = parts[1].trim().replace(/"/g, '');
    if (bin && imageUrl) {
      binToImage[bin] = imageUrl;
    }
  }
});

console.log(`✅ Parsed ${Object.keys(binToImage).length} BIN entries\n`);

console.log('First 10 BIN entries:');
Object.entries(binToImage).slice(0, 10).forEach(([bin, url]) => {
  console.log(`  ${bin} -> ${url}`);
});

console.log('\n📋 All BINs (showing first 50):');
Object.keys(binToImage).slice(0, 50).forEach((bin, idx) => {
  console.log(`  ${idx + 1}. ${bin}`);
});

console.log('\n💡 Next steps:');
console.log('1. Identify which BINs match ADIB cards');
console.log('2. Look for BINs starting with common UAE patterns (e.g., 5208, 4280, etc.)');
console.log('3. Update the mapping and re-run');

process.exit(0);
