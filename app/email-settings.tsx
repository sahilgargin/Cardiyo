import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getAppBranding, AppBranding } from '../services/branding';
import { connectGmail, syncGmail, getGmailSyncStatus } from '../services/gmail';

export default function EmailSettingsScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    const status = await getGmailSyncStatus();
    setConnected(status.connected);
    setSyncStatus(status);
    setAutoSync(status.autoSync || false);
  }

  async function handleConnect() {
    setConnecting(true);
    try {
      const result = await connectGmail();
      
      if (result.authUrl) {
        Alert.alert(
          'Connect Gmail',
          'Opening browser to connect your Gmail account...',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setConnecting(false)
            },
            {
              text: 'Continue',
              onPress: async () => {
                // Open auth URL in browser
                const { Linking } = await import('react-native');
                await Linking.openURL(result.authUrl);
                
                // Wait a bit then reload
                setTimeout(async () => {
                  await loadData();
                  setConnecting(false);
                }, 3000);
              }
            }
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setConnecting(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const result = await syncGmail();
      
      Alert.alert(
        'Sync Complete!',
        `Scanned: ${result.messagesScanned} emails\nTransactions: ${result.transactionsFound}\nTransfers: ${result.transfersFound}\nNew Cards: ${result.newCardsDetected}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
      
      await loadData();
    } catch (error: any) {
      Alert.alert('Sync Failed', error.message);
    } finally {
      setSyncing(false);
    }
  }

  async function handleToggleAutoSync(value: boolean) {
    setAutoSync(value);
    // Save to Firestore
    // TODO: Implement auto-sync settings
  }

  if (!branding) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#9BFF32" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={branding.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
          Gmail Sync
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Connection Status */}
        <View style={[styles.card, { backgroundColor: branding.surfaceColor }]}>
          <View style={styles.statusHeader}>
            <View style={[
              styles.statusIcon,
              { backgroundColor: connected ? branding.success + '20' : branding.warning + '20' }
            ]}>
              <Ionicons 
                name={connected ? "checkmark-circle" : "mail"} 
                size={32} 
                color={connected ? branding.success : branding.warning} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.statusTitle, { color: branding.textPrimary }]}>
                {connected ? 'Gmail Connected' : 'Not Connected'}
              </Text>
              <Text style={[styles.statusSubtitle, { color: branding.textSecondary }]}>
                {connected 
                  ? syncStatus?.email || 'Automatic transaction detection'
                  : 'Connect your Gmail to auto-detect transactions'
                }
              </Text>
            </View>
          </View>

          {!connected ? (
            <TouchableOpacity 
              style={styles.connectButton} 
              onPress={handleConnect}
              disabled={connecting}
            >
              <LinearGradient 
                colors={branding.primaryGradient.colors as [string, string]} 
                style={styles.connectButtonGradient}
              >
                {connecting ? (
                  <ActivityIndicator color="#060612" />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={24} color="#060612" />
                    <Text style={styles.connectButtonText}>Connect Gmail</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.syncButton} 
              onPress={handleSync}
              disabled={syncing}
            >
              <View style={styles.syncButtonContent}>
                {syncing ? (
                  <>
                    <ActivityIndicator color={branding.primaryColor} />
                    <Text style={[styles.syncButtonText, { color: branding.primaryColor }]}>
                      Syncing...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="refresh" size={24} color={branding.primaryColor} />
                    <Text style={[styles.syncButtonText, { color: branding.primaryColor }]}>
                      Sync Now
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        {connected && syncStatus && (
          <View style={[styles.card, { backgroundColor: branding.surfaceColor }]}>
            <Text style={[styles.cardTitle, { color: branding.textPrimary }]}>
              Sync Statistics
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: branding.textPrimary }]}>
                  {syncStatus.transactionsFound || 0}
                </Text>
                <Text style={[styles.statLabel, { color: branding.textSecondary }]}>
                  Transactions
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: branding.textPrimary }]}>
                  {syncStatus.messagesScanned || 0}
                </Text>
                <Text style={[styles.statLabel, { color: branding.textSecondary }]}>
                  Emails Scanned
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: branding.textPrimary }]}>
                  {syncStatus.lastSync 
                    ? new Date(syncStatus.lastSync).toLocaleDateString()
                    : 'Never'
                  }
                </Text>
                <Text style={[styles.statLabel, { color: branding.textSecondary }]}>
                  Last Sync
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Auto Sync Toggle */}
        {connected && (
          <View style={[styles.card, { backgroundColor: branding.surfaceColor }]}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: branding.textPrimary }]}>
                  Automatic Sync
                </Text>
                <Text style={[styles.cardSubtitle, { color: branding.textSecondary }]}>
                  Check for new transactions daily
                </Text>
              </View>
              <Switch
                value={autoSync}
                onValueChange={handleToggleAutoSync}
                trackColor={{ false: '#3e3e3e', true: branding.primaryColor }}
                thumbColor={autoSync ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>
          </View>
        )}

        {/* Info */}
        <View style={[styles.infoCard, { backgroundColor: branding.primaryColor + '20' }]}>
          <Ionicons name="information-circle" size={24} color={branding.primaryColor} />
          <Text style={[styles.infoText, { color: branding.textPrimary }]}>
            We scan emails from ADIB, Emirates NBD, FAB, Mashreq, wio, and Citi to automatically detect your transactions and transfers.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  content: { flex: 1, padding: 24 },
  card: { padding: 20, borderRadius: 16, marginBottom: 16 },
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  statusIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  statusTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  statusSubtitle: { fontSize: 14 },
  connectButton: { borderRadius: 12, overflow: 'hidden' },
  connectButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 12 },
  connectButtonText: { fontSize: 18, fontWeight: 'bold', color: '#060612' },
  syncButton: { borderRadius: 12, borderWidth: 2, borderColor: '#9BFF32' },
  syncButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 12 },
  syncButtonText: { fontSize: 18, fontWeight: 'bold' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  cardSubtitle: { fontSize: 14 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoCard: { padding: 16, borderRadius: 12, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: 14, lineHeight: 20 },
});
