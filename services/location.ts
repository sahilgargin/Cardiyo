import * as Location from 'expo-location';
import { getAreaFromCoordinates, Area } from './areas';

export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  area?: Area;
}

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
}

export async function getUserLocation(): Promise<UserLocation | null> {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;

    const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    const place = geocode[0];
    
    // Get area from database
    const area = await getAreaFromCoordinates(latitude, longitude);

    return {
      latitude,
      longitude,
      city: place?.city || place?.subregion || 'Dubai',
      country: place?.country || 'UAE',
      area,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}
