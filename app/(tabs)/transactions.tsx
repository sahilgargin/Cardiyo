import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserTransactions, Transaction } from '../../services/sms';
import { getAppBranding, AppBranding } from '../../services/branding';
import { requestSMSPermissions, startSMSListener, readHistoricalSMS } from '../../services/smsListener';
import { useCallback } from 'react';

export default function TransactionsScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadData();
    checkPermissions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  async function checkPermissions() {
    if (Platform.OS === 'android') {
      const granted = await requestSMSPermissions();
      setHasPermission(granted);
      
      if (granted) {
        startSMSListener();
      }
    }
  }

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);
    await loadTransactions();
  }

  async function loadTransactions() {
    const txns = await getUserTransactions();
    setTransactions(txns);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  }

  async function handleSyncSMS() {
    if (Platform.OS !== 'android') {
      Alert.alert(
        'Not Available on iOS',
        'SMS reading is only available on Android. You can add transactions manually instead.',
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Add Manually', onPress: () => router.push('/add-transaction') }
        ]
      );
      return;
    }

    if (!hasPermission) {
      const granted = await requestSMSPermissions();
      setHasPermission(granted);
      
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'SMS permission is required to read bank transaction messages'
        );
        return;
      }
    }

    setSyncing(true);
    
    const count = await readHistoricalSMS(30);
    
    await loadTransactions();
    setSyncing(false);

    Alert.alert(
      'Sync Complete',
      `Processed ${count} bank transaction messages`
    );
  }

  function formatAmount(amount: number, currency: string): string {
    return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function formatDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  if (!branding) {
    return <View style={styles.loading}><Text>Loading...</Text></View>;
  }

  const totalSpent = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthCount = transactions.filter(t => {
    const now = new Date();
    return t.date.getMonth() === now.getMonth() && t.date.getFullYear() === now.getFullYear();
  }).length;

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
            Transactions
          </Text>
          <Text style={[styles.headerSubtitle, { color: branding.textSecondary }]}>
            {transactions.length} transactions
          </Text>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/analytics')}
          >
            <Ionicons name="stats-chart" size={24} color={branding.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/add-transaction')}
          >
            <Ionicons name="add" size={24} color={branding.textPrimary} />
          </TouchableOpacity>

          {Platform.OS === 'android' && (
            <TouchableOpacity
              style={styles.syncButton}
              onPress={handleSyncSMS}
              disabled={syncing}
            >
              <LinearGradient
                colors={branding.primaryGradient.colors as [string, string]}
                style={styles.syncButtonGradient}
              >
                <Ionicons 
                  name={syncing ? "hourglass" : "refresh"} 
                  size={24} 
                  color="#060612" 
                />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!hasPermission && Platform.OS === 'android' && (
        <View style={[styles.permissionBanner, { backgroundColor: branding.warning + '20' }]}>
          <Ionicons name="information-circle" size={24} color={branding.warning} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.bannerTitle, { color: branding.warning }]}>
              SMS Permission Required
            </Text>
            <Text style={[styles.bannerText, { color: branding.textSecondary }]}>
              Grant SMS access to automatically track your bank transactions
            </Text>
          </View>
          <TouchableOpacity onPress={handleSyncSMS}>
            <Text style={[styles.bannerButton, { color: branding.warning }]}>
              Enable
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {transactions.length > 0 && (
        <View style={[styles.statsCard, { backgroundColor: branding.surfaceColor }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: branding.textSecondary }]}>
              Total Spent
            </Text>
            <Text style={[styles.statValue, { color: '#FF6B6B' }]}>
              {formatAmount(totalSpent, 'AED')}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: branding.textSecondary }]}>
              This Month
            </Text>
            <Text style={[styles.statValue, { color: branding.textPrimary }]}>
              {thisMonthCount}
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={branding.success}
          />
        }
        contentContainerStyle={styles.content}
      >
        {transactions.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={64} color={branding.textSecondary} />
            <Text style={[styles.emptyTitle, { color: branding.textPrimary }]}>
              No Transactions Yet
            </Text>
            <Text style={[styles.emptyText, { color: branding.textSecondary }]}>
              {Platform.OS === 'android' 
                ? 'Tap sync to read bank SMS or add manually'
                : 'Tap + to add transactions manually'}
            </Text>
            
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/add-transaction')}
            >
              <LinearGradient
                colors={branding.primaryGradient.colors as [string, string]}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={24} color="#060612" />
                <Text style={styles.addButtonText}>Add Transaction</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          transactions.map((txn, index) => (
            <View
              key={index}
              style={[styles.transactionCard, { backgroundColor: branding.surfaceColor }]}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: txn.type === 'debit' ? '#FF6B6B20' : '#9BFF3220' }
              ]}>
                <Ionicons
                  name={txn.type === 'debit' ? 'arrow-up' : 'arrow-down'}
                  size={20}
                  color={txn.type === 'debit' ? '#FF6B6B' : '#9BFF32'}
                />
              </View>

              <View style={styles.txnDetails}>
                <Text style={[styles.merchant, { color: branding.textPrimary }]}>
                  {txn.merchant}
                </Text>
                <View style={styles.txnMeta}>
                  <Text style={[styles.date, { color: branding.textSecondary }]}>
                    {formatDate(txn.date)}
                  </Text>
                  {txn.category && (
                    <>
                      <Text style={[styles.dot, { color: branding.textSecondary }]}>•</Text>
                      <Text style={[styles.category, { color: branding.textSecondary }]}>
                        {txn.category}
                      </Text>
                    </>
                  )}
                </View>
                {txn.cardLastFour && (
                  <Text style={[styles.card, { color: branding.textSecondary }]}>
                    •••• {txn.cardLastFour}
                  </Text>
                )}
              </View>

              <View style={styles.amountContainer}>
                <Text
                  style={[
                    styles.amount,
                    { color: txn.type === 'debit' ? '#FF6B6B' : '#9BFF32' }
                  ]}
                >
                  {txn.type === 'debit' ? '-' : '+'}{formatAmount(txn.amount, txn.currency)}
                </Text>
              </View>
            </View>
          ))
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
  headerTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 4 },
  headerSubtitle: { fontSize: 14 },
  headerButtons: { flexDirection: 'row', gap: 12 },
  iconButton: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 24, backgroundColor: '#1a1a1a' },
  syncButton: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden' },
  syncButtonGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  permissionBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, marginHorizontal: 24, marginBottom: 16, borderRadius: 12 },
  bannerTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  bannerText: { fontSize: 12 },
  bannerButton: { fontSize: 14, fontWeight: 'bold' },
  statsCard: { flexDirection: 'row', marginHorizontal: 24, marginBottom: 24, padding: 20, borderRadius: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#2a2a2a', marginHorizontal: 20 },
  statLabel: { fontSize: 12, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 24, paddingTop: 0 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, marginBottom: 32 },
  addButton: { borderRadius: 16, overflow: 'hidden' },
  addButtonGradient: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 32, paddingVertical: 16 },
  addButtonText: { fontSize: 16, fontWeight: 'bold', color: '#060612' },
  transactionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txnDetails: { flex: 1 },
  merchant: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  txnMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  date: { fontSize: 12 },
  dot: { fontSize: 12, marginHorizontal: 6 },
  category: { fontSize: 12 },
  card: { fontSize: 11 },
  amountContainer: { alignItems: 'flex-end' },
  amount: { fontSize: 18, fontWeight: 'bold' },
});
