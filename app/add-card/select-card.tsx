import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCardsByBank, addCardToUser, CardOption } from '../../services/cards';
import { getCardBranding } from '../../services/branding';
import { getAppBranding, AppBranding } from '../../services/branding';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 200;

export default function SelectCardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const bankId = params.bankId as string;

  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [cards, setCards] = useState<CardOption[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardOption | null>(null);
  const [cardBranding, setCardBranding] = useState<any>(null);
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCard) {
      loadCardBranding();
    }
  }, [selectedCard]);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    const bankCards = await getCardsByBank(bankId);
    setCards(bankCards);
    setLoading(false);
  }

  async function loadCardBranding() {
    if (!selectedCard) return;
    const cardStyle = await getCardBranding(selectedCard.id, bankId);
    setCardBranding(cardStyle);
  }

  async function handleAddCard() {
    if (!selectedCard || lastFourDigits.length !== 4) return;

    setAdding(true);
    const success = await addCardToUser(bankId, selectedCard.id, lastFourDigits);
    setAdding(false);

    if (success) {
      router.replace('/(tabs)/wallet');
    }
  }

  function renderCardPreview() {
    if (!selectedCard || !cardBranding) return null;

    const textColor = cardBranding.textColor || '#FFFFFF';
    const chipColor = cardBranding.chipColor || 'rgba(255,255,255,0.8)';

    return (
      <View style={styles.previewSection}>
        <Text style={[styles.previewLabel, { color: branding?.textSecondary }]}>
          CARD PREVIEW
        </Text>
        <View style={styles.cardPreviewContainer}>
          <LinearGradient
            colors={cardBranding.gradient.colors as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardPreview}
          >
            <View style={styles.cardPattern}>
              <View style={[styles.patternCircle, { backgroundColor: `${textColor}08` }]} />
              <View style={[styles.patternCircle2, { backgroundColor: `${textColor}05` }]} />
            </View>

            <View style={styles.cardTop}>
              <View>
                <Text style={[styles.previewBankName, { color: textColor }]}>
                  {selectedCard.name}
                </Text>
                <Text style={[styles.previewCardType, { color: `${textColor}99` }]}>
                  {selectedCard.type}
                </Text>
              </View>
              <View style={[styles.previewChip, { backgroundColor: `${chipColor}25` }]}>
                <View style={[styles.chipPattern, { borderColor: chipColor }]}>
                  <View style={[styles.chipInner, { backgroundColor: `${chipColor}40` }]} />
                </View>
              </View>
            </View>

            <View style={styles.cardMiddle}>
              <Text style={[styles.previewNumber, { color: textColor }]}>
                ••••  ••••  ••••  {lastFourDigits || '••••'}
              </Text>
            </View>

            <View style={styles.cardBottom}>
              <View>
                <Text style={[styles.cardLabel, { color: `${textColor}80` }]}>
                  CARD HOLDER
                </Text>
                <Text style={[styles.cardValue, { color: textColor }]}>
                  YOUR NAME
                </Text>
              </View>
              <View>
                <Text style={[styles.cardLabel, { color: `${textColor}80` }]}>
                  VALID THRU
                </Text>
                <Text style={[styles.cardValue, { color: textColor }]}>12/28</Text>
              </View>
            </View>

            <View style={styles.networkLogo}>
              {cardBranding.networkLogo === 'visa' ? (
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
          </LinearGradient>
        </View>
      </View>
    );
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

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={branding.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
            Select Your Card
          </Text>
          <Text style={[styles.headerSubtitle, { color: branding.textSecondary }]}>
            Step 2 of 2
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: branding.surfaceColor }]}>
          <LinearGradient
            colors={branding.primaryGradient.colors as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: '100%' }]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderCardPreview()}

        <Text style={[styles.sectionTitle, { color: branding.textPrimary }]}>
          Choose Card Type
        </Text>

        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.cardOption,
              { backgroundColor: branding.surfaceColor },
              selectedCard?.id === card.id && styles.cardOptionSelected,
            ]}
            onPress={() => setSelectedCard(card)}
          >
            <View style={styles.cardOptionContent}>
              <View style={styles.cardInfo}>
                <View style={styles.cardIcon}>
                  {selectedCard?.id === card.id ? (
                    <LinearGradient
                      colors={branding.primaryGradient.colors as [string, string]}
                      style={styles.selectedIcon}
                    >
                      <Ionicons name="checkmark" size={20} color="#060612" />
                    </LinearGradient>
                  ) : (
                    <View style={[styles.unselectedIcon, { borderColor: branding.textSecondary }]} />
                  )}
                </View>
                <View style={styles.cardDetails}>
                  <Text style={[styles.cardName, { color: branding.textPrimary }]}>
                    {card.name}
                  </Text>
                  <Text style={[styles.cardType, { color: branding.textSecondary }]}>
                    {card.type}
                  </Text>
                  <View style={styles.benefitsContainer}>
                    {card.benefits.slice(0, 2).map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={12} color={branding.success} />
                        <Text style={[styles.benefitText, { color: branding.textSecondary }]}>
                          {benefit}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {selectedCard && (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: branding.textPrimary }]}>
              Last 4 Digits of Your Card
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: branding.surfaceColor,
                  color: branding.textPrimary,
                  borderColor: branding.textSecondary,
                },
              ]}
              placeholder="1234"
              placeholderTextColor={branding.textSecondary}
              keyboardType="number-pad"
              maxLength={4}
              value={lastFourDigits}
              onChangeText={setLastFourDigits}
            />
          </View>
        )}
      </ScrollView>

      {selectedCard && lastFourDigits.length === 4 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddCard}
            disabled={adding}
          >
            <LinearGradient
              colors={branding.primaryGradient.colors as [string, string]}
              style={styles.addButtonGradient}
            >
              {adding ? (
                <ActivityIndicator color="#060612" />
              ) : (
                <>
                  <Ionicons name="add-circle" size={24} color="#060612" />
                  <Text style={styles.addButtonText}>Add Card to Wallet</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, paddingTop: 60 },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 12, marginTop: 4 },
  progressContainer: { paddingHorizontal: 24, paddingBottom: 24 },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%' },
  content: { padding: 24, paddingTop: 0 },
  previewSection: { marginBottom: 32 },
  previewLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 16 },
  cardPreviewContainer: { alignItems: 'center' },
  cardPreview: { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 20, padding: 24, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, overflow: 'hidden' },
  cardPattern: { position: 'absolute', top: 0, right: 0, width: '100%', height: '100%' },
  patternCircle: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80 },
  patternCircle2: { position: 'absolute', bottom: -60, left: -30, width: 200, height: 200, borderRadius: 100 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto', zIndex: 1 },
  previewBankName: { fontSize: 18, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  previewCardType: { fontSize: 11, textTransform: 'uppercase' },
  previewChip: { width: 50, height: 38, borderRadius: 8, padding: 6 },
  chipPattern: { flex: 1, borderRadius: 4, borderWidth: 1, padding: 2 },
  chipInner: { flex: 1, borderRadius: 2 },
  cardMiddle: { marginBottom: 20, zIndex: 1 },
  previewNumber: { fontSize: 24, fontWeight: '600', letterSpacing: 4 },
  cardBottom: { flexDirection: 'row', gap: 32, zIndex: 1 },
  cardLabel: { fontSize: 8, letterSpacing: 0.5, marginBottom: 4 },
  cardValue: { fontSize: 14, fontWeight: '600' },
  networkLogo: { position: 'absolute', bottom: 24, right: 24 },
  visaLogo: { width: 50, height: 16, flexDirection: 'row', gap: 4 },
  visaBar1: { flex: 1, borderRadius: 2, opacity: 0.6 },
  visaBar2: { flex: 1, borderRadius: 2, opacity: 0.8 },
  mastercardLogo: { flexDirection: 'row' },
  mcCircle1: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#EB001B' },
  mcCircle2: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F79E1B', marginLeft: -15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  cardOption: { padding: 20, borderRadius: 16, marginBottom: 16 },
  cardOptionSelected: { borderWidth: 2, borderColor: '#9BFF32' },
  cardOptionContent: { flexDirection: 'row', alignItems: 'flex-start' },
  cardInfo: { flexDirection: 'row', flex: 1 },
  cardIcon: { marginRight: 16 },
  selectedIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  unselectedIcon: { width: 32, height: 32, borderRadius: 16, borderWidth: 2 },
  cardDetails: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardType: { fontSize: 14, marginBottom: 12 },
  benefitsContainer: { gap: 6 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  benefitText: { fontSize: 12, flex: 1 },
  inputSection: { marginTop: 24 },
  inputLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  input: { fontSize: 18, padding: 16, borderRadius: 12, borderWidth: 1, letterSpacing: 4, textAlign: 'center' },
  footer: { padding: 24 },
  addButton: { borderRadius: 12, overflow: 'hidden' },
  addButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 },
  addButtonText: { fontSize: 18, fontWeight: '600', color: '#060612' },
});
