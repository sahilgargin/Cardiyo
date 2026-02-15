import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getAppBranding, AppBranding } from '../../services/branding';
import { getUserCards } from '../../services/cards';

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [cardCount, setCardCount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    if (user) {
      const cards = await getUserCards();
      setCardCount(cards.length);

      // Get phone number from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setPhoneNumber(userDoc.data().phoneNumber || '');
      }
    }
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
            try {
              await signOut(auth);
              router.replace('/auth/welcome');
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  }

  if (!branding) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
        <LinearGradient
          colors={['#060612', '#0a0a1a', '#060612']}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.guestState}>
          <View style={styles.guestAvatarContainer}>
            <LinearGradient
              colors={['rgba(155, 255, 50, 0.1)', 'rgba(61, 238, 255, 0.1)']}
              style={styles.guestAvatar}
            >
              <Ionicons name="person-outline" size={64} color={branding.success} />
            </LinearGradient>
          </View>
          
          <Text style={[styles.guestTitle, { color: branding.textPrimary }]}>
            Guest Mode
          </Text>
          <Text style={[styles.guestSubtitle, { color: branding.textSecondary }]}>
            Login to access your profile and{'\n'}personalized offers
          </Text>
          
          <TouchableOpacity 
            style={styles.loginButtonContainer}
            onPress={() => router.push('/auth/welcome')}
          >
            <LinearGradient
              colors={branding.primaryGradient.colors as [string, string]}
              style={styles.loginButton}
            >
              <Ionicons name="log-in" size={24} color="#060612" />
              <Text style={styles.loginButtonText}>Login to Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const initials = phoneNumber 
    ? phoneNumber.slice(-4)
    : 'U';

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={branding.primaryGradient.colors as [string, string]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
            </View>
          </View>
          
          <Text style={[styles.name, { color: branding.textPrimary }]}>
            {phoneNumber || 'User'}
          </Text>
          <Text style={[styles.email, { color: branding.textSecondary }]}>
            Verified Account
          </Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(155, 255, 50, 0.1)', 'rgba(61, 238, 255, 0.1)']}
                style={styles.statGradient}
              >
                <Ionicons name="card" size={24} color={branding.success} />
                <Text style={[styles.statValue, { color: branding.textPrimary }]}>
                  {cardCount}
                </Text>
                <Text style={[styles.statLabel, { color: branding.textSecondary }]}>
                  Cards
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(255, 151, 235, 0.1)', 'rgba(217, 148, 255, 0.1)']}
                style={styles.statGradient}
              >
                <Ionicons name="pricetag" size={24} color="#FF97EB" />
                <Text style={[styles.statValue, { color: branding.textPrimary }]}>
                  {Math.floor(Math.random() * 20 + 10)}
                </Text>
                <Text style={[styles.statLabel, { color: branding.textSecondary }]}>
                  Offers
                </Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.sections}>
          {/* Account Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: branding.textSecondary }]}>
              ACCOUNT
            </Text>
            
            <View style={[styles.menuCard, { backgroundColor: branding.surfaceColor }]}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <LinearGradient
                    colors={['rgba(155, 255, 50, 0.1)', 'rgba(61, 238, 255, 0.1)']}
                    style={styles.menuIconGradient}
                  >
                    <Ionicons name="person-outline" size={20} color={branding.success} />
                  </LinearGradient>
                </View>
                <Text style={[styles.menuText, { color: branding.textPrimary }]}>
                  Personal Information
                </Text>
                <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: branding.backgroundColor }]} />

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <LinearGradient
                    colors={['rgba(61, 238, 255, 0.1)', 'rgba(155, 255, 50, 0.1)']}
                    style={styles.menuIconGradient}
                  >
                    <Ionicons name="shield-checkmark-outline" size={20} color="#3DEEFF" />
                  </LinearGradient>
                </View>
                <Text style={[styles.menuText, { color: branding.textPrimary }]}>
                  Privacy & Security
                </Text>
                <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: branding.textSecondary }]}>
              PREFERENCES
            </Text>
            
            <View style={[styles.menuCard, { backgroundColor: branding.surfaceColor }]}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <LinearGradient
                    colors={['rgba(255, 151, 235, 0.1)', 'rgba(217, 148, 255, 0.1)']}
                    style={styles.menuIconGradient}
                  >
                    <Ionicons name="notifications-outline" size={20} color="#FF97EB" />
                  </LinearGradient>
                </View>
                <Text style={[styles.menuText, { color: branding.textPrimary }]}>
                  Notifications
                </Text>
                <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: branding.backgroundColor }]} />

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <LinearGradient
                    colors={['rgba(255, 239, 160, 0.1)', 'rgba(255, 169, 124, 0.1)']}
                    style={styles.menuIconGradient}
                  >
                    <Ionicons name="location-outline" size={20} color="#FFEFA0" />
                  </LinearGradient>
                </View>
                <Text style={[styles.menuText, { color: branding.textPrimary }]}>
                  Location Services
                </Text>
                <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: branding.textSecondary }]}>
              SUPPORT
            </Text>
            
            <View style={[styles.menuCard, { backgroundColor: branding.surfaceColor }]}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <LinearGradient
                    colors={['rgba(61, 238, 255, 0.1)', 'rgba(155, 255, 50, 0.1)']}
                    style={styles.menuIconGradient}
                  >
                    <Ionicons name="help-circle-outline" size={20} color="#3DEEFF" />
                  </LinearGradient>
                </View>
                <Text style={[styles.menuText, { color: branding.textPrimary }]}>
                  Help Center
                </Text>
                <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: branding.backgroundColor }]} />

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <LinearGradient
                    colors={['rgba(155, 255, 50, 0.1)', 'rgba(61, 238, 255, 0.1)']}
                    style={styles.menuIconGradient}
                  >
                    <Ionicons name="information-circle-outline" size={20} color={branding.success} />
                  </LinearGradient>
                </View>
                <Text style={[styles.menuText, { color: branding.textPrimary }]}>
                  About
                </Text>
                <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LinearGradient
              colors={['#FF97EB', '#FFA97C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out" size={24} color="#060612" />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.version, { color: branding.textSecondary }]}>
            Cardiyo v1.0.0
          </Text>
          <Text style={[styles.tagline, { color: branding.textSecondary }]}>
            {branding.tagline}
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#9BFF32', fontSize: 16 },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#9BFF32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#060612',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#060612',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#9BFF32',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  sections: { paddingHorizontal: 24 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  menuCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: { marginRight: 16 },
  menuIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginLeft: 72,
  },
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#060612',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  version: { fontSize: 12, marginBottom: 4 },
  tagline: { fontSize: 12, fontStyle: 'italic' },
  guestState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  guestAvatarContainer: { marginBottom: 24 },
  guestAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  loginButtonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 12,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#060612',
  },
});
