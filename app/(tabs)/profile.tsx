import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAppBranding, AppBranding } from '../../services/branding';
import { getUserProfile, logout } from '../../services/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    const userProfile = await getUserProfile();
    setProfile(userProfile);
  }

  async function handleLogout() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/welcome');
          }
        }
      ]
    );
  }

  if (!branding) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
          Profile
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: branding.surfaceColor }]}>
          <View style={[styles.avatar, { backgroundColor: branding.primaryColor + '20' }]}>
            <Text style={[styles.avatarText, { color: branding.primaryColor }]}>
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </Text>
          </View>
          
          <Text style={[styles.name, { color: branding.textPrimary }]}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          
          <Text style={[styles.email, { color: branding.textSecondary }]}>
            {profile?.email}
          </Text>

          {profile?.phoneNumber && (
            <View style={styles.phoneContainer}>
              <Ionicons name="call" size={14} color={branding.textSecondary} />
              <Text style={[styles.phone, { color: branding.textSecondary }]}>
                {profile.phoneNumber}
              </Text>
            </View>
          )}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
            Settings
          </Text>

          {/* Gmail Sync */}
         <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: branding.surfaceColor }]}
            onPress={() => router.push('/email-settings')}
          >
            <View style={[styles.menuIcon, { backgroundColor: branding.secondaryColor + '20' }]}>
              <Ionicons name="mail" size={24} color={branding.secondaryColor} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuTitle, { color: branding.textPrimary }]}>
                Gmail Sync
              </Text>
              <Text style={[styles.menuSubtitle, { color: branding.textSecondary }]}>
                Auto-detect transactions from emails
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={branding.textSecondary} />
          </TouchableOpacity>

          {/* Analytics */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: branding.surfaceColor }]}
            onPress={() => router.push('/analytics')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#3DEEFF20' }]}>
              <Ionicons name="stats-chart" size={24} color="#3DEEFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: branding.textPrimary }]}>
                Analytics
              </Text>
              <Text style={[styles.menuSubtitle, { color: branding.textSecondary }]}>
                View spending insights
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: branding.surfaceColor }]}
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#FFD93D20' }]}>
              <Ionicons name="notifications" size={24} color="#FFD93D" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: branding.textPrimary }]}>
                Notifications
              </Text>
              <Text style={[styles.menuSubtitle, { color: branding.textSecondary }]}>
                Manage alerts and reminders
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
            Support
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: branding.surfaceColor }]}
            onPress={() => Alert.alert('Help', 'Contact support@cardiyo.app for assistance')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#9BFF3220' }]}>
              <Ionicons name="help-circle" size={24} color="#9BFF32" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: branding.textPrimary }]}>
                Help & Support
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: branding.surfaceColor }]}
            onPress={() => Alert.alert('About', 'Cardiyo v1.0.0\nSmart credit card tracking for UAE')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#3DEEFF20' }]}>
              <Ionicons name="information-circle" size={24} color="#3DEEFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: branding.textPrimary }]}>
                About
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <View style={[styles.logoutContent, { backgroundColor: branding.surfaceColor }]}>
            <Ionicons name="log-out" size={24} color="#FF6B6B" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  content: { paddingHorizontal: 24 },
  profileCard: { padding: 24, borderRadius: 20, alignItems: 'center', marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 14, marginBottom: 8 },
  phoneContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  phone: { fontSize: 14 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12 },
  menuIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  menuSubtitle: { fontSize: 13 },
  logoutButton: { marginTop: 8 },
  logoutContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 16, gap: 12 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#FF6B6B' },
});
