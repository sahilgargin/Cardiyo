import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getAllAreas, Area } from '../services/location';
import { getAppBranding, AppBranding } from '../services/branding';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

export default function SelectAreaScreen() {
  const router = useRouter();
  const [branding, setBranding] = useState<AppBranding | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredAreas(areas.filter(area => 
        area.name.toLowerCase().includes(search.toLowerCase())
      ));
    } else {
      setFilteredAreas(areas);
    }
  }, [search, areas]);

  async function loadData() {
    const app = await getAppBranding();
    setBranding(app);

    const allAreas = await getAllAreas();
    setAreas(allAreas);
    setFilteredAreas(allAreas);
    setLoading(false);
  }

  async function handleSelectArea(area: Area) {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        area: area.name,
        areaId: area.id,
      });

      router.back();
    } catch (error) {
      console.error('Error saving area:', error);
    } finally {
      setSaving(false);
    }
  }

  if (!branding || loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#9BFF32" /></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: branding.backgroundColor }]}>
      <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={branding.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: branding.textPrimary }]}>
          Select Area
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={branding.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: branding.textPrimary }]}
          placeholder="Search areas..."
          placeholderTextColor={branding.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredAreas.map((area) => (
          <TouchableOpacity
            key={area.id}
            style={[styles.areaCard, { backgroundColor: branding.surfaceColor }]}
            onPress={() => handleSelectArea(area)}
            disabled={saving}
          >
            <View style={[styles.areaIcon, { backgroundColor: branding.primaryColor + '20' }]}>
              <Ionicons name="location" size={24} color={branding.primaryColor} />
            </View>
            <View style={styles.areaInfo}>
              <Text style={[styles.areaName, { color: branding.textPrimary }]}>
                {area.name}
              </Text>
              <Text style={[styles.areaCity, { color: branding.textSecondary }]}>
                {area.city}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={branding.textSecondary} />
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
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginBottom: 16, backgroundColor: '#1a1a2e', borderRadius: 12, paddingHorizontal: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  content: { padding: 24, paddingTop: 0 },
  areaCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12 },
  areaIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  areaInfo: { flex: 1 },
  areaName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  areaCity: { fontSize: 14 },
});
