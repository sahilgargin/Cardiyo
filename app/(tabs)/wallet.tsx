import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getUserCards, UserCard, removeCard } from '../../services/cards';
import { getAppBranding, AppBranding } from '../../services/branding';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function WalletScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [cards, setCards] = useState<UserCard[]>([]);
  const [filter, setFilter] = useState<'all' | 'cards' | 'accounts'>('all');
  const [loading, setLoading] = useState(true);

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

  async function handleDeleteCard(cardId: string, cardName: string) {
    Alert.alert(
      'Remove Card',
      `Are you sure you want to remove ${cardName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeCard(cardId);
            await loadData();
          }
        }
      ]
    );
  }

  if (!branding) return null;

  const filteredCards = cards.filter(card => {
    if (filter === 'all') return true;
    if (filter === 'cards') return card.cardType?.includes('Card') || card.network !== 'Account';
    if (filter === 'accounts') return card.cardType?.includes('Account') || card.network === 'Account';
    return true;
  });

  const cardCount = cards.filter(c => c.cardType?.includes('Card') || c.network !== 'Account').length;
  const accountCount = cards.filter(c => c.cardType?.includes('Account') || c.network === 'Account').length;

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>Wallet</Text>
          <Text style={[styles.headerSubtitle, { color: branding.textSecondary }]}>
            {filteredCards.length} {filter === 'all' ? 'items' : filter}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: branding.primaryColor }]}
          onPress={() => router.push('/add-card/select-bank')}
        >
          <Ionicons name="add" size={24} color="#060612" />
        </TouchableOpacity>
        # In wallet.tsx, add this button next to the add button in header:
<TouchableOpacity
  style={[styles.scanButton, { backgroundColor: branding.secondaryColor }]}
  onPress={() => router.push('/scan-card')}
>
  <Ionicons name="qr-code" size={24} color="#060612" />
</TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            { backgroundColor: filter === 'all' ? branding.primaryColor : branding.surfaceColor }
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText,
            { color: filter === 'all' ? '#060612' : branding.textPrimary }
          ]}>
            All ({cards.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            { backgroundColor: filter === 'cards' ? branding.primaryColor : branding.surfaceColor }
          ]}
          onPress={() => setFilter('cards')}
        >
          <Ionicons 
            name="card" 
            size={16} 
            color={filter === 'cards' ? '#060612' : branding.textPrimary} 
          />
          <Text style={[
            styles.filterText,
            { color: filter === 'cards' ? '#060612' : branding.textPrimary }
          ]}>
            Cards ({cardCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            { backgroundColor: filter === 'accounts' ? branding.primaryColor : branding.surfaceColor }
          ]}
          onPress={() => setFilter('accounts')}
        >
          <Ionicons 
            name="wallet" 
            size={16} 
            color={filter === 'accounts' ? '#060612' : branding.textPrimary} 
          />
          <Text style={[
            styles.filterText,
            { color: filter === 'accounts' ? '#060612' : branding.textPrimary }
          ]}>
            Accounts ({accountCount})
          </Text>
        </TouchableOpacity>
      </View>

      {filteredCards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="wallet-outline" size={80} color={branding.textSecondary} />
          <Text style={[styles.emptyText, { color: branding.textPrimary }]}>
            No {filter === 'all' ? 'Cards or Accounts' : filter} Yet
          </Text>
          <Text style={[styles.emptySubtext, { color: branding.textSecondary }]}>
            Add your first {filter === 'all' ? 'card or account' : filter.slice(0, -1)} to get started
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/add-card/select-bank')}>
            <LinearGradient colors={branding.primaryGradient.colors as [string, string]} style={styles.emptyButtonGradient}>
              <Ionicons name="add" size={24} color="#060612" />
              <Text style={styles.emptyButtonText}>Add {filter === 'all' ? 'Card/Account' : filter.slice(0, -1)}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          snapToInterval={CARD_WIDTH + 24}
          decelerationRate="fast"
        >
          {filteredCards.map((card) => (
            <View key={card.id} style={[styles.cardWrapper, { width: CARD_WIDTH }]}>
              <LinearGradient
                colors={card.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.bankName}>{card.bankName}</Text>
                    <Text style={styles.cardType}>
                      {card.cardType || 'Card'} • {card.network}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCard(card.id, card.cardName)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardChip}>
                  <Ionicons name="card" size={32} color="rgba(255,255,255,0.8)" />
                </View>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.cardNumberLabel}>
                      {card.network === 'Account' ? 'Account' : 'Card'} Number
                    </Text>
                    <Text style={styles.cardNumber}>•••• •••• •••• {card.lastFourDigits}</Text>
                  </View>
                  <View style={styles.networkBadge}>
                    <Text style={styles.networkText}>{card.network}</Text>
                  </View>
                </View>

                <Text style={styles.cardName}>{card.cardName}</Text>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14, marginTop: 4 },
  addButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 24, gap: 8, marginBottom: 24 },
  filterTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 6 },
  filterText: { fontSize: 14, fontWeight: '600' },
  cardsContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  cardWrapper: { marginRight: 24 },
  card: { height: 220, borderRadius: 20, padding: 24, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bankName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  cardType: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  deleteButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  cardChip: { width: 48, height: 38, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardNumberLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 4, textTransform: 'uppercase' },
  cardNumber: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', letterSpacing: 2 },
  cardName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginTop: 8 },
  networkBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  networkText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 24, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptySubtext: { fontSize: 16, textAlign: 'center', marginBottom: 32 },
  emptyButton: { borderRadius: 16, overflow: 'hidden' },
  emptyButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 32, gap: 8 },
  emptyButtonText: { fontSize: 18, fontWeight: 'bold', color: '#060612' },
});
