import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../firebaseConfig';
import { getUserCards, removeCard, UserCard } from '../../services/cards';
import { getAppBranding, AppBranding } from '../../services/branding';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 220;

export default function WalletScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);
    await loadCards();
  }

  async function loadCards() {
    setLoading(true);
    const userCards = await getUserCards();
    setCards(userCards);
    setLoading(false);
  }

  async function handleRemoveCard(card: UserCard) {
    Alert.alert(
      'Remove Card',
      `Remove ${card.cardName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const success = await removeCard(card.id);
            if (success) {
              await loadCards();
            }
          },
        },
      ]
    );
  }

  function renderRewardsCard() {
    if (!branding || cards.length === 0) return null;

    const totalRewards = cards.length * 2400 + Math.floor(Math.random() * 1000);
    
    return (
      <View style={styles.rewardsCard}>
        <LinearGradient
          colors={['#1a1a1a', '#2a2a2a']}
          style={styles.rewardsGradient}
        >
          <View style={styles.rewardsHeader}>
            <View style={styles.rewardsIcon}>
              <Ionicons name="trophy" size={20} color="#FFD700" />
            </View>
            <Text style={[styles.rewardsLabel, { color: branding.textSecondary }]}>
              Total Rewards Points
            </Text>
          </View>
          <Text style={[styles.rewardsValue, { color: branding.textPrimary }]}>
            ₹{(totalRewards / 100).toFixed(2)}L = ₹{(totalRewards / 20).toFixed(2)}L
          </Text>
          <Text style={[styles.rewardsSubtext, { color: branding.textSecondary }]}>
            Value ₹{(totalRewards / 25).toFixed(2)}L
          </Text>
        </LinearGradient>
      </View>
    );
  }

  function renderQuickActions() {
    if (!branding) return null;

    return (
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: 'rgba(155, 255, 50, 0.1)' }]}>
            <Ionicons name="gift" size={20} color="#9BFF32" />
          </View>
          <Text style={[styles.actionText, { color: branding.textPrimary }]}>
            Offers &{'\n'}Benefits
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 239, 160, 0.1)' }]}>
            <Ionicons name="trophy" size={20} color="#FFEFA0" />
          </View>
          <Text style={[styles.actionText, { color: branding.textPrimary }]}>
            Earn{'\n'}Rewards
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: 'rgba(61, 238, 255, 0.1)' }]}>
            <Ionicons name="repeat" size={20} color="#3DEEFF" />
          </View>
          <Text style={[styles.actionText, { color: branding.textPrimary }]}>
            Check{'\n'}Redemption
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderCard(card: UserCard, index: number) {
    const isSelected = index === selectedCardIndex;
    const shadowColor = card.branding.gradient.colors[0];
    const textColor = card.branding.textColor || '#FFFFFF';
    const chipColor = card.branding.chipColor || 'rgba(255,255,255,0.8)';

    return (
      <TouchableOpacity
        key={card.id}
        activeOpacity={0.95}
        onPress={() => setSelectedCardIndex(index)}
        onLongPress={() => handleRemoveCard(card)}
        style={[
          styles.cardContainer,
          { marginBottom: index === cards.length - 1 ? 0 : 16 }
        ]}
      >
        <LinearGradient
          colors={card.branding.gradient.colors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            {
              shadowColor: shadowColor,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isSelected ? 0.4 : 0.2,
              shadowRadius: isSelected ? 20 : 12,
              transform: [{ scale: isSelected ? 1 : 0.98 }],
            },
          ]}
        >
          {/* World Map Pattern */}
          <View style={styles.worldMap}>
            <Ionicons name="earth" size={200} color={`${textColor}05`} />
          </View>

          {/* Bank Logo & Chip */}
          <View style={styles.cardTop}>
            <View>
              <Text style={[styles.bankLogo, { color: textColor }]}>
                {card.bankName}
              </Text>
              <Text style={[styles.cardTypeBadge, { color: `${textColor}99` }]}>
                {card.cardType}
              </Text>
            </View>
            <View style={[styles.cardChip, { backgroundColor: `${chipColor}25` }]}>
              <View style={[styles.chipPattern, { borderColor: chipColor }]}>
                <View style={[styles.chipInner, { backgroundColor: `${chipColor}40` }]} />
              </View>
            </View>
          </View>

          {/* Card Number */}
          <View style={styles.cardMiddle}>
            <Text style={[styles.cardNumber, { color: textColor }]}>
              ••••  ••••  ••••  {card.lastFourDigits}
            </Text>
          </View>

          {/* Card Holder & Expiry */}
          <View style={styles.cardBottom}>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardLabel, { color: `${textColor}80` }]}>
                CARD HOLDER
              </Text>
              <Text style={[styles.cardValue, { color: textColor }]} numberOfLines={1}>
                {auth.currentUser?.displayName?.toUpperCase() || 'CARDHOLDER'}
              </Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardLabel, { color: `${textColor}80` }]}>
                VALID THRU
              </Text>
              <Text style={[styles.cardValue, { color: textColor }]}>12/28</Text>
            </View>
          </View>

          {/* Network Logo */}
          <View style={styles.networkLogo}>
            {card.branding.networkLogo === 'visa' ? (
              <View style={styles.visaLogo}>
                <View style={[styles.visaBar1, { backgroundColor: textColor }]} />
                <View style={[styles.visaBar2, { backgroundColor: textColor }]} />
              </View>
            ) : (
              <View style={styles.mastercardLogo}>
                <View style={styles.mcCircle1} />
                <View style={styles.mcCircle2} />
              </View>
            )}
          </View>

          {/* Points Badge */}
          <View style={styles.pointsBadge}>
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.1)']}
              style={styles.pointsBadgeGradient}
            >
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.pointsText}>
                {Math.floor(Math.random() * 10 + 5)}K Points
              </Text>
            </LinearGradient>
          </View>
        </LinearGradient>

        {/* Due Date */}
        {isSelected && (
          <View style={styles.cardFooter}>
            <View style={styles.dueInfo}>
              <Ionicons name="calendar" size={14} color="#888" />
              <Text style={styles.dueText}>
                ₹{Math.floor(Math.random() * 50000 + 10000)} Due on 15 Nov, 2025
              </Text>
            </View>
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (!branding) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!auth.currentUser) {
    return (
      <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
        <LinearGradient
          colors={['#060612', '#0a0a1a', '#060612']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.guestState}>
          <View style={styles.guestIcon}>
            <LinearGradient
              colors={['rgba(155, 255, 50, 0.1)', 'rgba(61, 238, 255, 0.1)']}
              style={styles.guestIconGradient}
            >
              <Ionicons name="wallet-outline" size={56} color={branding.success} />
            </LinearGradient>
          </View>
          <Text style={[styles.guestTitle, { color: branding.textPrimary }]}>
            Login to View Wallet
          </Text>
          <Text style={[styles.guestSubtitle, { color: branding.textSecondary }]}>
            Add your cards and start earning rewards
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/welcome')}>
            <LinearGradient
              colors={branding.primaryGradient.colors as [string, string]}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Login to Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: branding.backgroundColor }]}>
        <Text style={[styles.loadingText, { color: branding.textPrimary }]}>
          Loading your wallet...
        </Text>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
        <LinearGradient
          colors={['#060612', '#0a0a1a', '#060612']}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
            Credit cards
          </Text>
          <TouchableOpacity 
            style={styles.headerAction}
            onPress={() => router.push('/add-card/select-bank')}
          >
            <Ionicons name="add" size={24} color={branding.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <LinearGradient
              colors={branding.primaryGradient.colors as [string, string]}
              style={styles.emptyIconGradient}
            >
              <Ionicons name="wallet-outline" size={56} color="#060612" />
            </LinearGradient>
          </View>
          <Text style={[styles.emptyTitle, { color: branding.textPrimary }]}>
            No Cards Yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: branding.textSecondary }]}>
            Add your first credit card to track{'\n'}rewards and discover offers
          </Text>
          <TouchableOpacity onPress={() => router.push('/add-card/select-bank')}>
            <LinearGradient
              colors={branding.primaryGradient.colors as [string, string]}
              style={styles.addButton}
            >
              <Ionicons name="add-circle" size={24} color="#060612" />
              <Text style={styles.addButtonText}>Add Your First Card</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
          Credit cards
        </Text>
        <TouchableOpacity 
          style={styles.headerAction}
          onPress={() => router.push('/add-card/select-bank')}
        >
          <Ionicons name="add" size={24} color={branding.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Rewards Summary */}
        {renderRewardsCard()}

        {/* Card Count */}
        <View style={styles.cardsHeader}>
          <Text style={[styles.cardsTitle, { color: branding.textPrimary }]}>
            Your cards
          </Text>
          <View style={styles.cardsBadge}>
            <Text style={[styles.cardsBadgeText, { color: branding.textPrimary }]}>
              {cards.length}
            </Text>
          </View>
          <TouchableOpacity style={styles.searchIcon}>
            <Ionicons name="search" size={20} color={branding.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterIcon}>
            <Ionicons name="options" size={20} color={branding.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Cards List */}
        <View style={styles.cardsList}>
          {cards.map((card, index) => renderCard(card, index))}
        </View>

        {/* Quick Actions */}
        {renderQuickActions()}

        <View style={{ height: 120 }} />
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
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  rewardsCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  rewardsGradient: {
    padding: 20,
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardsLabel: {
    fontSize: 13,
  },
  rewardsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rewardsSubtext: {
    fontSize: 13,
  },
  cardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  cardsBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardsBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchIcon: {
    marginRight: 12,
  },
  filterIcon: {},
  cardsList: {
    marginBottom: 32,
  },
  cardContainer: {},
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  worldMap: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    opacity: 0.3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'auto',
  },
  bankLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardTypeBadge: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  cardChip: {
    width: 50,
    height: 38,
    borderRadius: 8,
    padding: 6,
  },
  chipPattern: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    padding: 2,
  },
  chipInner: {
    flex: 1,
    borderRadius: 2,
  },
  cardMiddle: {
    marginBottom: 20,
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    gap: 32,
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 8,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  networkLogo: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  visaLogo: {
    width: 50,
    height: 16,
    flexDirection: 'row',
    gap: 4,
  },
  visaBar1: {
    flex: 1,
    borderRadius: 2,
    opacity: 0.6,
  },
  visaBar2: {
    flex: 1,
    borderRadius: 2,
    opacity: 0.8,
  },
  mastercardLogo: {
    flexDirection: 'row',
  },
  mcCircle1: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EB001B',
  },
  mcCircle2: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F79E1B',
    marginLeft: -15,
  },
  pointsBadge: {
    position: 'absolute',
    top: 24,
    right: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pointsBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFD700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  dueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueText: {
    fontSize: 12,
    color: '#888',
  },
  payButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  payButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F9F9F9',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  guestState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  guestIcon: {
    marginBottom: 24,
  },
  guestIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  loginButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#060612',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#060612',
  },
});
