export interface Area {
  id: string;
  name: string;
  nameAr: string;
  emoji: string;
  city: string;
  country: 'AE' | 'SA';
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// ==================== UAE AREAS ====================

const DUBAI_AREAS: Area[] = [
  // Downtown & Business Bay
  { id: 'downtown-dubai', name: 'Downtown Dubai', nameAr: 'وسط مدينة دبي', emoji: '🏙️', city: 'Dubai', country: 'AE', bounds: { north: 25.208, south: 25.190, east: 55.282, west: 55.268 } },
  { id: 'business-bay', name: 'Business Bay', nameAr: 'الخليج التجاري', emoji: '🏢', city: 'Dubai', country: 'AE', bounds: { north: 25.188, south: 25.175, east: 55.272, west: 55.255 } },
  { id: 'difc', name: 'DIFC', nameAr: 'مركز دبي المالي العالمي', emoji: '🏦', city: 'Dubai', country: 'AE', bounds: { north: 25.218, south: 25.208, east: 55.285, west: 55.275 } },
  
  // Marina & JBR
  { id: 'dubai-marina', name: 'Dubai Marina', nameAr: 'مرسى دبي', emoji: '⛵', city: 'Dubai', country: 'AE', bounds: { north: 25.090, south: 25.070, east: 55.145, west: 55.125 } },
  { id: 'jbr', name: 'JBR', nameAr: 'جميرا بيتش ريزيدنس', emoji: '🏖️', city: 'Dubai', country: 'AE', bounds: { north: 25.085, south: 25.075, east: 55.138, west: 55.128 } },
  { id: 'palm-jumeirah', name: 'Palm Jumeirah', nameAr: 'نخلة جميرا', emoji: '🌴', city: 'Dubai', country: 'AE', bounds: { north: 25.125, south: 25.105, east: 55.145, west: 55.115 } },
  { id: 'bluewaters', name: 'Bluewaters Island', nameAr: 'جزيرة بلووترز', emoji: '🎡', city: 'Dubai', country: 'AE', bounds: { north: 25.080, south: 25.075, east: 55.125, west: 55.120 } },
  
  // Jumeirah
  { id: 'jumeirah-1', name: 'Jumeirah 1', nameAr: 'جميرا ١', emoji: '🏖️', city: 'Dubai', country: 'AE', bounds: { north: 25.230, south: 25.210, east: 55.260, west: 55.240 } },
  { id: 'jumeirah-2', name: 'Jumeirah 2', nameAr: 'جميرا ٢', emoji: '🏖️', city: 'Dubai', country: 'AE', bounds: { north: 25.210, south: 25.190, east: 55.250, west: 55.230 } },
  { id: 'jumeirah-3', name: 'Jumeirah 3', nameAr: 'جميرا ٣', emoji: '🏖️', city: 'Dubai', country: 'AE', bounds: { north: 25.190, south: 25.170, east: 55.240, west: 55.220 } },
  { id: 'umm-suqeim', name: 'Umm Suqeim', nameAr: 'أم سقيم', emoji: '🏄', city: 'Dubai', country: 'AE', bounds: { north: 25.145, south: 25.125, east: 55.195, west: 55.175 } },
  
  // Old Dubai
  { id: 'deira', name: 'Deira', nameAr: 'ديرة', emoji: '🕌', city: 'Dubai', country: 'AE', bounds: { north: 25.280, south: 25.250, east: 55.340, west: 55.310 } },
  { id: 'bur-dubai', name: 'Bur Dubai', nameAr: 'بر دبي', emoji: '🏛️', city: 'Dubai', country: 'AE', bounds: { north: 25.265, south: 25.235, east: 55.310, west: 55.280 } },
  { id: 'karama', name: 'Karama', nameAr: 'كرامة', emoji: '🏘️', city: 'Dubai', country: 'AE', bounds: { north: 25.252, south: 25.242, east: 55.305, west: 55.295 } },
  { id: 'satwa', name: 'Satwa', nameAr: 'السطوة', emoji: '🏪', city: 'Dubai', country: 'AE', bounds: { north: 25.238, south: 25.228, east: 55.275, west: 55.265 } },
  { id: 'al-fahidi', name: 'Al Fahidi', nameAr: 'الفهيدي', emoji: '🏰', city: 'Dubai', country: 'AE', bounds: { north: 25.268, south: 25.258, east: 55.300, west: 55.290 } },
  
  // JLT & Surroundings
  { id: 'jlt', name: 'JLT', nameAr: 'أبراج بحيرات جميرا', emoji: '🏗️', city: 'Dubai', country: 'AE', bounds: { north: 25.078, south: 25.062, east: 55.150, west: 55.135 } },
  { id: 'tecom', name: 'TECOM', nameAr: 'تيكوم', emoji: '💼', city: 'Dubai', country: 'AE', bounds: { north: 25.102, south: 25.088, east: 55.180, west: 55.165 } },
  { id: 'media-city', name: 'Media City', nameAr: 'مدينة دبي للإعلام', emoji: '📺', city: 'Dubai', country: 'AE', bounds: { north: 25.098, south: 25.088, east: 55.168, west: 55.158 } },
  { id: 'internet-city', name: 'Internet City', nameAr: 'مدينة دبي للإنترنت', emoji: '💻', city: 'Dubai', country: 'AE', bounds: { north: 25.105, south: 25.095, east: 55.175, west: 55.165 } },
  { id: 'knowledge-village', name: 'Knowledge Village', nameAr: 'قرية المعرفة', emoji: '🎓', city: 'Dubai', country: 'AE', bounds: { north: 25.115, south: 25.105, east: 55.185, west: 55.175 } },
  
  // Al Barsha & Nearby
  { id: 'al-barsha-1', name: 'Al Barsha 1', nameAr: 'البرشاء ١', emoji: '🏘️', city: 'Dubai', country: 'AE', bounds: { north: 25.115, south: 25.100, east: 55.200, west: 55.185 } },
  { id: 'al-barsha-2', name: 'Al Barsha 2', nameAr: 'البرشاء ٢', emoji: '🏘️', city: 'Dubai', country: 'AE', bounds: { north: 25.100, south: 25.085, east: 55.195, west: 55.180 } },
  { id: 'al-barsha-3', name: 'Al Barsha 3', nameAr: 'البرشاء ٣', emoji: '🏘️', city: 'Dubai', country: 'AE', bounds: { north: 25.120, south: 25.105, east: 55.215, west: 55.200 } },
  { id: 'mall-of-emirates', name: 'Mall of the Emirates', nameAr: 'مول الإمارات', emoji: '🛍️', city: 'Dubai', country: 'AE', bounds: { north: 25.120, south: 25.115, east: 55.202, west: 55.197 } },
  
  // Sheikh Zayed Road
  { id: 'sheikh-zayed-road', name: 'Sheikh Zayed Road', nameAr: 'شارع الشيخ زايد', emoji: '🛣️', city: 'Dubai', country: 'AE', bounds: { north: 25.220, south: 25.100, east: 55.280, west: 55.260 } },
  { id: 'trade-centre', name: 'Trade Centre', nameAr: 'مركز التجارة', emoji: '🏢', city: 'Dubai', country: 'AE', bounds: { north: 25.230, south: 25.220, east: 55.288, west: 55.278 } },
  
  // Dubai Hills & MBR City
  { id: 'dubai-hills', name: 'Dubai Hills Estate', nameAr: 'دبي هيلز استيت', emoji: '🏡', city: 'Dubai', country: 'AE', bounds: { north: 25.120, south: 25.090, east: 55.255, west: 55.225 } },
  { id: 'mbr-city', name: 'MBR City', nameAr: 'مدينة محمد بن راشد', emoji: '🌆', city: 'Dubai', country: 'AE', bounds: { north: 25.155, south: 25.125, east: 55.345, west: 55.315 } },
  { id: 'meydan', name: 'Meydan', nameAr: 'ميدان', emoji: '🏇', city: 'Dubai', country: 'AE', bounds: { north: 25.180, south: 25.160, east: 55.315, west: 55.295 } },
  
  // Sports & Motor City
  { id: 'sports-city', name: 'Sports City', nameAr: 'مدينة دبي الرياضية', emoji: '⚽', city: 'Dubai', country: 'AE', bounds: { north: 25.045, south: 25.025, east: 55.225, west: 55.205 } },
  { id: 'motor-city', name: 'Motor City', nameAr: 'مدينة دبي للسيارات', emoji: '🏎️', city: 'Dubai', country: 'AE', bounds: { north: 25.055, south: 25.035, east: 55.245, west: 55.225 } },
  { id: 'studio-city', name: 'Studio City', nameAr: 'ستوديو سيتي', emoji: '🎬', city: 'Dubai', country: 'AE', bounds: { north: 25.048, south: 25.038, east: 55.238, west: 55.228 } },
  
  // Arabian Ranches & Communities
  { id: 'arabian-ranches', name: 'Arabian Ranches', nameAr: 'المرابع العربية', emoji: '🐎', city: 'Dubai', country: 'AE', bounds: { north: 25.075, south: 25.045, east: 55.285, west: 55.255 } },
  { id: 'arabian-ranches-2', name: 'Arabian Ranches 2', nameAr: 'المرابع العربية ٢', emoji: '🐎', city: 'Dubai', country: 'AE', bounds: { north: 25.070, south: 25.040, east: 55.315, west: 55.285 } },
  { id: 'jvc', name: 'JVC', nameAr: 'قرية جميرا الدائرية', emoji: '🏘️', city: 'Dubai', country: 'AE', bounds: { north: 25.075, south: 25.045, east: 55.225, west: 55.195 } },
  { id: 'the-springs', name: 'The Springs', nameAr: 'الينابيع', emoji: '🏡', city: 'Dubai', country: 'AE', bounds: { north: 25.068, south: 25.058, east: 55.265, west: 55.255 } },
  { id: 'the-meadows', name: 'The Meadows', nameAr: 'المروج', emoji: '🌳', city: 'Dubai', country: 'AE', bounds: { north: 25.078, south: 25.068, east: 55.255, west: 55.245 } },
  { id: 'the-lakes', name: 'The Lakes', nameAr: 'البحيرات', emoji: '🏞️', city: 'Dubai', country: 'AE', bounds: { north: 25.088, south: 25.078, east: 55.245, west: 55.235 } },
  { id: 'the-greens', name: 'The Greens', nameAr: 'الخضراء', emoji: '⛳', city: 'Dubai', country: 'AE', bounds: { north: 25.095, south: 25.085, east: 55.168, west: 55.158 } },
  { id: 'the-views', name: 'The Views', nameAr: 'المناظر', emoji: '🏞️', city: 'Dubai', country: 'AE', bounds: { north: 25.102, south: 25.092, east: 55.152, west: 55.142 } },
  
  // Mirdif & East Dubai
  { id: 'mirdif', name: 'Mirdif', nameAr: 'مردف', emoji: '🏠', city: 'Dubai', country: 'AE', bounds: { north: 25.225, south: 25.205, east: 55.420, west: 55.400 } },
  { id: 'silicon-oasis', name: 'Silicon Oasis', nameAr: 'واحة دبي للسيليكون', emoji: '💻', city: 'Dubai', country: 'AE', bounds: { north: 25.130, south: 25.100, east: 55.395, west: 55.365 } },
  { id: 'academic-city', name: 'Academic City', nameAr: 'المدينة الأكاديمية', emoji: '🎓', city: 'Dubai', country: 'AE', bounds: { north: 25.125, south: 25.105, east: 55.405, west: 55.385 } },
  { id: 'international-city', name: 'International City', nameAr: 'المدينة العالمية', emoji: '🌍', city: 'Dubai', country: 'AE', bounds: { north: 25.175, south: 25.155, east: 55.405, west: 55.385 } },
  { id: 'dragon-mart', name: 'Dragon Mart', nameAr: 'دراجون مارت', emoji: '🐉', city: 'Dubai', country: 'AE', bounds: { north: 25.178, south: 25.168, east: 55.410, west: 55.400 } },
  
  // Dubai South & Expo
  { id: 'dubai-south', name: 'Dubai South', nameAr: 'دبي الجنوب', emoji: '✈️', city: 'Dubai', country: 'AE', bounds: { north: 24.920, south: 24.880, east: 55.180, west: 55.140 } },
  { id: 'expo-city', name: 'Expo City', nameAr: 'مدينة إكسبو', emoji: '🎪', city: 'Dubai', country: 'AE', bounds: { north: 25.025, south: 25.005, east: 55.170, west: 55.150 } },
  
  // Discovery Gardens & Nearby
  { id: 'discovery-gardens', name: 'Discovery Gardens', nameAr: 'حدائق الاكتشاف', emoji: '🌺', city: 'Dubai', country: 'AE', bounds: { north: 25.048, south: 25.038, east: 55.138, west: 55.128 } },
  { id: 'ibn-battuta', name: 'Ibn Battuta', nameAr: 'ابن بطوطة', emoji: '🕌', city: 'Dubai', country: 'AE', bounds: { north: 25.048, south: 25.038, east: 55.120, west: 55.110 } },
  { id: 'jebel-ali', name: 'Jebel Ali', nameAr: 'جبل علي', emoji: '🏭', city: 'Dubai', country: 'AE', bounds: { north: 25.028, south: 24.998, east: 55.050, west: 55.020 } },
  
  // Dubai Creek & Harbour
  { id: 'dubai-creek', name: 'Dubai Creek', nameAr: 'خور دبي', emoji: '⛵', city: 'Dubai', country: 'AE', bounds: { north: 25.270, south: 25.250, east: 55.325, west: 55.305 } },
  { id: 'dubai-harbour', name: 'Dubai Harbour', nameAr: 'مرسى دبي', emoji: '⚓', city: 'Dubai', country: 'AE', bounds: { north: 25.080, south: 25.070, east: 55.115, west: 55.105 } },
  
  // Nad Al Sheba
  { id: 'nad-al-sheba', name: 'Nad Al Sheba', nameAr: 'ند الشبا', emoji: '🏇', city: 'Dubai', country: 'AE', bounds: { north: 25.168, south: 25.148, east: 55.335, west: 55.315 } },
  
  // Damac Hills & Nearby
  { id: 'damac-hills', name: 'DAMAC Hills', nameAr: 'داماك هيلز', emoji: '⛳', city: 'Dubai', country: 'AE', bounds: { north: 25.058, south: 25.028, east: 55.258, west: 55.228 } },
  { id: 'damac-hills-2', name: 'DAMAC Hills 2', nameAr: 'داماك هيلز ٢', emoji: '⛳', city: 'Dubai', country: 'AE', bounds: { north: 25.048, south: 25.018, east: 55.288, west: 55.258 } },
  
  // Town Square & Nearby
  { id: 'town-square', name: 'Town Square', nameAr: 'ميدان المدينة', emoji: '🏘️', city: 'Dubai', country: 'AE', bounds: { north: 25.078, south: 25.058, east: 55.305, west: 55.285 } },
  { id: 'remraam', name: 'Remraam', nameAr: 'الرمرام', emoji: '🏡', city: 'Dubai', country: 'AE', bounds: { north: 25.050, south: 25.030, east: 55.315, west: 55.295 } },
  
  // Al Quoz
  { id: 'al-quoz-1', name: 'Al Quoz 1', nameAr: 'القوز ١', emoji: '🏭', city: 'Dubai', country: 'AE', bounds: { north: 25.145, south: 25.135, east: 55.240, west: 55.230 } },
  { id: 'al-quoz-2', name: 'Al Quoz 2', nameAr: 'القوز ٢', emoji: '🏭', city: 'Dubai', country: 'AE', bounds: { north: 25.135, south: 25.125, east: 55.235, west: 55.225 } },
  { id: 'al-quoz-3', name: 'Al Quoz 3', nameAr: 'القوز ٣', emoji: '🏭', city: 'Dubai', country: 'AE', bounds: { north: 25.125, south: 25.115, east: 55.230, west: 55.220 } },
  { id: 'al-quoz-4', name: 'Al Quoz 4', nameAr: 'القوز ٤', emoji: '🏭', city: 'Dubai', country: 'AE', bounds: { north: 25.115, south: 25.105, east: 55.225, west: 55.215 } },
];

const ABU_DHABI_AREAS: Area[] = [
  // Abu Dhabi Island
  { id: 'corniche', name: 'Corniche', nameAr: 'الكورنيش', emoji: '🌊', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.490, south: 24.470, east: 54.355, west: 54.335 } },
  { id: 'marina', name: 'Marina', nameAr: 'المارينا', emoji: '⛵', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.485, south: 24.465, east: 54.365, west: 54.345 } },
  { id: 'downtown-abu-dhabi', name: 'Downtown', nameAr: 'وسط المدينة', emoji: '🏙️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.500, south: 24.480, east: 54.375, west: 54.355 } },
  { id: 'al-zahiyah', name: 'Al Zahiyah', nameAr: 'الزاهية', emoji: '🏢', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.505, south: 24.485, east: 54.385, west: 54.365 } },
  { id: 'al-markaziyah', name: 'Al Markaziyah', nameAr: 'المركزية', emoji: '🏛️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.495, south: 24.475, east: 54.380, west: 54.360 } },
  { id: 'al-khalidiya', name: 'Al Khalidiya', nameAr: 'الخالدية', emoji: '🏘️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.475, south: 24.455, east: 54.365, west: 54.345 } },
  { id: 'al-karamah', name: 'Al Karamah', nameAr: 'الكرامة', emoji: '🏠', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.510, south: 24.490, east: 54.395, west: 54.375 } },
  { id: 'al-manaseer', name: 'Al Manaseer', nameAr: 'المناصير', emoji: '🏘️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.505, south: 24.485, east: 54.405, west: 54.385 } },
  { id: 'al-rowdah', name: 'Al Rowdah', nameAr: 'الروضة', emoji: '🌳', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.515, south: 24.495, east: 54.410, west: 54.390 } },
  
  // Saadiyat Island
  { id: 'saadiyat-island', name: 'Saadiyat Island', nameAr: 'جزيرة السعديات', emoji: '🏝️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.560, south: 24.530, east: 54.455, west: 54.425 } },
  { id: 'saadiyat-beach', name: 'Saadiyat Beach', nameAr: 'شاطئ السعديات', emoji: '🏖️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.555, south: 24.545, east: 54.445, west: 54.435 } },
  { id: 'saadiyat-cultural', name: 'Saadiyat Cultural District', nameAr: 'المنطقة الثقافية', emoji: '🎨', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.545, south: 24.535, east: 54.440, west: 54.430 } },
  
  // Yas Island
  { id: 'yas-island', name: 'Yas Island', nameAr: 'جزيرة ياس', emoji: '🏎️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.510, south: 24.470, east: 54.620, west: 54.580 } },
  { id: 'yas-marina', name: 'Yas Marina', nameAr: 'مارينا ياس', emoji: '⛵', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.475, south: 24.465, east: 54.605, west: 54.595 } },
  
  // Al Reem Island
  { id: 'al-reem-island', name: 'Al Reem Island', nameAr: 'جزيرة الريم', emoji: '🌆', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.505, south: 24.475, east: 54.420, west: 54.390 } },
  { id: 'shams-abu-dhabi', name: 'Shams Abu Dhabi', nameAr: 'شمس أبوظبي', emoji: '☀️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.495, south: 24.485, east: 54.410, west: 54.400 } },
  { id: 'marina-square', name: 'Marina Square', nameAr: 'ساحة المارينا', emoji: '⛵', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.490, south: 24.480, east: 54.405, west: 54.395 } },
  
  // Al Maryah Island
  { id: 'al-maryah-island', name: 'Al Maryah Island', nameAr: 'جزيرة المارية', emoji: '🏢', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.510, south: 24.495, east: 54.395, west: 54.380 } },
  
  // Mainland Communities
  { id: 'khalifa-city', name: 'Khalifa City', nameAr: 'مدينة خليفة', emoji: '🏘️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.445, south: 24.415, east: 54.605, west: 54.575 } },
  { id: 'al-reef', name: 'Al Reef', nameAr: 'الريف', emoji: '🏡', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.430, south: 24.410, east: 54.625, west: 54.605 } },
  { id: 'al-raha-beach', name: 'Al Raha Beach', nameAr: 'شاطئ الراحة', emoji: '🏖️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.525, south: 24.505, east: 54.655, west: 54.635 } },
  { id: 'al-raha-gardens', name: 'Al Raha Gardens', nameAr: 'حدائق الراحة', emoji: '🌳', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.520, south: 24.500, east: 54.670, west: 54.650 } },
  { id: 'masdar-city', name: 'Masdar City', nameAr: 'مدينة مصدر', emoji: '🌱', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.435, south: 24.415, east: 54.625, west: 54.605 } },
  { id: 'al-shamkha', name: 'Al Shamkha', nameAr: 'الشامخة', emoji: '🏘️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.455, south: 24.425, east: 54.700, west: 54.670 } },
  { id: 'baniyas', name: 'Baniyas', nameAr: 'بني ياس', emoji: '🏠', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.515, south: 24.495, east: 54.455, west: 54.435 } },
  { id: 'mussafah', name: 'Mussafah', nameAr: 'مصفح', emoji: '🏭', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.385, south: 24.345, east: 54.525, west: 54.485 } },
  { id: 'al-ain-road', name: 'Al Ain Road', nameAr: 'طريق العين', emoji: '🛣️', city: 'Abu Dhabi', country: 'AE', bounds: { north: 24.430, south: 24.410, east: 54.650, west: 54.630 } },
];

const SHARJAH_AREAS: Area[] = [
  { id: 'al-majaz', name: 'Al Majaz', nameAr: 'المجاز', emoji: '⛲', city: 'Sharjah', country: 'AE', bounds: { north: 25.335, south: 25.325, east: 55.390, west: 55.380 } },
  { id: 'al-nahda-sharjah', name: 'Al Nahda', nameAr: 'النهدة', emoji: '🏘️', city: 'Sharjah', country: 'AE', bounds: { north: 25.300, south: 25.290, east: 55.375, west: 55.365 } },
  { id: 'al-qasimia', name: 'Al Qasimia', nameAr: 'القاسمية', emoji: '🕌', city: 'Sharjah', country: 'AE', bounds: { north: 25.345, south: 25.335, east: 55.395, west: 55.385 } },
  { id: 'al-taawun', name: 'Al Taawun', nameAr: 'التعاون', emoji: '🏢', city: 'Sharjah', country: 'AE', bounds: { north: 25.325, south: 25.315, east: 55.385, west: 55.375 } },
  { id: 'al-khan', name: 'Al Khan', nameAr: 'الخان', emoji: '🏖️', city: 'Sharjah', country: 'AE', bounds: { north: 25.330, south: 25.320, east: 55.380, west: 55.370 } },
  { id: 'al-mamzar-sharjah', name: 'Al Mamzar', nameAr: 'الممزر', emoji: '🏖️', city: 'Sharjah', country: 'AE', bounds: { north: 25.315, south: 25.305, east: 55.365, west: 55.355 } },
  { id: 'muwaileh', name: 'Muwaileh', nameAr: 'مويلح', emoji: '🏘️', city: 'Sharjah', country: 'AE', bounds: { north: 25.290, south: 25.270, east: 55.445, west: 55.425 } },
  { id: 'al-zahia', name: 'Al Zahia', nameAr: 'الزاهية', emoji: '🏡', city: 'Sharjah', country: 'AE', bounds: { north: 25.295, south: 25.275, east: 55.475, west: 55.455 } },
  { id: 'tilal-city', name: 'Tilal City', nameAr: 'مدينة التلال', emoji: '🏘️', city: 'Sharjah', country: 'AE', bounds: { north: 25.275, south: 25.255, east: 55.485, west: 55.465 } },
  { id: 'university-city', name: 'University City', nameAr: 'المدينة الجامعية', emoji: '🎓', city: 'Sharjah', country: 'AE', bounds: { north: 25.305, south: 25.285, east: 55.505, west: 55.485 } },
];

const AJMAN_AREAS: Area[] = [
  { id: 'al-nuaimiya', name: 'Al Nuaimiya', nameAr: 'النعيمية', emoji: '🏘️', city: 'Ajman', country: 'AE', bounds: { north: 25.405, south: 25.385, east: 55.455, west: 55.435 } },
  { id: 'al-rashidiya-ajman', name: 'Al Rashidiya', nameAr: 'الراشدية', emoji: '🏠', city: 'Ajman', country: 'AE', bounds: { north: 25.415, south: 25.395, east: 55.445, west: 55.425 } },
  { id: 'al-bustan-ajman', name: 'Al Bustan', nameAr: 'البستان', emoji: '🌳', city: 'Ajman', country: 'AE', bounds: { north: 25.425, south: 25.405, east: 55.465, west: 55.445 } },
  { id: 'ajman-corniche', name: 'Ajman Corniche', nameAr: 'كورنيش عجمان', emoji: '🌊', city: 'Ajman', country: 'AE', bounds: { north: 25.410, south: 25.400, east: 55.430, west: 55.420 } },
  { id: 'ajman-uptown', name: 'Ajman Uptown', nameAr: 'أبتاون عجمان', emoji: '🏢', city: 'Ajman', country: 'AE', bounds: { north: 25.430, south: 25.410, east: 55.475, west: 55.455 } },
];

const RAK_AREAS: Area[] = [
  { id: 'rak-city', name: 'RAK City', nameAr: 'مدينة رأس الخيمة', emoji: '🏙️', city: 'Ras Al Khaimah', country: 'AE', bounds: { north: 25.800, south: 25.780, east: 55.955, west: 55.935 } },
  { id: 'al-nakheel-rak', name: 'Al Nakheel', nameAr: 'النخيل', emoji: '🌴', city: 'Ras Al Khaimah', country: 'AE', bounds: { north: 25.795, south: 25.775, east: 55.945, west: 55.925 } },
  { id: 'al-hamra-village', name: 'Al Hamra Village', nameAr: 'قرية الحمراء', emoji: '⛳', city: 'Ras Al Khaimah', country: 'AE', bounds: { north: 25.690, south: 25.670, east: 55.805, west: 55.785 } },
  { id: 'mina-al-arab', name: 'Mina Al Arab', nameAr: 'ميناء العرب', emoji: '⛵', city: 'Ras Al Khaimah', country: 'AE', bounds: { north: 25.685, south: 25.665, east: 55.795, west: 55.775 } },
];

const FUJAIRAH_AREAS: Area[] = [
  { id: 'fujairah-city', name: 'Fujairah City', nameAr: 'مدينة الفجيرة', emoji: '🏙️', city: 'Fujairah', country: 'AE', bounds: { north: 25.135, south: 25.115, east: 56.345, west: 56.325 } },
  { id: 'dibba-fujairah', name: 'Dibba', nameAr: 'دبا', emoji: '🏖️', city: 'Fujairah', country: 'AE', bounds: { north: 25.620, south: 25.600, east: 56.280, west: 56.260 } },
  { id: 'khor-fakkan', name: 'Khor Fakkan', nameAr: 'خور فكان', emoji: '⛵', city: 'Fujairah', country: 'AE', bounds: { north: 25.345, south: 25.325, east: 56.365, west: 56.345 } },
];

const UAQ_AREAS: Area[] = [
  { id: 'uaq-old-town', name: 'UAQ Old Town', nameAr: 'المدينة القديمة', emoji: '🏛️', city: 'Umm Al Quwain', country: 'AE', bounds: { north: 25.570, south: 25.550, east: 55.560, west: 55.540 } },
  { id: 'uaq-marina', name: 'UAQ Marina', nameAr: 'مارينا أم القيوين', emoji: '⛵', city: 'Umm Al Quwain', country: 'AE', bounds: { north: 25.565, south: 25.545, east: 55.570, west: 55.550 } },
];

const AL_AIN_AREAS: Area[] = [
  { id: 'al-ain-city', name: 'Al Ain City', nameAr: 'مدينة العين', emoji: '🌴', city: 'Al Ain', country: 'AE', bounds: { north: 24.235, south: 24.195, east: 55.780, west: 55.740 } },
  { id: 'buraimi', name: 'Al Buraimi', nameAr: 'البريمي', emoji: '🕌', city: 'Al Ain', country: 'AE', bounds: { north: 24.265, south: 24.245, east: 55.795, west: 55.775 } },
  { id: 'al-ain-zoo', name: 'Al Ain Zoo Area', nameAr: 'منطقة حديقة الحيوان', emoji: '🦁', city: 'Al Ain', country: 'AE', bounds: { north: 24.195, south: 24.175, east: 55.755, west: 55.735 } },
  { id: 'jebel-hafeet', name: 'Jebel Hafeet', nameAr: 'جبل حفيت', emoji: '⛰️', city: 'Al Ain', country: 'AE', bounds: { north: 24.095, south: 24.055, east: 55.815, west: 55.775 } },
];

// ==================== SAUDI ARABIA AREAS ====================

const RIYADH_AREAS: Area[] = [
  // Central Riyadh
  { id: 'olaya', name: 'Olaya', nameAr: 'العليا', emoji: '🏢', city: 'Riyadh', country: 'SA', bounds: { north: 24.715, south: 24.695, east: 46.690, west: 46.670 } },
  { id: 'king-fahd', name: 'King Fahd District', nameAr: 'حي الملك فهد', emoji: '👑', city: 'Riyadh', country: 'SA', bounds: { north: 24.735, south: 24.715, east: 46.710, west: 46.690 } },
  { id: 'al-malaz', name: 'Al Malaz', nameAr: 'الملز', emoji: '🏛️', city: 'Riyadh', country: 'SA', bounds: { north: 24.705, south: 24.685, east: 46.735, west: 46.715 } },
  { id: 'al-murabba', name: 'Al Murabba', nameAr: 'المربع', emoji: '🕌', city: 'Riyadh', country: 'SA', bounds: { north: 24.695, south: 24.675, east: 46.715, west: 46.695 } },

  // North Riyadh
  { id: 'al-nakheel-riyadh', name: 'Al Nakheel', nameAr: 'النخيل', emoji: '🌴', city: 'Riyadh', country: 'SA', bounds: { north: 24.780, south: 24.760, east: 46.700, west: 46.680 } },
  { id: 'hittin', name: 'Hittin', nameAr: 'حطين', emoji: '🏘️', city: 'Riyadh', country: 'SA', bounds: { north: 24.800, south: 24.780, east: 46.630, west: 46.610 } },
  { id: 'al-aqiq', name: 'Al Aqiq', nameAr: 'العقيق', emoji: '🏡', city: 'Riyadh', country: 'SA', bounds: { north: 24.790, south: 24.770, east: 46.650, west: 46.630 } },
  { id: 'yasmin', name: 'Al Yasmin', nameAr: 'الياسمين', emoji: '🌸', city: 'Riyadh', country: 'SA', bounds: { north: 24.820, south: 24.800, east: 46.680, west: 46.660 } },

  // East Riyadh
  { id: 'al-naseem', name: 'Al Naseem', nameAr: 'النسيم', emoji: '🏘️', city: 'Riyadh', country: 'SA', bounds: { north: 24.750, south: 24.730, east: 46.780, west: 46.760 } },
  { id: 'al-rawabi', name: 'Al Rawabi', nameAr: 'الروابي', emoji: '🏠', city: 'Riyadh', country: 'SA', bounds: { north: 24.735, south: 24.715, east: 46.760, west: 46.740 } },

  // West Riyadh
  { id: 'diriyah', name: 'Diriyah', nameAr: 'الدرعية', emoji: '🏛️', city: 'Riyadh', country: 'SA', bounds: { north: 24.750, south: 24.730, east: 46.560, west: 46.540 } },
  { id: 'laban', name: 'Laban', nameAr: 'لبن', emoji: '🏘️', city: 'Riyadh', country: 'SA', bounds: { north: 24.720, south: 24.700, east: 46.580, west: 46.560 } },

  // South Riyadh
  { id: 'al-shifa', name: 'Al Shifa', nameAr: 'الشفا', emoji: '🏘️', city: 'Riyadh', country: 'SA', bounds: { north: 24.620, south: 24.600, east: 46.700, west: 46.680 } },
];

// ==================== JEDDAH ====================

const JEDDAH_AREAS: Area[] = [
  { id: 'al-hamra-jeddah', name: 'Al Hamra', nameAr: 'الحمراء', emoji: '🌊', city: 'Jeddah', country: 'SA', bounds: { north: 21.545, south: 21.525, east: 39.160, west: 39.140 } },
  { id: 'al-rawdah-jeddah', name: 'Al Rawdah', nameAr: 'الروضة', emoji: '🏘️', city: 'Jeddah', country: 'SA', bounds: { north: 21.560, south: 21.540, east: 39.180, west: 39.160 } },
  { id: 'al-salamah', name: 'Al Salamah', nameAr: 'السلامة', emoji: '🏢', city: 'Jeddah', country: 'SA', bounds: { north: 21.580, south: 21.560, east: 39.170, west: 39.150 } },
  { id: 'al-naeem', name: 'Al Naeem', nameAr: 'النعيم', emoji: '🏡', city: 'Jeddah', country: 'SA', bounds: { north: 21.600, south: 21.580, east: 39.190, west: 39.170 } },
  { id: 'corniche-jeddah', name: 'Jeddah Corniche', nameAr: 'كورنيش جدة', emoji: '🌴', city: 'Jeddah', country: 'SA', bounds: { north: 21.620, south: 21.600, east: 39.130, west: 39.110 } },
  { id: 'al-andalus', name: 'Al Andalus', nameAr: 'الأندلس', emoji: '🏘️', city: 'Jeddah', country: 'SA', bounds: { north: 21.555, south: 21.535, east: 39.175, west: 39.155 } },
];

// ==================== EASTERN PROVINCE ====================

const DAMMAM_AREAS: Area[] = [
  { id: 'dammam-city', name: 'Dammam City', nameAr: 'مدينة الدمام', emoji: '🏙️', city: 'Dammam', country: 'SA', bounds: { north: 26.450, south: 26.400, east: 50.120, west: 50.080 } },
  { id: 'al-faisaliyah-dammam', name: 'Al Faisaliyah', nameAr: 'الفيصلية', emoji: '🏘️', city: 'Dammam', country: 'SA', bounds: { north: 26.420, south: 26.400, east: 50.110, west: 50.090 } },
];

const KHOBAR_AREAS: Area[] = [
  { id: 'al-khobar-city', name: 'Al Khobar', nameAr: 'الخبر', emoji: '🌊', city: 'Khobar', country: 'SA', bounds: { north: 26.320, south: 26.280, east: 50.230, west: 50.190 } },
  { id: 'al-ulaia-khobar', name: 'Al Ulaya', nameAr: 'العليا', emoji: '🏢', city: 'Khobar', country: 'SA', bounds: { north: 26.310, south: 26.290, east: 50.210, west: 50.190 } },
];

// ==================== EXPORT ALL ====================

export const ALL_AREAS: Area[] = [
  ...DUBAI_AREAS,
  ...ABU_DHABI_AREAS,
  ...SHARJAH_AREAS,
  ...AJMAN_AREAS,
  ...RAK_AREAS,
  ...FUJAIRAH_AREAS,
  ...UAQ_AREAS,
  ...AL_AIN_AREAS,
  ...RIYADH_AREAS,
  ...JEDDAH_AREAS,
  ...DAMMAM_AREAS,
  ...KHOBAR_AREAS,
];
