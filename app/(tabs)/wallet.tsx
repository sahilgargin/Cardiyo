import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SwipeListView } from 'react-native-swipe-list-view';
import { auth } from '../../firebaseConfig';
import { getUserCards, removeCard, UserCard } from '../../services/cards';
import { getAppBranding, AppBranding } from '../../services/branding';

export default function WalletScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    const userCards = await getUserCards();
    setCards(userCards);
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  async function handleRemoveCard(cardId: string) {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeCard(cardId);
            setCards(cards.filter(c => c.id !== cardId));
          }
        }
      ]
    );
  }

  if (!branding) {
    return <View style={styles.loading} />;
  }

  const renderCard = ({ item }: { item: UserCard }) => {
    // Ensure colors array exists with fallback
    const gradientColors = item.gradient && Array.isArray(item.gradient) && item.gradient.length >= 2
      ? item.gradient as [string, string]
      : ['#1a1a1a', '#2a2a2a'] as [string, string];

    return (
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.bankName}>{item.bankName}</Text>
            <Ionicons name="card" size={32} color="rgba(255,255,255,0.9)" />
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardNumber}>•••• {item.lastFourDigits}</Text>
            <Text style={styles.cardName}>{item.cardName}</Text>
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>Card Type</Text>
              <Text style={styles.cardValue}>{item.cardType}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardLabel}>Network</Text>
              <Text style={styles.cardValue}>{item.network || 'Visa'}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderHiddenItem = ({ item }: { item: UserCard }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveCard(item.id)}
      >
        <Ionicons name="trash" size={24} color="#FFFFFF" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
          My Cards
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: branding.primaryColor }]}
          onPress={() => router.push('/add-card/select-bank')}
        >
          <Ionicons name="add" size={24} color="#060612" />
        </TouchableOpacity>
      </View>

      {cards.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={branding.primaryColor}
            />
          }
        >
          <Ionicons name="card-outline" size={80} color={branding.textSecondary} />
          <Text style={[styles.emptyText, { color: branding.textPrimary }]}>
            No Cards Yet
          </Text>
          <Text style={[styles.emptySubtext, { color: branding.textSecondary }]}>
            Add your first card to start tracking
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/add-card/select-bank')}
          >
            <LinearGradient
              colors={branding.primaryGradient.colors as [string, string]}
              style={styles.emptyButtonGradient}
            >
              <Ionicons name="add" size={24} color="#060612" />
              <Text style={styles.emptyButtonText}>Add Card</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <SwipeListView
          data={cards}
          renderItem={renderCard}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-100}
          disableRightSwipe
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={branding.primaryColor}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  addButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 24, paddingTop: 0 },
  cardContainer: { marginBottom: 16 },
  card: { borderRadius: 20, padding: 24, height: 200 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  bankName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  cardBody: { flex: 1, justifyContent: 'center' },
  cardNumber: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, letterSpacing: 2 },
  cardName: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  cardValue: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  rowBack: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 16, marginBottom: 16 },
  deleteButton: { backgroundColor: '#FF6B6B', width: 80, height: '100%', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  deleteText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', marginTop: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 24, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptySubtext: { fontSize: 16, textAlign: 'center', marginBottom: 32 },
  emptyButton: { borderRadius: 16, overflow: 'hidden' },
  emptyButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 32, gap: 8 },
  emptyButtonText: { fontSize: 18, fontWeight: 'bold', color: '#060612' },
});
