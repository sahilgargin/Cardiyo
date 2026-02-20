import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getAppBranding, AppBranding } from '../../services/branding';
import { getUserProfile, logout } from '../../services/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    const profile = await getUserProfile();
    setUser(profile);
  }

  async function handleGmailSync() {
    Alert.alert(
      'Gmail Sync',
      'Gmail sync requires a development build of the app. This feature is not available in Expo Go.\n\nTo enable Gmail sync:\n1. Build a development build with EAS\n2. Install on your device\n3. Connect Gmail and auto-sync transactions',
      [
        { text: 'OK' },
        {
          text: 'Learn More',
          onPress: () => Alert.alert('Coming Soon', 'Gmail sync will be available in the production build')
        }
      ]
    );
  }

  async function handleSignOut() {
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

  if (!branding) return null;

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: branding.surfaceColor }]}>
          <View style={[styles.avatar, { backgroundColor: branding.primaryColor + '20' }]}>
            <Text style={[styles.avatarText, { color: branding.primaryColor }]}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Text>
          </View>
          <Text style={[styles.userName, { color: branding.textPrimary }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.userEmail, { color: branding.textSecondary }]}>
            {user?.email}
          </Text>
          <Text style={[styles.userPhone, { color: branding.textSecondary }]}>
            {user?.phoneNumber}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: branding.surfaceColor }]}
            onPress={() => router.push('/select-area')}
          >
            <View style={[styles.menuIcon, { backgroundColor: branding.primaryColor + '20' }]}>
              <Ionicons name="location" size={24} color={branding.primaryColor} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuTitle, { color: branding.textPrimary }]}>
                Area
              </Text>
              <Text style={[styles.menuSubtitle, { color: branding.textSecondary }]}>
                {user?.area || 'Select your area'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={branding.textSecondary} />
          </TouchableOpacity>

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
            <View style={[styles.badge, { backgroundColor: branding.warning }]}>
              <Text style={styles.badgeText}>Dev Build</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={branding.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: branding.surfaceColor }]}
            onPress={() => router.push('/analytics')}
          >
            <View style={[styles.menuIcon, { backgroundColor: branding.warning + '20' }]}>
              <Ionicons name="stats-chart" size={24} color={branding.warning} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuTitle, { color: branding.textPrimary }]}>
                Analytics
              </Text>
              <Text style={[styles.menuSubtitle, { color: branding.textSecondary }]}>
                View your spending insights
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={branding.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: branding.surfaceColor }]}
            onPress={() => Alert.alert('Coming Soon', 'Notifications feature will be available soon')}
          >
            <View style={[styles.menuIcon, { backgroundColor: branding.info + '20' }]}>
              <Ionicons name="notifications" size={24} color={branding.info} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuTitle, { color: branding.textPrimary }]}>
                Notifications
              </Text>
              <Text style={[styles.menuSubtitle, { color: branding.textSecondary }]}>
                Manage your alerts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={branding.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: branding.surfaceColor }]}
            onPress={() => Alert.alert('Help & Support', 'Email: support@cardiyo.app\nPhone: +971 4 XXX XXXX')}
          >
            <View style={[styles.menuIcon, { backgroundColor: branding.success + '20' }]}>
              <Ionicons name="help-circle" size={24} color={branding.success} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuTitle, { color: branding.textPrimary }]}>
                Help & Support
              </Text>
              <Text style={[styles.menuSubtitle, { color: branding.textSecondary }]}>
                Get help with the app
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={branding.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: branding.surfaceColor }]}
            onPress={() => Alert.alert('About Cardiyo', 'Version 1.0.0\n\nCardiyo - Smart credit card management\n\nMade with ❤️ in Dubai')}
          >
            <View style={[styles.menuIcon, { backgroundColor: branding.textSecondary + '20' }]}>
              <Ionicons name="information-circle" size={24} color={branding.textSecondary} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuTitle, { color: branding.textPrimary }]}>
                About
              </Text>
              <Text style={[styles.menuSubtitle, { color: branding.textSecondary }]}>
                App version and info
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={branding.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <View style={[styles.signOutContent, { backgroundColor: branding.error + '20' }]}>
            <Ionicons name="log-out" size={24} color={branding.error} />
            <Text style={[styles.signOutText, { color: branding.error }]}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  content: { padding: 24, paddingTop: 0 },
  userCard: { padding: 24, borderRadius: 20, alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: 'bold' },
  userName: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { fontSize: 16, marginBottom: 4 },
  userPhone: { fontSize: 14 },
  menu: { gap: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16 },
  menuIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  menuSubtitle: { fontSize: 14 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 8 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#060612' },
  signOutButton: { marginTop: 32 },
  signOutContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 12 },
  signOutText: { fontSize: 18, fontWeight: 'bold' },
});
