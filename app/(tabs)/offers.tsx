import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../firebaseConfig';
import { getUserLocation, UserLocation } from '../../services/location';
import { getOffersByLocation, Offer } from '../../services/offers';
import { getAppBranding, AppBranding, getAllCategories, CategoryBranding } from '../../services/branding';

export default function OffersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryParam = params.category as string | undefined;

  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [categories, setCategories] = useState<CategoryBranding[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [filter, setFilter] = useState<'all' | 'online'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam || null);

  const isGuest = !auth.currentUser;

  useEffect(() => {
    console.log('=== OFFERS SCREEN: Initial Load ===');
    loadData();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      console.log('Category param changed:', categoryParam);
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    console.log('Selected category changed:', selectedCategory);
    if (branding) {
      loadOffers();
    }
  }, [selectedCategory]);

  async function loadData() {
    try {
      console.log('Loading branding...');
      const app = await getAppBranding();
      setBranding(app);
      console.log('Branding loaded:', app ? 'Success' : 'Failed');

      console.log('Loading categories...');
      const cats = await getAllCategories();
      setCategories(cats);
      console.log('Categories loaded:', cats.length);

      console.log('Getting user location...');
      const loc = await getUserLocation();
      console.log('Location:', loc);
      setLocation(loc);

      await loadOffers(loc);
    } catch (error) {
      console.error('Error in loadData:', error);
      setLoading(false);
    }
  }

  async function loadOffers(userLocation?: UserLocation | null) {
    console.log('=== Loading Offers ===');
    const loc = userLocation !== undefined ? userLocation : location;
    console.log('Location to use:', loc);
    console.log('Selected category:', selectedCategory);
    
    setLoading(true);
    try {
      // For now, just load all location-based offers with large radius
      const allOffers = await getOffersByLocation(
        loc?.latitude || 25.2048, // Default to Dubai
        loc?.longitude || 55.2708,
        500, // 500km radius
        selectedCategory || undefined
      );
      
      console.log('Offers loaded:', allOffers.length);
      setOffers(allOffers);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadOffers();
    setRefreshing(false);
  }

  function handleCategorySelect(categoryId: string | null) {
    console.log('Category selected:', categoryId);
    setSelectedCategory(categoryId);
  }

  function renderOffer(offer: Offer) {
    const filteredOut = filter === 'online' && offer.type !== 'online';
    if (filteredOut) return null;

    return (
      <TouchableOpacity 
        key={offer.id} 
        style={styles.offerCard}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={offer.gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.offerGradient}
        >
          <View style={styles.offerHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryEmoji}>{offer.categoryEmoji}</Text>
              <Text style={styles.categoryName}>{offer.category}</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{offer.discount}</Text>
            </View>
          </View>

          <View style={styles.offerContent}>
            <Text style={styles.offerTitle} numberOfLines={2}>
              {offer.title}
            </Text>
            <Text style={styles.offerDescription} numberOfLines={2}>
              {offer.description}
            </Text>
          </View>

          <View style={styles.offerFooter}>
            <View style={styles.merchantInfo}>
              <View style={styles.merchantIcon}>
                <Ionicons name="business" size={14} color="#060612" />
              </View>
              <Text style={styles.merchantName} numberOfLines={1}>
                {offer.merchantName}
              </Text>
            </View>

            {offer.type === 'nearby' && offer.distance !== undefined && (
              <View style={styles.distanceBadge}>
                <Ionicons name="location" size={12} color="#060612" />
                <Text style={styles.distanceText}>
                  {offer.distance.toFixed(1)} km
                </Text>
              </View>
            )}

            {offer.type === 'online' && (
              <View style={styles.onlineBadge}>
                <Ionicons name="globe" size={12} color="#060612" />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (!branding) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#9BFF32" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
              Offers
            </Text>
            {location && (
              <View style={styles.locationInfo}>
                <Ionicons name="location" size={14} color={branding.success} />
                <Text style={[styles.locationText, { color: branding.success }]}>
                  {location.city}
                </Text>
              </View>
            )}
          </View>

          {offers.length > 0 && (
            <View style={styles.offerCount}>
              <Text style={[styles.offerCountText, { color: branding.textPrimary }]}>
                {offers.filter(o => filter === 'all' || o.type === 'online').length}
              </Text>
            </View>
          )}
        </View>

        {isGuest && (
          <TouchableOpacity
            style={styles.loginBanner}
            onPress={() => router.push('/auth/welcome')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={branding.primaryGradient.colors as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginBannerGradient}
            >
              <View style={styles.loginBannerContent}>
                <View style={styles.loginIcon}>
                  <Ionicons name="star" size={20} color="#060612" />
                </View>
                <View style={styles.loginText}>
                  <Text style={styles.loginTitle}>Get Personalized Offers</Text>
                  <Text style={styles.loginSubtitle}>Login to see card-specific deals</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#060612" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilterContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryFilterChip,
              { backgroundColor: branding.surfaceColor },
              selectedCategory === null && styles.categoryFilterChipActive,
            ]}
            onPress={() => handleCategorySelect(null)}
          >
            {selectedCategory === null && (
              <LinearGradient
                colors={branding.primaryGradient.colors as [string, string]}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text style={[
              styles.categoryFilterText,
              { color: selectedCategory === null ? '#060612' : branding.textSecondary }
            ]}>
              All
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryFilterChip,
                { backgroundColor: branding.surfaceColor },
                selectedCategory === category.id && styles.categoryFilterChipActive,
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              {selectedCategory === category.id && (
                <LinearGradient
                  colors={branding.primaryGradient.colors as [string, string]}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={styles.categoryFilterEmoji}>{category.emoji}</Text>
              <Text style={[
                styles.categoryFilterText,
                { color: selectedCategory === category.id ? '#060612' : branding.textSecondary }
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              { backgroundColor: branding.surfaceColor },
              filter === 'all' && styles.filterChipActive,
            ]}
            onPress={() => setFilter('all')}
          >
            {filter === 'all' && (
              <LinearGradient
                colors={branding.primaryGradient.colors as [string, string]}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text style={[
              styles.filterText,
              { color: filter === 'all' ? '#060612' : branding.textSecondary }
            ]}>
              All Offers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              { backgroundColor: branding.surfaceColor },
              filter === 'online' && styles.filterChipActive,
            ]}
            onPress={() => setFilter('online')}
          >
            {filter === 'online' && (
              <LinearGradient
                colors={branding.primaryGradient.colors as [string, string]}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Ionicons 
              name="globe" 
              size={14} 
              color={filter === 'online' ? '#060612' : branding.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text style={[
              styles.filterText,
              { color: filter === 'online' ? '#060612' : branding.textSecondary }
            ]}>
              Online Only
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={branding.success}
          />
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={branding.success} />
            <Text style={[styles.loadingText, { color: branding.textSecondary }]}>
              Finding offers...
            </Text>
          </View>
        ) : offers.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <LinearGradient
                colors={['rgba(155, 255, 50, 0.1)', 'rgba(61, 238, 255, 0.1)']}
                style={styles.emptyIconGradient}
              >
                <Ionicons name="pricetag-outline" size={48} color={branding.success} />
              </LinearGradient>
            </View>
            <Text style={[styles.emptyTitle, { color: branding.textPrimary }]}>
              No Offers Available
            </Text>
            <Text style={[styles.emptySubtitle, { color: branding.textSecondary }]}>
              Check your terminal for debug logs
            </Text>
          </View>
        ) : (
          <View style={styles.offersGrid}>
            {offers.map(renderOffer)}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  loadingText: { marginTop: 12, fontSize: 14 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  locationInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 14, fontWeight: '600' },
  offerCount: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  offerCountText: { fontSize: 18, fontWeight: 'bold' },
  loginBanner: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  loginBannerGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  loginBannerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  loginIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(6, 6, 18, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  loginText: { flex: 1 },
  loginTitle: { fontSize: 15, fontWeight: 'bold', color: '#060612', marginBottom: 2 },
  loginSubtitle: { fontSize: 12, color: 'rgba(6, 6, 18, 0.7)' },
  categoryFilterContainer: { marginBottom: 16, marginHorizontal: -24, paddingHorizontal: 24 },
  categoryFilterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 12, overflow: 'hidden' },
  categoryFilterChipActive: { borderWidth: 0 },
  categoryFilterEmoji: { fontSize: 16, marginRight: 6 },
  categoryFilterText: { fontSize: 14, fontWeight: '600' },
  filterContainer: { flexDirection: 'row', gap: 12 },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, overflow: 'hidden' },
  filterChipActive: { borderWidth: 0 },
  filterText: { fontSize: 14, fontWeight: '600' },
  content: { paddingHorizontal: 24 },
  offersGrid: { gap: 16 },
  offerCard: { borderRadius: 20, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  offerGradient: { padding: 20 },
  offerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(6, 6, 18, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  categoryEmoji: { fontSize: 16 },
  categoryName: { fontSize: 12, fontWeight: '600', color: '#060612', textTransform: 'capitalize' },
  discountBadge: { backgroundColor: 'rgba(6, 6, 18, 0.2)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16 },
  discountText: { fontSize: 14, fontWeight: 'bold', color: '#060612' },
  offerContent: { marginBottom: 16 },
  offerTitle: { fontSize: 20, fontWeight: 'bold', color: '#060612', marginBottom: 8 },
  offerDescription: { fontSize: 14, color: 'rgba(6, 6, 18, 0.7)', lineHeight: 20 },
  offerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(6, 6, 18, 0.1)' },
  merchantInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 },
  merchantIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(6, 6, 18, 0.1)', justifyContent: 'center', alignItems: 'center' },
  merchantName: { fontSize: 13, fontWeight: '600', color: 'rgba(6, 6, 18, 0.8)', flex: 1 },
  distanceBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(6, 6, 18, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  distanceText: { fontSize: 12, fontWeight: '600', color: '#060612' },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(6, 6, 18, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  onlineText: { fontSize: 12, fontWeight: '600', color: '#060612' },
  emptyState: { alignItems: 'center', paddingVertical: 80 },
  emptyIcon: { marginBottom: 24 },
  emptyIconGradient: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { fontSize: 16, textAlign: 'center', paddingHorizontal: 40 },
});
