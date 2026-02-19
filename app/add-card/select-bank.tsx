import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getAllBanks, Bank } from '../../services/cards';
import { getAppBranding, AppBranding } from '../../services/branding';

export default function SelectBankScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
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

  if (!branding || loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#9BFF32" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient
        colors={['#060612', '#1a1a2e', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={branding.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
          Select Bank
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {banks.map((bank) => (
          <TouchableOpacity
            key={bank.id}
            style={[styles.bankCard, { backgroundColor: branding.surfaceColor }]}
            onPress={() => router.push({
              pathname: '/add-card/select-card',
              params: { 
                bankId: bank.id,
                bankName: bank.name
              }
            })}
          >
            <View style={styles.bankIcon}>
              <Text style={styles.bankEmoji}>{bank.logo}</Text>
            </View>
            <View style={styles.bankInfo}>
              <Text style={[styles.bankName, { color: branding.textPrimary }]}>
                {bank.name}
              </Text>
              <Text style={[styles.bankCountry, { color: branding.textSecondary }]}>
                {bank.country === 'AE' ? 'United Arab Emirates' : bank.country}
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
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 24 },
  bankCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16, marginBottom: 16 },
  bankIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(155, 255, 50, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  bankEmoji: { fontSize: 32 },
  bankInfo: { flex: 1 },
  bankName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  bankCountry: { fontSize: 14 },
});
