import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getCardsByBank, Card, addUserCard } from '../../services/cards';
import { getAppBranding, AppBranding } from '../../services/branding';

export default function SelectCardScreen() {
  const router = useRouter();
  const { bankId, bankName } = useLocalSearchParams();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    const bankCards = await getCardsByBank(bankId as string);
    setCards(bankCards);
    setLoading(false);
  }

  async function handleAddCard() {
    if (!selectedCard) return;
    
    if (!lastFourDigits || lastFourDigits.length !== 4) {
      Alert.alert('Invalid Input', 'Please enter the last 4 digits of your card');
      return;
    }

    setAdding(true);

    try {
      console.log('🎯 Adding card:', selectedCard.name);
      
      await addUserCard({
        cardId: selectedCard.id,
        cardName: selectedCard.name,
        bankId: bankId as string,
        bankName: bankName as string,
        cardType: selectedCard.type,
        network: selectedCard.network || 'Visa',
        lastFourDigits: lastFourDigits,
        gradient: Array.isArray(selectedCard.gradient) ? selectedCard.gradient : ['#1a1a1a', '#2a2a2a'],
      });

      Alert.alert(
        'Card Added!',
        `${selectedCard.name} has been added to your wallet`,
        [{ text: 'View Wallet', onPress: () => router.push('/(tabs)/wallet') }]
      );
    } catch (error: any) {
      console.error('❌ Error:', error);
      Alert.alert('Error', error.message || 'Failed to add card');
    } finally {
      setAdding(false);
    }
  }

  if (!branding || loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#9BFF32" /></View>;
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: branding.backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={branding.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
          Select Card ({cards.length})
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.bankName, { color: branding.textSecondary }]}>
          {bankName}
        </Text>

        {cards.map((card) => {
          // Ensure gradient is always an array
          const gradientColors = Array.isArray(card.gradient) && card.gradient.length >= 2
            ? card.gradient.slice(0, 2) as [string, string]
            : ['#1a1a1a', '#2a2a2a'] as [string, string];

          return (
            <TouchableOpacity
              key={card.id}
              style={[styles.cardContainer, selectedCard?.id === card.id && styles.cardSelected]}
              onPress={() => setSelectedCard(card)}
            >
              <LinearGradient 
                colors={gradientColors} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.card}
              >
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cardType}>{card.type}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardNetwork}>{card.network}</Text>
                  {selectedCard?.id === card.id && (
                    <Ionicons name="checkmark-circle" size={32} color="#FFFFFF" />
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedCard && (
        <View style={[styles.footer, { backgroundColor: branding.surfaceColor }]}>
          <Text style={[styles.footerLabel, { color: branding.textPrimary }]}>
            Last 4 Digits
          </Text>
          <TextInput
            style={[styles.footerInput, { color: branding.textPrimary }]}
            placeholder="0000"
            placeholderTextColor={branding.textSecondary}
            keyboardType="number-pad"
            maxLength={4}
            value={lastFourDigits}
            onChangeText={setLastFourDigits}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddCard} disabled={adding}>
            <LinearGradient colors={branding.primaryGradient.colors as [string, string]} style={styles.addButtonGradient}>
              {adding ? (
                <ActivityIndicator color="#060612" />
              ) : (
                <>
                  <Ionicons name="add-circle" size={24} color="#060612" />
                  <Text style={styles.addButtonText}>Add to Wallet</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 24, paddingBottom: 200 },
  bankName: { fontSize: 18, fontWeight: '600', marginBottom: 24 },
  cardContainer: { marginBottom: 16 },
  cardSelected: { opacity: 0.9 },
  card: { borderRadius: 20, padding: 24, height: 180 },
  cardName: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  cardType: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 'auto' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardNetwork: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: 40 },
  footerLabel: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  footerInput: { backgroundColor: '#060612', padding: 16, borderRadius: 12, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, letterSpacing: 8 },
  addButton: { borderRadius: 12, overflow: 'hidden' },
  addButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 },
  addButtonText: { fontSize: 18, fontWeight: 'bold', color: '#060612' },
});
