import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

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

let cachedAreas: Area[] = [];

export async function getAllAreas(): Promise<Area[]> {
  if (cachedAreas.length > 0) {
    return cachedAreas;
  }
  
  try {
    const areasSnapshot = await getDocs(collection(db, 'areas'));
    cachedAreas = areasSnapshot.docs
      .filter(doc => {
        const data = doc.data();
        // Skip placeholder documents
        return !data._placeholder && data.bounds && data.name;
      })
      .map(doc => {
        const data = doc.data();
        return {
          id: data.id || doc.id,
          name: data.name,
          nameAr: data.nameAr,
          emoji: data.emoji,
          city: data.city,
          country: data.country,
          bounds: {
            north: data.bounds.north,
            south: data.bounds.south,
            east: data.bounds.east,
            west: data.bounds.west,
          }
        } as Area;
      });
    
    console.log(`✅ Loaded ${cachedAreas.length} areas from database`);
    return cachedAreas;
  } catch (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
}

export async function getAreaFromCoordinates(latitude: number, longitude: number): Promise<Area | null> {
  try {
    const areas = await getAllAreas();
    
    if (areas.length === 0) {
      console.log('No areas loaded from database');
      return null;
    }
    
    for (const area of areas) {
      if (
        latitude <= area.bounds.north &&
        latitude >= area.bounds.south &&
        longitude <= area.bounds.east &&
        longitude >= area.bounds.west
      ) {
        return area;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in getAreaFromCoordinates:', error);
    return null;
  }
}

export async function getNearbyAreas(latitude: number, longitude: number, radiusKm: number = 5): Promise<Area[]> {
  const areas = await getAllAreas();
  const nearbyAreas: Area[] = [];
  
  for (const area of areas) {
    const centerLat = (area.bounds.north + area.bounds.south) / 2;
    const centerLng = (area.bounds.east + area.bounds.west) / 2;
    const distance = calculateDistance(latitude, longitude, centerLat, centerLng);
    
    if (distance <= radiusKm) {
      nearbyAreas.push(area);
    }
  }
  
  return nearbyAreas.sort((a, b) => {
    const distA = calculateDistance(latitude, longitude, (a.bounds.north + a.bounds.south) / 2, (a.bounds.east + a.bounds.west) / 2);
    const distB = calculateDistance(latitude, longitude, (b.bounds.north + b.bounds.south) / 2, (b.bounds.east + b.bounds.west) / 2);
    return distA - distB;
  });
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
