import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAppBranding, AppBranding } from '../services/branding';
import { saveTransaction, Transaction } from '../services/sms';
import { auth } from '../firebaseConfig';

const CATEGORIES = [
  { id: 'Dining', icon: 'restaurant', color: '#FF6B6B' },
  { id: 'Groceries', icon: 'cart', color: '#9BFF32' },
  { id: 'Fuel', icon: 'car', color: '#FFD93D' },
  { id: 'Shopping', icon: 'bag', color: '#A78BFA' },
  { id: 'Transport', icon: 'bus', color: '#3B82F6' },
  { id: 'Entertainment', icon: 'game-controller', color: '#EC4899' },
  { id: 'Travel', icon: 'airplane', color: '#06B6D4' },
  { id: 'Other', icon: 'ellipsis-horizontal', color: '#6B7280' },
];

export default function AddTransactionScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Dining');
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [saving, setSaving] = useState(false);

  useState(() => {
    loadBranding();
  });

  async function loadBranding() {
    const app = await getAppBranding();
    setBranding(app);
  }

  async function handleSave() {
    if (!amount || !merchant) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Please login first');
      return;
    }

    setSaving(true);

    const transaction: Transaction = {
      userId: user.uid,
      amount: parseFloat(amount),
      currency: 'AED',
      merchant: merchant.trim(),
      category: selectedCategory,
      type,
      date: new Date(),
      smsBody: 'Manually added',
      approved: true,
    };

    const success = await saveTransaction(transaction);
    setSaving(false);

    if (success) {
      Alert.alert('Success', 'Transaction added', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Error', 'Failed to save transaction');
    }
  }

  if (!branding) return null;

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={branding.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
          Add Transaction
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Type Toggle */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'debit' && { backgroundColor: '#FF6B6B20' }
            ]}
            onPress={() => setType('debit')}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={type === 'debit' ? '#FF6B6B' : branding.textSecondary}
            />
            <Text style={[
              styles.typeText,
              { color: type === 'debit' ? '#FF6B6B' : branding.textSecondary }
            ]}>
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'credit' && { backgroundColor: '#9BFF3220' }
            ]}
            onPress={() => setType('credit')}
          >
            <Ionicons
              name="arrow-down"
              size={20}
              color={type === 'credit' ? '#9BFF32' : branding.textSecondary}
            />
            <Text style={[
              styles.typeText,
              { color: type === 'credit' ? '#9BFF32' : branding.textSecondary }
            ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: branding.textPrimary }]}>
            Amount
          </Text>
          <View style={[styles.inputContainer, { backgroundColor: branding.surfaceColor }]}>
            <Text style={[styles.currency, { color: branding.textSecondary }]}>
              AED
            </Text>
            <TextInput
              style={[styles.input, { color: branding.textPrimary }]}
              placeholder="0.00"
              placeholderTextColor={branding.textSecondary}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Merchant */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: branding.textPrimary }]}>
            Merchant
          </Text>
          <TextInput
            style={[
              styles.inputContainer,
              styles.merchantInput,
              { backgroundColor: branding.surfaceColor, color: branding.textPrimary }
            ]}
            placeholder="e.g., Carrefour, Starbucks"
            placeholderTextColor={branding.textSecondary}
            value={merchant}
            onChangeText={setMerchant}
          />
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: branding.textPrimary }]}>
            Category
          </Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id && {
                    backgroundColor: cat.color + '20',
                    borderColor: cat.color
                  }
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={20}
                  color={selectedCategory === cat.id ? cat.color : branding.textSecondary}
                />
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategory === cat.id ? cat.color : branding.textSecondary }
                ]}>
                  {cat.id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          <LinearGradient
            colors={branding.primaryGradient.colors as [string, string]}
            style={styles.saveGradient}
          >
            {saving ? (
              <Text style={styles.saveText}>Saving...</Text>
            ) : (
              <>
                <Ionicons name="checkmark" size={24} color="#060612" />
                <Text style={styles.saveText}>Save Transaction</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 24, paddingTop: 0 },
  typeToggle: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  typeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8, backgroundColor: '#1a1a1a' },
  typeText: { fontSize: 16, fontWeight: '600' },
  field: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, gap: 12 },
  currency: { fontSize: 18, fontWeight: 'bold' },
  input: { flex: 1, fontSize: 24, fontWeight: 'bold' },
  merchantInput: { fontSize: 16 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, gap: 8, backgroundColor: '#1a1a1a', borderWidth: 2, borderColor: 'transparent' },
  categoryText: { fontSize: 14, fontWeight: '600' },
  footer: { padding: 24, paddingBottom: 40 },
  saveButton: { borderRadius: 16, overflow: 'hidden' },
  saveGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 12 },
  saveText: { fontSize: 18, fontWeight: 'bold', color: '#060612' },
});
