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

const AREAS = [
  // DUBAI
  { id: 'downtown-dubai', name: 'Downtown Dubai', nameAr: 'وسط مدينة دبي', emoji: '🏙️', city: 'Dubai', country: 'AE', bounds: { north: 25.208, south: 25.190, east: 55.282, west: 55.268 } },
  { id: 'business-bay', name: 'Business Bay', nameAr: 'الخليج التجاري', emoji: '🏢', city: 'Dubai', country: 'AE', bounds: { north: 25.188, south: 25.175, east: 55.272, west: 55.255 } },
  { id: 'difc', name: 'DIFC', nameAr: 'مركز دبي المالي العالمي', emoji: '🏦', city: 'Dubai', country: 'AE', bounds: { north: 25.218, south: 25.208, east: 55.285, west: 55.275 } },
  { id: 'dubai-marina', name: 'Dubai Marina', nameAr: 'مرسى دبي', emoji: '⛵', city: 'Dubai', country: 'AE', bounds: { north: 25.090, south: 25.070, east: 55.145, west: 55.125 } },
  { id: 'jbr', name: 'JBR', nameAr: 'جميرا بيتش ريزيدنس', emoji: '🏖️', city: 'Dubai', country: 'AE', bounds: { north: 25.085, south: 25.075, east: 55.138, west: 55.128 } },
  { id: 'palm-jumeirah', name: 'Palm Jumeirah', nameAr: 'نخلة جميرا', emoji: '🌴', city: 'Dubai', country: 'AE', bounds: { north: 25.125, south: 25.105, east: 55.145, west: 55.115 } },
  { id: 'jumeirah', name: 'Jumeirah', nameAr: 'جميرا', emoji: '🏖️', city: 'Dubai', country: 'AE', bounds: { north: 25.230, south: 25.170, east: 55.260, west: 55.220 } },
  { id: 'deira', name: 'Deira', nameAr: 'ديرة', emoji: '🕌', city: 'Dubai', country: 'AE', bounds: { north: 25.280, south: 25.250, east: 55.340, west: 55.310 } },
  { id: 'bur-dubai', name: 'Bur Dubai', nameAr: 'بر دبي', emoji: '🏛️', city: 'Dubai', country: 'AE', bounds: { north: 25.265, south: 25.235, east: 55.310, west: 55.280 } },
  { id: 'karama', name: 'Karama', nameAr: 'كرامة', emoji: '🏘️', city: 'Dubai', country: 'AE', bounds: { north: 25.252, south: 25.242, east: 55.305, west: 55.295 } },
  { id: 'jlt', name: 'JLT', nameAr: 'أبراج بحيرات جميرا', emoji: '🏗️', city: 'Dubai', country: 'AE', bounds: { north: 25.078, south: 25.062, east: 55.150, west: 55.135 } },
  { id: 'tecom', name: 'TECOM', nameAr: 'تيكوم', emoji: '💼', city: 'Dubai', country: 'AE', bounds: { north: 25.102, south: 25.088, east: 55.180, west: 55.165 } },
  { id: 'media-city', name: 'Media City', nameAr: 'مدينة دبي للإعلام', emoji: '📺', city: 'Dubai', country: 'AE', bounds: { north: 25.098, south: 25.088, east: 55.168, west: 55.158 } },
  { id: 'internet-city', name: 'Internet City', nameAr: 'مدينة دبي للإنترنت', emoji: '💻', city: 'Dubai', country: 'AE', bounds: { north: 25.105, south: 25.095, east: 55.175, west: 55.165 } },
  { id: 'al-barsha', name: 'Al Barsha', nameAr: 'البرشاء', emoji: '🏘️', city: 'Dubai', country: 'AE', bounds: { north: 25.120, south: 25.085, east: 55.215, west: 55.180 } },
  { id: 'dubai-hills', name: 'Dubai Hills', nameAr: 'دبي هيلز', emoji: '🏡', city: 'Dubai', country: 'AE', bounds: { north: 25.120, south: 25.090, east: 55.255, west: 55.225 } },
  { id: 'mbr-city', name: 'MBR City', nameAr: 'مدينة محمد بن راشد', emoji: '🌆', city: 'Dubai', country: 'AE', bounds: { north: 25.155, south: 25.125, east: 55.345, west: 55.315 } },
  { id: 'sports-city', name: 'Sports City', nameAr: 'مدينة دبي الرياضية', emoji: '⚽', city: 'Dubai', country: 'AE', bounds: { north: 25.045, south: 25.025, east: 55.225, west: 55.205 } },
  { id: 'motor-city', name: 'Motor City', nameAr: 'مدينة دبي للسيارات', emoji: '🏎️', city: 'Dubai', country: 'AE', bounds: { north: 25.055, south: 25.035, east: 55.245, west: 55.225 } },
  { id: 'arabian-ranches', name: 'Arabian Ranches', nameAr: 'المرابع العربية', emoji: '🐎', city: 'Dubai', country: 'AE', bounds: { north: 25.075, south: 25.045, east: 55.285, west: 55.255 } },
  { id: 'jvc', name: 'JVC', nameAr: 'قرية جميرا الدائرية', emoji: '🏘️', city: 'Dubai', country: 'AE', bounds: { north: 25.075, south: 25.045, east: 55.225, west: 55.195 } },
  { id: 'the-springs', name: 'The Springs', nameAr: 'الينابيع', emoji: '🏡', city: 'Dubai', country: 'AE', bounds: { north: 25.068, south: 25.058, east: 55.265, west: 55.255 } },
  { id: 'the-meadows', name: 'The Meadows', nameAr: 'المروج', emoji: '🌳', city: 'Dubai', country: 'AE', bounds: { north: 25.078, south: 25.068, east: 55.255, west: 55.245 } },
  { id: 'the-lakes', name: 'The Lakes', nameAr: 'البحيرات', emoji: '🏞️', city: 'Dubai', country: 'AE', bounds: { north: 25.088, south: 25.078, east: 55.245, west: 55.235 } },
  { id: 'silicon-oasis', name: 'Dubai Silicon Oasis', nameAr: 'واحة دبي للسيليكون', emoji: '💻', city: 'Dubai', country: 'AE', bounds: { north: 25.130, south: 25.100, east: 55.395, west: 55.365 } },
  { id: 'international-city', name: 'International City', nameAr: 'المدينة العالمية', emoji: '🌍', city: 'Dubai', country: 'AE', bounds: { north: 25.175, south: 25.155, east: 55.405, west: 55.385 } },
  { id: 'academic-city', name: 'Academic City', nameAr: 'المدينة الأكاديمية', emoji: '🎓', city: 'Dubai', country: 'AE', bounds: { north: 25.125, south: 25.105, east: 55.405, west: 55.385 } },
  { id: 'dragon-mart', name: 'Dragon Mart', nameAr: 'دراجون مارت', emoji: '🐉', city: 'Dubai', country: 'AE', bounds: { north: 25.178, south: 25.168, east: 55.410, west: 55.400 } },
  { id: 'liwan', name: 'Liwan', nameAr: 'ليوان', emoji: '🏘️', city: 'Dubai', country: 'AE', bounds: { north: 25.155, south: 25.135, east: 55.370, west: 55.350 } },
  { id: 'queue-point', name: 'Queue Point', nameAr: 'كيو بوينت', emoji: '🏢', city: 'Dubai', country: 'AE', bounds: { north: 25.148, south: 25.142, east: 55.365, west: 55.359 } },
  { id: 'mirdif', name: 'Mirdif', nameAr: 'مردف', emoji: '🏠', city: 'Dubai', country: 'AE', bounds: { north: 25.225, south: 25.205, east: 55.420, west: 55.400 } },
  { id: 'dubai-south', name: 'Dubai South', nameAr: 'دبي الجنوب', emoji: '✈️', city: 'Dubai', country: 'AE', bounds: { north: 24.920, south: 24.880, east: 55.180, west: 55.140 } },
  { id: 'expo-city', name: 'Expo City', nameAr: 'مدينة إكسبو', emoji: '🎪', city: 'Dubai', country: 'AE', bounds: { north: 25.025, south: 25.005, east: 55.170, west: 55.150 } },
  { id: 'discovery-gardens', name: 'Discovery Gardens', nameAr: 'حدائق الاكتشاف', emoji: '🌺', city: 'Dubai', country: 'AE', bounds: { north: 25.048, south: 25.038, east: 55.138, west: 55.128 } },
  { id: 'ibn-battuta', name: 'Ibn Battuta', nameAr: 'ابن بطوطة', emoji: '🕌', city: 'Dubai', country: 'AE', bounds: { north: 25.048, south: 25.038, east: 55.120, west: 55.110 } },
  { id: 'al-quoz', name: 'Al Quoz', nameAr: 'القوز', emoji: '🏭', city: 'Dubai', country: 'AE', bounds: { north: 25.145, south: 25.105, east: 55.240, west: 55.215 } },
  { id: 'town-square', name: 'Town Square', nameAr: 'ميدان المدينة', emoji: '🏘️', city: 'Dubai', country: 'AE', bounds: { north: 25.078, south: 25.058, east: 55.305, west: 55.285 } },
  { id: 'remraam', name: 'Remraam', nameAr: 'الرمرام', emoji: '🏡', city: 'Dubai', country: 'AE', bounds: { north: 25.050, south: 25.030, east: 55.315, west: 55.295 } },
  { id: 'damac-hills', name: 'DAMAC Hills', nameAr: 'داماك هيلز', emoji: '⛳', city: 'Dubai', country: 'AE', bounds: { north: 25.058, south: 25.028, east: 55.258, west: 55.228 } },
  
  // ABU DHABI
  { id: 'corniche', name: 'Corniche', nameAr: 'الكورنيش', emoji: '🌊', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.490, south: 24.470, east: 54.355, west: 54.335 } },
  { id: 'al-reem-island', name: 'Al Reem Island', nameAr: 'جزيرة الريم', emoji: '🌆', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.505, south: 24.475, east: 54.420, west: 54.390 } },
  { id: 'saadiyat-island', name: 'Saadiyat Island', nameAr: 'جزيرة السعديات', emoji: '🏝️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.560, south: 24.530, east: 54.455, west: 54.425 } },
  { id: 'yas-island', name: 'Yas Island', nameAr: 'جزيرة ياس', emoji: '🏎️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.510, south: 24.470, east: 54.620, west: 54.580 } },
  { id: 'al-maryah-island', name: 'Al Maryah Island', nameAr: 'جزيرة المارية', emoji: '🏢', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.510, south: 24.495, east: 54.395, west: 54.380 } },
  { id: 'khalifa-city', name: 'Khalifa City', nameAr: 'مدينة خليفة', emoji: '🏘️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.445, south: 24.415, east: 54.605, west: 54.575 } },
  { id: 'masdar-city', name: 'Masdar City', nameAr: 'مدينة مصدر', emoji: '🌱', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.435, south: 24.415, east: 54.625, west: 54.605 } },
  
  // SHARJAH
  { id: 'al-majaz', name: 'Al Majaz', nameAr: 'المجاز', emoji: '⛲', city: 'Sharjah', country: 'AE', bounds: { north: 25.335, south: 25.325, east: 55.390, west: 55.380 } },
  { id: 'al-nahda-sharjah', name: 'Al Nahda', nameAr: 'النهدة', emoji: '🏘️', city: 'Sharjah', country: 'AE', bounds: { north: 25.300, south: 25.290, east: 55.375, west: 55.365 } },
  { id: 'muwaileh', name: 'Muwaileh', nameAr: 'مويلح', emoji: '🏘️', city: 'Sharjah', country: 'AE', bounds: { north: 25.290, south: 25.270, east: 55.445, west: 55.425 } },
  
  // AJMAN
  { id: 'al-nuaimiya', name: 'Al Nuaimiya', nameAr: 'النعيمية', emoji: '🏘️', city: 'Ajman', country: 'AE', bounds: { north: 25.405, south: 25.385, east: 55.455, west: 55.435 } },
  { id: 'ajman-corniche', name: 'Ajman Corniche', nameAr: 'كورنيش عجمان', emoji: '🌊', city: 'Ajman', country: 'AE', bounds: { north: 25.410, south: 25.400, east: 55.430, west: 55.420 } },
  
  // RAK
  { id: 'rak-city', name: 'RAK City', nameAr: 'مدينة رأس الخيمة', emoji: '🏙️', city: 'Ras Al Khaimah', country: 'AE', bounds: { north: 25.800, south: 25.780, east: 55.955, west: 55.935 } },
  { id: 'al-hamra-village', name: 'Al Hamra Village', nameAr: 'قرية الحمراء', emoji: '⛳', city: 'Ras Al Khaimah', country: 'AE', bounds: { north: 25.690, south: 25.670, east: 55.805, west: 55.785 } },
  
  // KSA - RIYADH
  { id: 'olaya', name: 'Olaya', nameAr: 'العليا', emoji: '🏢', city: 'Riyadh', country: 'SA', bounds: { north: 24.715, south: 24.695, east: 46.690, west: 46.670 } },
  { id: 'al-malaz', name: 'Al Malaz', nameAr: 'الملز', emoji: '🏛️', city: 'Riyadh', country: 'SA', bounds: { north: 24.705, south: 24.685, east: 46.735, west: 46.715 } },
  { id: 'diplomatic-quarter', name: 'Diplomatic Quarter', nameAr: 'حي السفارات', emoji: '🏛️', city: 'Riyadh', country: 'SA', bounds: { north: 24.690, south: 24.670, east: 46.625, west: 46.605 } },
  
  // KSA - JEDDAH
  { id: 'jeddah-corniche', name: 'Jeddah Corniche', nameAr: 'كورنيش جدة', emoji: '🌊', city: 'Jeddah', country: 'SA', bounds: { north: 21.550, south: 21.480, east: 39.175, west: 39.115 } },
  { id: 'al-balad', name: 'Al Balad', nameAr: 'البلد', emoji: '🕌', city: 'Jeddah', country: 'SA', bounds: { north: 21.490, south: 21.470, east: 39.195, west: 39.175 } },
];

async function seedAreas() {
  console.log('\n🗺️  Seeding areas...');
  
  let count = 0;
  const batchSize = 500; // Firestore batch limit
  let batch = writeBatch(db);
  
  for (const area of AREAS) {
    const areaRef = doc(db, 'areas', area.id);
    batch.set(areaRef, area);
    count++;
    
    if (count % batchSize === 0) {
      await batch.commit();
      batch = writeBatch(db);
      console.log(`  ✓ Committed ${count} areas...`);
    }
  }
  
  // Commit remaining
  if (count % batchSize !== 0) {
    await batch.commit();
  }
  
  console.log(`✅ ${AREAS.length} areas seeded!`);
}

module.exports = { seedAreas };
