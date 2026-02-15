import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getAppBranding, AppBranding } from '../../services/branding';

interface UserProfile {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);
    await loadProfile();
  }

  async function loadProfile() {
    const user = auth.currentUser;
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || user.email || '',
          phoneNumber: data.phoneNumber || user.phoneNumber || '',
          country: data.country || 'AE',
        });
      } else {
        // Fallback to auth data
        const displayName = user.displayName || '';
        const nameParts = displayName.split(' ');
        setProfile({
          firstName: nameParts[0] || 'User',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }

  async function handleLogout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut(auth);
            router.replace('/auth/welcome');
          },
        },
      ]
    );
  }

  if (!branding) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#9BFF32' }}>Loading...</Text>
      </View>
    );
  }

  const isGuest = !auth.currentUser;

  if (isGuest) {
    return (
      <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
        <LinearGradient
          colors={['#060612', '#0a0a1a', '#060612']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.guestContainer}>
          <View style={styles.guestIcon}>
            <LinearGradient
              colors={['rgba(155, 255, 50, 0.1)', 'rgba(61, 238, 255, 0.1)']}
              style={styles.guestIconGradient}
            >
              <Ionicons name="person-outline" size={64} color={branding.success} />
            </LinearGradient>
          </View>

          <Text style={[styles.guestTitle, { color: branding.textPrimary }]}>
            Login to Continue
          </Text>
          <Text style={[styles.guestSubtitle, { color: branding.textSecondary }]}>
            Access your cards, rewards, and personalized offers
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/welcome')}
          >
            <LinearGradient
              colors={branding.primaryGradient.colors as [string, string]}
              style={styles.loginButtonGradient}
            >
              <Ionicons name="log-in" size={24} color="#060612" />
              <Text style={styles.loginButtonText}>Login with Phone</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={branding.primaryGradient.colors as [string, string]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {profile?.firstName?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
          </View>

          <Text style={[styles.name, { color: branding.textPrimary }]}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          
          {profile?.phoneNumber && (
            <Text style={[styles.phone, { color: branding.textSecondary }]}>
              {profile.phoneNumber}
            </Text>
          )}
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
            Account Information
          </Text>

          {profile?.email && (
            <View style={[styles.infoCard, { backgroundColor: branding.surfaceColor }]}>
              <Ionicons name="mail" size={20} color={branding.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: branding.textSecondary }]}>
                  Email
                </Text>
                <Text style={[styles.infoValue, { color: branding.textPrimary }]}>
                  {profile.email}
                </Text>
              </View>
            </View>
          )}

          {profile?.phoneNumber && (
            <View style={[styles.infoCard, { backgroundColor: branding.surfaceColor }]}>
              <Ionicons name="call" size={20} color={branding.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: branding.textSecondary }]}>
                  Phone Number
                </Text>
                <Text style={[styles.infoValue, { color: branding.textPrimary }]}>
                  {profile.phoneNumber}
                </Text>
              </View>
            </View>
          )}

          {profile?.country && (
            <View style={[styles.infoCard, { backgroundColor: branding.surfaceColor }]}>
              <Ionicons name="location" size={20} color={branding.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: branding.textSecondary }]}>
                  Country
                </Text>
                <Text style={[styles.infoValue, { color: branding.textPrimary }]}>
                  {profile.country === 'AE' ? '🇦🇪 UAE' : '🇸🇦 Saudi Arabia'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
            Settings
          </Text>

          <TouchableOpacity
            style={[styles.settingCard, { backgroundColor: branding.surfaceColor }]}
            onPress={() => router.push('/auth/setup-profile')}
          >
            <Ionicons name="person" size={20} color={branding.textSecondary} />
            <Text style={[styles.settingText, { color: branding.textPrimary }]}>
              Edit Profile
            </Text>
            <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingCard, { backgroundColor: branding.surfaceColor }]}
          >
            <Ionicons name="notifications" size={20} color={branding.textSecondary} />
            <Text style={[styles.settingText, { color: branding.textPrimary }]}>
              Notifications
            </Text>
            <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingCard, { backgroundColor: branding.surfaceColor }]}
          >
            <Ionicons name="shield-checkmark" size={20} color={branding.textSecondary} />
            <Text style={[styles.settingText, { color: branding.textPrimary }]}>
              Privacy & Security
            </Text>
            <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingCard, { backgroundColor: branding.surfaceColor }]}
          >
            <Ionicons name="help-circle" size={20} color={branding.textSecondary} />
            <Text style={[styles.settingText, { color: branding.textPrimary }]}>
              Help & Support
            </Text>
            <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out" size={20} color="#060612" />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#060612' },
  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  guestIcon: { marginBottom: 32 },
  guestIconGradient: { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center' },
  guestTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  guestSubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  loginButton: { borderRadius: 16, overflow: 'hidden', width: '100%' },
  loginButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 12 },
  loginButtonText: { fontSize: 18, fontWeight: '600', color: '#060612' },
  header: { alignItems: 'center', paddingTop: 80, paddingBottom: 40, paddingHorizontal: 24 },
  avatarContainer: { marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#9BFF32', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#060612' },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  phone: { fontSize: 16 },
  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  infoCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12, gap: 16 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '600' },
  settingCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 12, marginBottom: 12, gap: 16 },
  settingText: { flex: 1, fontSize: 16, fontWeight: '500' },
  logoutButton: { borderRadius: 12, overflow: 'hidden' },
  logoutGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#060612' },
});
