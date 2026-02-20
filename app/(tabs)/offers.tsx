import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getAppBranding, AppBranding, getAllCategories, Category } from '../../services/branding';

export default function OffersScreen() {
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const app = await getAppBranding();
      setBranding(app);

      const cats = await getAllCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error in loadData:', error);
    } finally {
      setLoading(false);
    }
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
      <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>Offers</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        <View style={styles.categories}>
          <TouchableOpacity
            style={[
              styles.categoryChip,
              { backgroundColor: !selectedCategory ? branding.primaryColor : branding.surfaceColor }
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              styles.categoryChipText,
              { color: !selectedCategory ? '#060612' : branding.textPrimary }
            ]}>
              All
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                { backgroundColor: selectedCategory === category.id ? branding.primaryColor : branding.surfaceColor }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={16} 
                color={selectedCategory === category.id ? '#060612' : category.color} 
              />
              <Text style={[
                styles.categoryChipText,
                { color: selectedCategory === category.id ? '#060612' : branding.textPrimary }
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.emptyContainer}>
          <Ionicons name="pricetag-outline" size={80} color={branding.textSecondary} />
          <Text style={[styles.emptyText, { color: branding.textPrimary }]}>
            No Offers Available
          </Text>
          <Text style={[styles.emptySubtext, { color: branding.textSecondary }]}>
            Check back soon for exclusive deals
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  categoriesScroll: { maxHeight: 50, marginBottom: 16 },
  categories: { flexDirection: 'row', paddingHorizontal: 24, gap: 8 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 6 },
  categoryChipText: { fontSize: 14, fontWeight: '600' },
  content: { flex: 1, padding: 24 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 100 },
  emptyText: { fontSize: 24, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptySubtext: { fontSize: 16, textAlign: 'center' },
});
