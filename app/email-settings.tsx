import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAppBranding, AppBranding } from '../services/branding';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function EmailSettingsScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [stats, setStats] = useState({ messagesScanned: 0, transactionsFound: 0 });

  useEffect(() => {
    loadBranding();
    checkConnection();
  }, []);

  async function loadBranding() {
    const app = await getAppBranding();
    setBranding(app);
  }

  async function checkConnection() {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const syncDoc = await getDoc(doc(db, 'users', user.uid, 'sync', 'gmail'));
      if (syncDoc.exists()) {
        const data = syncDoc.data();
        setConnected(data.connected || false);
        setLastSync(data.lastSync?.toDate() || null);
        setStats({
          messagesScanned: data.messagesScanned || 0,
          transactionsFound: data.transactionsFound || 0,
        });
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  }

  async function handleConnect() {
    setConnecting(true);

    try {
      const functions = getFunctions();
      const initiateAuth = httpsCallable(functions, 'initiateGmailAuth');
      
      const result = await initiateAuth();
      const data = result.data as { authUrl: string };
      
      const supported = await Linking.canOpenURL(data.authUrl);
      
      if (supported) {
        await Linking.openURL(data.authUrl);
        
        Alert.alert(
          'Complete Authentication',
          'Please sign in with Google in your browser, then return to the app.',
          [
            {
              text: 'I\'ve Connected',
              onPress: async () => {
                setConnected(true);
                
                const user = auth.currentUser;
                if (user) {
                  await setDoc(doc(db, 'users', user.uid, 'sync', 'gmail'), {
                    connected: true,
                    connectedAt: new Date(),
                  });
                }
                
                Alert.alert('Success!', 'Gmail connected. Tap Sync Now to import transactions.');
              }
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Cannot open browser');
      }
    } catch (error: any) {
      console.error('Connect error:', error);
      Alert.alert('Error', error.message || 'Failed to connect Gmail');
    } finally {
      setConnecting(false);
    }
  }

  async function handleSync() {
    setSyncing(true);

    try {
      const functions = getFunctions();
      const syncGmail = httpsCallable(functions, 'syncGmail');
      
      const result = await syncGmail({ daysBack: 30 });
      const data = result.data as { messagesScanned: number; transactionsFound: number };
      
      const now = new Date();
      setStats(data);
      setLastSync(now);
      
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid, 'sync', 'gmail'), {
          connected: true,
          lastSync: now,
          messagesScanned: data.messagesScanned,
          transactionsFound: data.transactionsFound,
        }, { merge: true });
      }
      
      Alert.alert(
        'Sync Complete!',
        `Scanned ${data.messagesScanned} emails\nFound ${data.transactionsFound} transactions`
      );
    } catch (error: any) {
      console.error('Sync error:', error);
      Alert.alert('Sync Error', error.message || 'Failed to sync emails. The Firestore index may still be building - try again in a few minutes.');
    } finally {
      setSyncing(false);
    }
  }

  if (!branding) {
    return <View style={styles.loading}><ActivityIndicator /></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={branding.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
          Gmail Sync
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.statusCard, { backgroundColor: branding.surfaceColor }]}>
          <View style={[styles.statusIcon, { backgroundColor: connected ? '#9BFF3220' : '#FFD93D20' }]}>
            <Ionicons name={connected ? 'checkmark-circle' : 'mail'} size={40} color={connected ? '#9BFF32' : '#FFD93D'} />
          </View>
          
          <Text style={[styles.statusTitle, { color: branding.textPrimary }]}>
            {connected ? 'Gmail Connected' : 'Connect Gmail'}
          </Text>
          
          <Text style={[styles.statusText, { color: branding.textSecondary }]}>
            {connected 
              ? 'Automatically sync bank transaction emails'
              : 'Works on both iOS and Android'}
          </Text>

          {!connected ? (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleConnect}
              disabled={connecting}
            >
              <LinearGradient 
                colors={branding.primaryGradient.colors as [string, string]} 
                style={styles.buttonGradient}
              >
                {connecting ? (
                  <>
                    <ActivityIndicator color="#060612" size="small" />
                    <Text style={styles.buttonText}>Connecting...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="mail" size={24} color="#060612" />
                    <Text style={styles.buttonText}>Connect Gmail</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSync} 
              disabled={syncing}
            >
              <LinearGradient 
                colors={branding.primaryGradient.colors as [string, string]} 
                style={styles.buttonGradient}
              >
                {syncing ? (
                  <>
                    <ActivityIndicator color="#060612" />
                    <Text style={styles.buttonText}>Syncing...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="refresh" size={24} color="#060612" />
                    <Text style={styles.buttonText}>Sync Now</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {connected && (
          <View style={[styles.statsCard, { backgroundColor: branding.surfaceColor }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: branding.textPrimary }]}>
                {stats.transactionsFound}
              </Text>
              <Text style={[styles.statLabel, { color: branding.textSecondary }]}>
                Transactions
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: branding.textPrimary }]}>
                {stats.messagesScanned}
              </Text>
              <Text style={[styles.statLabel, { color: branding.textSecondary }]}>
                Emails
              </Text>
            </View>
          </View>
        )}

        {lastSync && (
          <View style={[styles.lastSyncCard, { backgroundColor: branding.surfaceColor }]}>
            <Ionicons name="time" size={20} color={branding.textSecondary} />
            <Text style={[styles.lastSyncText, { color: branding.textSecondary }]}>
              Last synced {formatLastSync(lastSync)}
            </Text>
          </View>
        )}

        <View style={[styles.infoBox, { backgroundColor: branding.surfaceColor }]}>
          <Ionicons name="information-circle" size={24} color={branding.primaryColor} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.infoTitle, { color: branding.textPrimary }]}>
              How it Works
            </Text>
            <Text style={[styles.infoText, { color: branding.textSecondary }]}>
              Securely reads bank emails from ADIB, Emirates NBD, FAB, and Mashreq. Transactions are automatically matched to your cards by last 4 digits.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function formatLastSync(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 24, paddingTop: 0 },
  statusCard: { padding: 32, borderRadius: 20, alignItems: 'center', marginBottom: 24 },
  statusIcon: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  statusTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  statusText: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  button: { borderRadius: 16, overflow: 'hidden', width: '100%' },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#060612' },
  statsCard: { flexDirection: 'row', padding: 20, borderRadius: 16, marginBottom: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#2a2a2a', marginHorizontal: 20 },
  statValue: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  statLabel: { fontSize: 12 },
  lastSyncCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, marginBottom: 16, gap: 8 },
  lastSyncText: { fontSize: 14 },
  infoBox: { flexDirection: 'row', padding: 16, borderRadius: 12 },
  infoTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  infoText: { fontSize: 12, lineHeight: 18 },
});
