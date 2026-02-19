// Test SMS parsing with real ADIB examples

const testMessages = [
  {
    sender: 'ADIB',
    body: 'Trx. of AED35.40 on your card ending *298 at SMILES FOOD, UAE is Approved. Avl. card bal is 9934.17. Trx Date: 06/10/25 17:54'
  },
  {
    sender: 'AD-ADIB',
    body: 'Never share this code. Use Verification Code 815709 to pay QAR 1 at Merchant using card ending 7622. Not you? Freeze your card immediately and call +971 26100116'
  },
  {
    sender: 'ADIB',
    body: 'Trx. of AED 150.50 on your card ending *1234 at CARREFOUR, UAE is Approved. Avl. card bal is 5000.00'
  },
  {
    sender: 'ADIB',
    body: 'Trx. of AED 89.99 on your card ending 5678 at EMARAT PETROL is Declined'
  }
];

console.log('🧪 Testing SMS Parser\n');

testMessages.forEach((msg, index) => {
  console.log(`Test ${index + 1}:`);
  console.log(`Sender: ${msg.sender}`);
  console.log(`Message: ${msg.body.substring(0, 80)}...`);
  
  // Simulate parsing logic
  const patterns = [
    {
      name: 'Pattern 1 (Trx. of)',
      regex: /Trx\.\s+of\s+([A-Z]{3})\s*([\d,]+\.?\d*)\s+on\s+your\s+card\s+ending\s+\*?(\d{3,4})\s+at\s+([^,]+).*?is\s+(Approved|Declined).*?(?:Avl\.\s+card\s+bal\s+is\s+([\d,]+\.?\d*))?/i
    },
    {
      name: 'Pattern 2 (pay/spend)',
      regex: /(?:pay|spend)\s+([A-Z]{3})\s*([\d,]+\.?\d*)\s+at\s+([^u]+)\s+using\s+card\s+ending\s+(\d{4})/i
    }
  ];
  
  let matched = false;
  for (const pattern of patterns) {
    const match = msg.body.match(pattern.regex);
    if (match) {
      console.log(`✅ Matched: ${pattern.name}`);
      console.log(`   Currency: ${match[1] || 'N/A'}`);
      console.log(`   Amount: ${match[2] || 'N/A'}`);
      console.log(`   Card: ${match[3] || match[4] || 'N/A'}`);
      console.log(`   Merchant: ${match[4] || match[3] || 'N/A'}`);
      if (match[5]) console.log(`   Status: ${match[5]}`);
      if (match[6]) console.log(`   Balance: ${match[6]}`);
      matched = true;
      break;
    }
  }
  
  if (!matched) {
    console.log('❌ No pattern matched');
  }
  
  console.log('---\n');
});
