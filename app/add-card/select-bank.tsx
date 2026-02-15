import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllBanks, BankOption } from '../../services/cards';
import { getAppBranding, AppBranding } from '../../services/branding';

export default function SelectBankScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [banks, setBanks] = useState<BankOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    const allBanks = await getAllBanks();
    setBanks(allBanks);
    setLoading(false);
  }

  function handleSelectBank(bankId: string) {
    router.push({
      pathname: '/add-card/select-card',
      params: { bankId },
    });
  }

  if (!branding || loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#9BFF32" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={branding.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
            Select Your Bank
          </Text>
          <Text style={[styles.headerSubtitle, { color: branding.textSecondary }]}>
            Step 1 of 2
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: branding.surfaceColor }]}>
          <LinearGradient
            colors={branding.primaryGradient.colors as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: '50%' }]}
          />
        </View>
      </View>

      {/* Banks List */}
      <ScrollView contentContainerStyle={styles.content}>
        {banks.map((bank) => (
          <TouchableOpacity
            key={bank.id}
            style={[styles.bankCard, { backgroundColor: branding.surfaceColor }]}
            onPress={() => handleSelectBank(bank.id)}
          >
            <View style={styles.bankInfo}>
              <View style={[styles.bankIcon, { backgroundColor: branding.backgroundColor }]}>
                <Ionicons name="business" size={24} color={branding.success} />
              </View>
              <Text style={[styles.bankName, { color: branding.textPrimary }]}>
                {bank.name}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={branding.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
  },
});
