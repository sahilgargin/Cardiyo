import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getAppBranding, AppBranding } from '../../services/branding';
import { getUserProfile } from '../../services/auth';
import { detectUserArea } from '../../services/location';

export default function HomeScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [userName, setUserName] = useState('');
  const [userArea, setUserArea] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    const profile = await getUserProfile();
    if (profile?.firstName) {
      setUserName(profile.firstName);
    }

    const area = await detectUserArea();
    setUserArea(area);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  if (!branding) {
    return <View style={styles.loading}><Text>Loading...</Text></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: branding.textSecondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.name, { color: branding.textPrimary }]}>
            {userName || 'User'}
          </Text>
          {userArea && (
            <TouchableOpacity 
              style={styles.locationContainer}
              onPress={() => router.push('/select-area')}
            >
              <Ionicons name="location" size={14} color={branding.primaryColor} />
              <Text style={[styles.location, { color: branding.textSecondary }]}>
                {userArea}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={branding.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.notificationButton, { backgroundColor: branding.surfaceColor }]}
          onPress={() => {}}
        >
          <Ionicons name="notifications" size={24} color={branding.textPrimary} />
          <View style={[styles.badge, { backgroundColor: branding.error }]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={branding.success} />}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
            Quick Actions
          </Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: branding.surfaceColor }]}
              onPress={() => router.push('/add-card/select-bank')}
            >
              <View style={[styles.actionIcon, { backgroundColor: branding.primaryColor + '20' }]}>
                <Ionicons name="add" size={24} color={branding.primaryColor} />
              </View>
              <Text style={[styles.actionText, { color: branding.textPrimary }]}>
                Add Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: branding.surfaceColor }]}
              onPress={() => router.push('/add-transaction')}
            >
              <View style={[styles.actionIcon, { backgroundColor: branding.secondaryColor + '20' }]}>
                <Ionicons name="receipt" size={24} color={branding.secondaryColor} />
              </View>
              <Text style={[styles.actionText, { color: branding.textPrimary }]}>
                Add Transaction
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: branding.surfaceColor }]}
              onPress={() => router.push('/analytics')}
            >
              <View style={[styles.actionIcon, { backgroundColor: branding.warning + '20' }]}>
                <Ionicons name="stats-chart" size={24} color={branding.warning} />
              </View>
              <Text style={[styles.actionText, { color: branding.textPrimary }]}>
                Analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: branding.surfaceColor }]}
              onPress={() => router.push('/(tabs)/offers')}
            >
              <View style={[styles.actionIcon, { backgroundColor: branding.error + '20' }]}>
                <Ionicons name="pricetag" size={24} color={branding.error} />
              </View>
              <Text style={[styles.actionText, { color: branding.textPrimary }]}>
                Offers
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {userArea && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
                Offers in {userArea}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/offers')}>
                <Text style={[styles.seeAll, { color: branding.primaryColor }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.featuredCard, { backgroundColor: branding.surfaceColor }]}
              onPress={() => router.push('/(tabs)/offers')}
            >
              <LinearGradient
                colors={branding.primaryGradient.colors as [string, string]}
                start={branding.primaryGradient.start}
                end={branding.primaryGradient.end}
                style={styles.featuredGradient}
              >
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredTitle}>
                    20% Off Dining
                  </Text>
                  <Text style={styles.featuredSubtitle}>
                    At participating restaurants in {userArea}
                  </Text>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>
                      This Weekend
                    </Text>
                  </View>
                </View>
                <Ionicons name="restaurant" size={48} color="rgba(255,255,255,0.3)" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  greeting: { fontSize: 14, marginBottom: 4 },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontSize: 12 },
  notificationButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  badge: { position: 'absolute', top: 8, right: 8, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#060612' },
  content: { padding: 24, paddingTop: 0 },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '48%', padding: 20, borderRadius: 16, alignItems: 'center' },
  actionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  featuredCard: { borderRadius: 20, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  featuredGradient: { padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  featuredContent: { flex: 1 },
  featuredTitle: { fontSize: 24, fontWeight: 'bold', color: '#060612', marginBottom: 4 },
  featuredSubtitle: { fontSize: 14, color: '#060612', marginBottom: 12, opacity: 0.8 },
  featuredBadge: { backgroundColor: 'rgba(6, 6, 18, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
  featuredBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#060612' },
});
