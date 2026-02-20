import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getAppBranding, AppBranding } from '../../services/branding';
import { getUserTransactions, Transaction } from '../../services/transactions';

const { width } = Dimensions.get('window');

export default function TransactionsScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [filter, setFilter] = useState<'all' | 'spend' | 'income' | 'transfer'>('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    const txns = await getUserTransactions();
    setTransactions(txns);
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  function getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      Dining: 'restaurant', Groceries: 'cart', Fuel: 'battery-charging',
      Transport: 'car', Entertainment: 'game-controller', Shopping: 'bag',
      Travel: 'airplane', Healthcare: 'medical', Utilities: 'flash',
      Education: 'school', Transfer: 'swap-horizontal', Other: 'cash'
    };
    return icons[category] || 'cash';
  }

  function getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      Dining: '#FF6B6B', Groceries: '#4ECDC4', Fuel: '#FFD93D',
      Transport: '#95E1D3', Entertainment: '#A8E6CF', Shopping: '#FF8B94',
      Travel: '#9BFF32', Healthcare: '#FF6B9D', Utilities: '#FFA07A',
      Education: '#98D8C8', Transfer: '#3DEEFF', Other: '#9CA3AF'
    };
    return colors[category] || '#9CA3AF';
  }

  function formatDate(date: Date): string {
    const today = new Date();
    const txnDate = new Date(date);
    const diffTime = today.getTime() - txnDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return txnDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  function truncateText(text: string, maxLength: number = 25): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  if (!branding || loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#9BFF32" />
      </View>
    );
  }

  const filteredTransactions = transactions.filter(txn => {
    if (filter === 'all') return true;
    if (filter === 'spend') return txn.transactionType === 'spend' && txn.includeInSpending;
    if (filter === 'income') return txn.transactionType === 'income' || txn.type === 'credit';
    if (filter === 'transfer') return txn.transactionType === 'account_transfer' || txn.isTransfer;
    return true;
  });

  // Calculate spending by category for chart
  const categorySpending: { [key: string]: number } = {};
  filteredTransactions
    .filter(txn => txn.includeInSpending && txn.type === 'debit')
    .forEach(txn => {
      categorySpending[txn.category] = (categorySpending[txn.category] || 0) + txn.amount;
    });

  const totalSpending = Object.values(categorySpending).reduce((sum, val) => sum + val, 0);

  const groupedTransactions: { [key: string]: Transaction[] } = {};
  filteredTransactions.forEach(txn => {
    const dateKey = formatDate(txn.date);
    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }
    groupedTransactions[dateKey].push(txn);
  });

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>Transactions</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.viewButton, { backgroundColor: branding.surfaceColor }]}
            onPress={() => setViewMode(viewMode === 'list' ? 'chart' : 'list')}
          >
            <Ionicons 
              name={viewMode === 'list' ? 'stats-chart' : 'list'} 
              size={20} 
              color={branding.textPrimary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: branding.primaryColor }]}
            onPress={() => router.push('/add-transaction')}
          >
            <Ionicons name="add" size={24} color="#060612" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <View style={styles.filterContainer}>
          {['all', 'spend', 'income', 'transfer'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                { backgroundColor: filter === f ? branding.primaryColor : branding.surfaceColor }
              ]}
              onPress={() => setFilter(f as any)}
            >
              <Text style={[
                styles.filterChipText,
                { color: filter === f ? '#060612' : branding.textPrimary }
              ]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {viewMode === 'chart' ? (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={branding.primaryColor} />}
          contentContainerStyle={styles.chartContent}
        >
          {/* Total Spending Card */}
          <View style={[styles.totalCard, { backgroundColor: branding.surfaceColor }]}>
            <Text style={[styles.totalLabel, { color: branding.textSecondary }]}>Total Spending</Text>
            <Text style={[styles.totalAmount, { color: branding.textPrimary }]}>
              AED {totalSpending.toFixed(2)}
            </Text>
            <Text style={[styles.totalCount, { color: branding.textSecondary }]}>
              {filteredTransactions.length} transactions
            </Text>
          </View>

          {/* Category Breakdown */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>Spending by Category</Text>
            
            {Object.entries(categorySpending)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const percentage = (amount / totalSpending) * 100;
                return (
                  <View key={category} style={[styles.categoryRow, { backgroundColor: branding.surfaceColor }]}>
                    <View style={styles.categoryInfo}>
                      <View style={[styles.categoryIconSmall, { backgroundColor: getCategoryColor(category) + '20' }]}>
                        <Ionicons name={getCategoryIcon(category) as any} size={20} color={getCategoryColor(category)} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.categoryName, { color: branding.textPrimary }]}>{category}</Text>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { width: `${percentage}%`, backgroundColor: getCategoryColor(category) }
                            ]} 
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.categoryStats}>
                      <Text style={[styles.categoryAmount, { color: branding.textPrimary }]}>
                        AED {amount.toFixed(0)}
                      </Text>
                      <Text style={[styles.categoryPercent, { color: branding.textSecondary }]}>
                        {percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={branding.primaryColor} />}
          contentContainerStyle={styles.content}
        >
          {Object.entries(groupedTransactions).map(([dateKey, txns]) => (
            <View key={dateKey} style={styles.dateGroup}>
              <Text style={[styles.dateHeader, { color: branding.textSecondary }]}>{dateKey}</Text>
              
              {txns.map((transaction) => (
                <TouchableOpacity
                  key={transaction.id}
                  style={[styles.transactionCard, { backgroundColor: branding.surfaceColor }]}
                  onPress={() => router.push({
                    pathname: '/transaction-detail',
                    params: {
                      id: transaction.id,
                      amount: transaction.amount,
                      merchant: transaction.merchant,
                      currency: transaction.currency,
                      date: transaction.date.toISOString(),
                      category: transaction.category,
                      transactionType: transaction.transactionType,
                      includeInSpending: transaction.includeInSpending,
                    }
                  })}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(transaction.category) + '20' }]}>
                    <Ionicons name={getCategoryIcon(transaction.category) as any} size={24} color={getCategoryColor(transaction.category)} />
                  </View>

                  <View style={styles.transactionInfo}>
                    <Text style={[styles.merchant, { color: branding.textPrimary }]}>
                      {truncateText(transaction.merchant)}
                    </Text>
                    <View style={styles.detailsRow}>
                      <Text style={[styles.cardName, { color: branding.textSecondary }]}>
                        {truncateText(transaction.cardName, 15)}
                      </Text>
                      <Text style={[styles.category, { color: branding.textSecondary }]}>
                        • {transaction.category}
                      </Text>
                    </View>
                  </View>

                  <Text style={[
                    styles.amount, 
                    { color: transaction.type === 'credit' ? branding.success : branding.textPrimary }
                  ]}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.currency} {transaction.amount.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  headerButtons: { flexDirection: 'row', gap: 12 },
  viewButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  addButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  filterScroll: { maxHeight: 50, marginBottom: 16 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 24, gap: 8 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  filterChipText: { fontSize: 14, fontWeight: '600' },
  content: { padding: 24, paddingTop: 0 },
  chartContent: { padding: 24, paddingTop: 0 },
  totalCard: { padding: 24, borderRadius: 20, marginBottom: 24, alignItems: 'center' },
  totalLabel: { fontSize: 14, marginBottom: 8 },
  totalAmount: { fontSize: 40, fontWeight: 'bold', marginBottom: 4 },
  totalCount: { fontSize: 14 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12 },
  categoryInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  categoryIconSmall: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  categoryName: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  categoryStats: { alignItems: 'flex-end' },
  categoryAmount: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  categoryPercent: { fontSize: 12 },
  dateGroup: { marginBottom: 24 },
  dateHeader: { fontSize: 14, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase' },
  transactionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12 },
  categoryIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  transactionInfo: { flex: 1 },
  merchant: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  detailsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardName: { fontSize: 13 },
  category: { fontSize: 13 },
  amount: { fontSize: 18, fontWeight: 'bold' },
});
