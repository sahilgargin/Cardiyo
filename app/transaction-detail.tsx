import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getAppBranding, AppBranding } from '../services/branding';
import { updateTransaction } from '../services/transactions';
import { saveTransactionRule } from '../services/transactionPreferences';

const TRANSACTION_TYPES = [
  { value: 'spend', label: 'Spend', icon: 'cart', color: '#FF6B6B' },
  { value: 'income', label: 'Income', icon: 'cash', color: '#4ECDC4' },
  { value: 'credit_card_payment', label: 'Credit Card Payment', icon: 'card', color: '#95E1D3' },
  { value: 'account_transfer', label: 'Account Transfer', icon: 'swap-horizontal', color: '#FFD93D' },
  { value: 'investment', label: 'Investment', icon: 'trending-up', color: '#9BFF32' },
  { value: 'loan', label: 'Loan', icon: 'briefcase', color: '#FFA07A' },
];

const CATEGORIES = [
  'Dining', 'Groceries', 'Fuel', 'Transport', 'Entertainment', 
  'Shopping', 'Travel', 'Healthcare', 'Utilities', 'Education',
  'Transfer', 'Salary', 'Investment', 'Other'
];

export default function TransactionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [transactionType, setTransactionType] = useState(params.transactionType as string || 'spend');
  const [category, setCategory] = useState(params.category as string || 'Other');
  const [includeInSpending, setIncludeInSpending] = useState(params.includeInSpending !== 'false');
  const [saveAsRule, setSaveAsRule] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);
  }

  async function handleSave() {
    try {
      // Update transaction
      await updateTransaction(params.id as string, {
        transactionType,
        category,
        includeInSpending,
      });

      // Save as rule if requested
      if (saveAsRule) {
        await saveTransactionRule({
          merchantPattern: params.merchant as string,
          cardLastFour: params.cardLastFour as string,
          accountLastFour: params.accountLastFour as string,
          transactionType,
          category,
          includeInSpending,
        });

        Alert.alert(
          'Rule Saved!',
          `Future transactions matching "${params.merchant}" will be automatically categorized.`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Saved!', 'Transaction updated successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  if (!branding) return null;

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={branding.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
          Categorize Transaction
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Transaction Info */}
        <View style={[styles.card, { backgroundColor: branding.surfaceColor }]}>
          <Text style={[styles.amount, { color: branding.textPrimary }]}>
            {params.currency} {parseFloat(params.amount as string).toFixed(2)}
          </Text>
          <Text style={[styles.merchant, { color: branding.textSecondary }]}>
            {params.merchant}
          </Text>
          <Text style={[styles.date, { color: branding.textSecondary }]}>
            {new Date(params.date as string).toLocaleDateString()}
          </Text>
        </View>

        {/* Transaction Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
            Transaction Type
          </Text>
          <View style={styles.grid}>
            {TRANSACTION_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeCard,
                  { backgroundColor: branding.surfaceColor },
                  transactionType === type.value && { borderColor: type.color, borderWidth: 2 }
                ]}
                onPress={() => setTransactionType(type.value)}
              >
                <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
                  <Ionicons name={type.icon as any} size={24} color={type.color} />
                </View>
                <Text style={[styles.typeLabel, { color: branding.textPrimary }]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
            Category
          </Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  { backgroundColor: branding.surfaceColor },
                  category === cat && { backgroundColor: branding.primaryColor }
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: category === cat ? '#060612' : branding.textPrimary }
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Include in Spending */}
        <View style={[styles.card, { backgroundColor: branding.surfaceColor }]}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: branding.textPrimary }]}>
                Include in Spending Calculations
              </Text>
              <Text style={[styles.cardSubtitle, { color: branding.textSecondary }]}>
                Count this towards your total spending
              </Text>
            </View>
            <Switch
              value={includeInSpending}
              onValueChange={setIncludeInSpending}
              trackColor={{ false: '#3e3e3e', true: branding.primaryColor }}
              thumbColor={includeInSpending ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Save as Rule */}
        <View style={[styles.card, { backgroundColor: branding.surfaceColor }]}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: branding.textPrimary }]}>
                Remember My Choice
              </Text>
              <Text style={[styles.cardSubtitle, { color: branding.textSecondary }]}>
                Auto-categorize future transactions from "{params.merchant}"
              </Text>
            </View>
            <Switch
              value={saveAsRule}
              onValueChange={setSaveAsRule}
              trackColor={{ false: '#3e3e3e', true: branding.primaryColor }}
              thumbColor={saveAsRule ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient colors={branding.primaryGradient.colors as [string, string]} style={styles.saveButtonGradient}>
            <Ionicons name="checkmark-circle" size={24} color="#060612" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 24, paddingTop: 0 },
  card: { padding: 20, borderRadius: 16, marginBottom: 24 },
  amount: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  merchant: { fontSize: 18, marginBottom: 4 },
  date: { fontSize: 14 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  typeCard: { width: '48%', padding: 16, borderRadius: 12, alignItems: 'center' },
  typeIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  typeLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  categoryText: { fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardSubtitle: { fontSize: 13 },
  saveButton: { borderRadius: 12, overflow: 'hidden' },
  saveButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 },
  saveButtonText: { fontSize: 18, fontWeight: 'bold', color: '#060612' },
});
