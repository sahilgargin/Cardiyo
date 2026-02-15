import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../firebaseConfig';
import { getUserLocation, UserLocation } from '../../services/location';
import { getAppBranding, getAllCategories, AppBranding, CategoryBranding } from '../../services/branding';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [categories, setCategories] = useState<CategoryBranding[]>([]);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [greeting, setGreeting] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBranding();
    setGreetingMessage();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setGreetingMessage();
    }, [])
  );

  function setGreetingMessage() {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }

  async function loadBranding() {
    const app = await getAppBranding();
    const cats = await getAllCategories();
    const loc = await getUserLocation();
    
    setBranding(app);
    setCategories(cats);
    setLocation(loc);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadBranding();
    setRefreshing(false);
  }

  function handleCategoryPress(categoryId: string) {
    router.push({
      pathname: '/(tabs)/offers',
      params: { category: categoryId }
    });
  }

  function getFirstName() {
    if (!auth.currentUser) return 'Guest';
    
    const displayName = auth.currentUser.displayName;
    if (displayName) {
      return displayName.split(' ')[0];
    }
    
    const email = auth.currentUser.email;
    if (email) {
      return email.split('@')[0];
    }
    
    return 'User';
  }

  if (!branding) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#9BFF32' }}>Loading...</Text>
      </View>
    );
  }

  const isGuest = !auth.currentUser;
  const firstName = getFirstName();

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={branding.success}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: branding.textSecondary }]}>
                {greeting} 👋
              </Text>
              <Text style={[styles.userName, { color: branding.textPrimary }]}>
                {firstName}
              </Text>
            </View>
            
            {location?.area && (
              <View style={styles.locationBadge}>
                <LinearGradient
                  colors={['rgba(155, 255, 50, 0.1)', 'rgba(61, 238, 255, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.locationGradient}
                >
                  <Text style={[styles.locationText, { color: branding.success }]}>
                    {location.area.name}
                  </Text>
                </LinearGradient>
              </View>
            )}
          </View>

          {isGuest && (
            <TouchableOpacity
              style={styles.guestBanner}
              onPress={() => router.push('/auth/welcome')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={branding.primaryGradient.colors as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.guestBannerGradient}
              >
                <View style={styles.guestBannerContent}>
                  <View style={styles.guestIcon}>
                    <Ionicons name="log-in" size={24} color="#060612" />
                  </View>
                  <View style={styles.guestText}>
                    <Text style={styles.guestTitle}>Login for More</Text>
                    <Text style={styles.guestSubtitle}>
                      Get personalized card offers
                    </Text>
                  </View>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#060612" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
              Categories
            </Text>
            <Text style={[styles.sectionCount, { color: branding.textSecondary }]}>
              {categories.length}
            </Text>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { width: CARD_WIDTH }]}
                activeOpacity={0.8}
                onPress={() => handleCategoryPress(category.id)}
              >
                <LinearGradient
                  colors={category.gradient.colors as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryGradient}
                >
                  <View style={styles.categoryIcon}>
                    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>
                    Tap to explore
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
            Quick Actions
          </Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/offers')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(155, 255, 50, 0.1)' }]}>
                <Ionicons name="pricetag" size={24} color="#9BFF32" />
              </View>
              <Text style={[styles.actionTitle, { color: branding.textPrimary }]}>
                Browse Offers
              </Text>
              <Text style={[styles.actionSubtitle, { color: branding.textSecondary }]}>
                Nearby & Online
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/wallet')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(61, 238, 255, 0.1)' }]}>
                <Ionicons name="wallet" size={24} color="#3DEEFF" />
              </View>
              <Text style={[styles.actionTitle, { color: branding.textPrimary }]}>
                My Cards
              </Text>
              <Text style={[styles.actionSubtitle, { color: branding.textSecondary }]}>
                Manage wallet
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#060612' },
  header: { paddingTop: 60, paddingHorizontal: 24, marginBottom: 32 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 14, marginBottom: 4 },
  userName: { fontSize: 28, fontWeight: 'bold' },
  locationBadge: { borderRadius: 12, overflow: 'hidden' },
  locationGradient: { paddingHorizontal: 12, paddingVertical: 8 },
  locationText: { fontSize: 13, fontWeight: '600' },
  guestBanner: { borderRadius: 16, overflow: 'hidden' },
  guestBannerGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  guestBannerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  guestIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(6, 6, 18, 0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  guestText: { flex: 1 },
  guestTitle: { fontSize: 16, fontWeight: 'bold', color: '#060612', marginBottom: 2 },
  guestSubtitle: { fontSize: 13, color: 'rgba(6, 6, 18, 0.7)' },
  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold' },
  sectionCount: { fontSize: 14, fontWeight: '600' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  categoryCard: { borderRadius: 20, overflow: 'hidden' },
  categoryGradient: { padding: 20, minHeight: 160, justifyContent: 'space-between' },
  categoryIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(6, 6, 18, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  categoryEmoji: { fontSize: 28 },
  categoryName: { fontSize: 17, fontWeight: 'bold', color: '#060612', marginBottom: 4 },
  categoryCount: { fontSize: 13, color: 'rgba(6, 6, 18, 0.7)', fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', gap: 16 },
  actionCard: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 16, padding: 20 },
  actionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  actionSubtitle: { fontSize: 13 },
});
