const fs = require('fs');
const path = require('path');

const csvPath = path.join(process.env.HOME, 'Downloads', '8-digit.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

const binToImage = {};

lines.forEach((line, index) => {
  if (index === 0) return; // Skip header
  
  const parts = line.split(',');
  if (parts.length >= 2) {
    const bin = parts[0].trim().replace(/"/g, '');
    const imageUrl = parts[1].trim().replace(/"/g, '');
    if (bin && imageUrl) {
      binToImage[bin] = imageUrl;
    }
  }
});

console.log('\n🔍 Searching for ADIB-related BINs...\n');

// Common ADIB BIN patterns (these are typical for UAE banks)
const SEARCH_PATTERNS = [
  { pattern: /^5208/, name: 'Mastercard UAE (5208)' },
  { pattern: /^5376/, name: 'Mastercard UAE (5376)' },
  { pattern: /^4280/, name: 'Visa UAE (4280)' },
  { pattern: /^4026/, name: 'Visa UAE (4026)' },
  { pattern: /^4586/, name: 'Visa UAE (4586)' },
  { pattern: /^4916/, name: 'Visa UAE (4916)' },
];

const foundBins = {};

SEARCH_PATTERNS.forEach(({ pattern, name }) => {
  const matches = Object.keys(binToImage).filter(bin => pattern.test(bin));
  if (matches.length > 0) {
    foundBins[name] = matches;
    console.log(`\n${name}: ${matches.length} matches`);
    matches.slice(0, 10).forEach(bin => {
      console.log(`  ${bin} -> ${binToImage[bin].substring(0, 80)}...`);
    });
  }
});

console.log('\n\n📊 Summary:');
console.log(`Total BINs in file: ${Object.keys(binToImage).length}`);
Object.entries(foundBins).forEach(([name, bins]) => {
  console.log(`${name}: ${bins.length} BINs`);
});

// Let's also check the image URLs for any that mention "adib" or "islamic"
console.log('\n\n🔍 Searching for ADIB in image URLs...\n');

const adibUrls = Object.entries(binToImage).filter(([bin, url]) => 
  url.toLowerCase().includes('adib') || 
  url.toLowerCase().includes('islamic') ||
  url.toLowerCase().includes('abu') && url.toLowerCase().includes('dhabi')
);

if (adibUrls.length > 0) {
  console.log(`Found ${adibUrls.length} potential ADIB card images:\n`);
  adibUrls.forEach(([bin, url]) => {
    console.log(`BIN: ${bin}`);
    console.log(`URL: ${url}\n`);
  });
} else {
  console.log('❌ No URLs found with "ADIB", "Islamic", or "Abu Dhabi" in them');
  console.log('\n💡 The CSV might use generic image hosting. Let me show all unique URL patterns:\n');
  
  const urlDomains = new Set();
  Object.values(binToImage).forEach(url => {
    try {
      const domain = new URL(url).hostname;
      urlDomains.add(domain);
    } catch (e) {}
  });
  
  console.log('Unique domains in CSV:');
  Array.from(urlDomains).forEach(domain => console.log(`  - ${domain}`));
}

process.exit(0);
