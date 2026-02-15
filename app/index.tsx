import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth/welcome');
        }
        setChecking(false);
      }, 1500); // Show splash for 1.5s
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={['#9BFF32', '#3DEEFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoCircle}
        >
          <Text style={styles.logoLetter}>C</Text>
        </LinearGradient>
        <Text style={styles.logoText}>CARDIYO</Text>
        <View style={styles.divider} />
      </View>

      <Text style={styles.tagline}>Smart cards, smarter offers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 12,
    shadowColor: '#9BFF32',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  logoLetter: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#060612',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F9F9F9',
    letterSpacing: 4,
    marginBottom: 8,
  },
  divider: {
    width: 200,
    height: 4,
    backgroundColor: '#9BFF32',
    borderRadius: 2,
    transform: [{ skewX: '-10deg' }],
  },
  tagline: {
    fontSize: 16,
    color: '#888',
    marginTop: 32,
    fontStyle: 'italic',
  },
});
