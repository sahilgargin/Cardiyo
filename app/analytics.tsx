import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { getAppBranding, AppBranding } from '../services/branding';
import { getUserTransactions, getSpendingByCategory, Transaction } from '../services/sms';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState<{ [key: string]: number }>({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlyAverage, setMonthlyAverage] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    const txns = await getUserTransactions();
    setTransactions(txns);

    // Calculate this month's spending
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const spending = await getSpendingByCategory(startOfMonth, endOfMonth);
    setSpendingByCategory(spending);

    const total = Object.values(spending).reduce((sum, val) => sum + val, 0);
    setTotalSpent(total);

    // Calculate average from all debits
    const debits = txns.filter(t => t.type === 'debit');
    const avg = debits.length > 0 ? debits.reduce((sum, t) => sum + t.amount, 0) / debits.length : 0;
    setMonthlyAverage(avg);
  }

  function formatAmount(amount: number): string {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (!branding) {
    return <View style={styles.loading}><Text>Loading...</Text></View>;
  }

  const categories = Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1]);

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
          Analytics
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { backgroundColor: branding.surfaceColor }]}>
            <View style={[styles.summaryIcon, { backgroundColor: '#FF6B6B20' }]}>
              <Ionicons name="trending-down" size={24} color="#FF6B6B" />
            </View>
            <Text style={[styles.summaryLabel, { color: branding.textSecondary }]}>
              This Month
            </Text>
            <Text style={[styles.summaryValue, { color: branding.textPrimary }]}>
              {formatAmount(totalSpent)}
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: branding.surfaceColor }]}>
            <View style={[styles.summaryIcon, { backgroundColor: '#9BFF3220' }]}>
              <Ionicons name="stats-chart" size={24} color="#9BFF32" />
            </View>
            <Text style={[styles.summaryLabel, { color: branding.textSecondary }]}>
              Avg Transaction
            </Text>
            <Text style={[styles.summaryValue, { color: branding.textPrimary }]}>
              {formatAmount(monthlyAverage)}
            </Text>
          </View>
        </View>

        {/* Spending by Category */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
            Spending by Category
          </Text>

          {categories.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="pie-chart-outline" size={48} color={branding.textSecondary} />
              <Text style={[styles.emptyText, { color: branding.textSecondary }]}>
                No spending data yet
              </Text>
            </View>
          ) : (
            categories.map(([category, amount], index) => {
              const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
              const colors = [
                ['#FF6B6B', '#FF8E53'],
                ['#9BFF32', '#3DEEFF'],
                ['#FFD93D', '#FF9D00'],
                ['#A78BFA', '#EC4899'],
                ['#3B82F6', '#06B6D4'],
              ];
              const color = colors[index % colors.length];

              return (
                <View key={category} style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryDot, { backgroundColor: color[0] }]} />
                    <Text style={[styles.categoryName, { color: branding.textPrimary }]}>
                      {category}
                    </Text>
                  </View>

                  <View style={styles.categoryRight}>
                    <Text style={[styles.categoryAmount, { color: branding.textPrimary }]}>
                      {formatAmount(amount)}
                    </Text>
                    <Text style={[styles.categoryPercent, { color: branding.textSecondary }]}>
                      {percentage.toFixed(1)}%
                    </Text>
                  </View>

                  <View style={[styles.progressBar, { backgroundColor: branding.surfaceColor }]}>
                    <LinearGradient
                      colors={color as [string, string]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressFill, { width: `${percentage}%` }]}
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
            Recent Transactions
          </Text>

          {transactions.slice(0, 5).map((txn, index) => (
            <View
              key={index}
              style={[styles.transactionCard, { backgroundColor: branding.surfaceColor }]}
            >
              <View style={[
                styles.txnIcon,
                { backgroundColor: txn.type === 'debit' ? '#FF6B6B20' : '#9BFF3220' }
              ]}>
                <Ionicons
                  name={txn.type === 'debit' ? 'arrow-up' : 'arrow-down'}
                  size={16}
                  color={txn.type === 'debit' ? '#FF6B6B' : '#9BFF32'}
                />
              </View>

              <View style={styles.txnDetails}>
                <Text style={[styles.txnMerchant, { color: branding.textPrimary }]}>
                  {txn.merchant}
                </Text>
                <Text style={[styles.txnDate, { color: branding.textSecondary }]}>
                  {txn.date.toLocaleDateString()}
                </Text>
              </View>

              <Text
                style={[
                  styles.txnAmount,
                  { color: txn.type === 'debit' ? '#FF6B6B' : '#9BFF32' }
                ]}
              >
                {txn.type === 'debit' ? '-' : '+'}{formatAmount(txn.amount)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 24, paddingTop: 0 },
  summaryGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  summaryCard: { flex: 1, padding: 20, borderRadius: 16 },
  summaryIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 12, marginBottom: 8 },
  summaryValue: { fontSize: 20, fontWeight: 'bold' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, marginTop: 12 },
  categoryItem: { marginBottom: 20 },
  categoryInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  categoryDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  categoryName: { fontSize: 16, fontWeight: '600', flex: 1 },
  categoryRight: { position: 'absolute', right: 0, top: 0, alignItems: 'flex-end' },
  categoryAmount: { fontSize: 16, fontWeight: 'bold' },
  categoryPercent: { fontSize: 12, marginTop: 2 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  transactionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12 },
  txnIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txnDetails: { flex: 1 },
  txnMerchant: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  txnDate: { fontSize: 12 },
  txnAmount: { fontSize: 16, fontWeight: 'bold' },
});
