import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { createUserProfile, sendVerificationEmail } from '../../services/auth';

const COUNTRIES = [
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'UK', name: 'UK', flag: '🇬🇧' },
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('AE');
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!firstName || !lastName || !email) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      console.log('Creating profile...');
      await createUserProfile({
        firstName,
        lastName,
        email,
        country,
      });

      console.log('Profile created');
      
      try {
        await sendVerificationEmail();
      } catch (emailError) {
        console.log('Email verification skipped:', emailError);
      }

      console.log('Navigating to app...');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Profile setup error:', error);
      Alert.alert('Error', error.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Just a few details to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor="#6B7280"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              placeholderTextColor="#6B7280"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country</Text>
            <View style={styles.countryGrid}>
              {COUNTRIES.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={[
                    styles.countryChip,
                    country === c.code && styles.countryChipSelected
                  ]}
                  onPress={() => setCountry(c.code)}
                >
                  <Text style={styles.countryFlag}>{c.flag}</Text>
                  <Text style={[
                    styles.countryName,
                    country === c.code && styles.countryNameSelected
                  ]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleContinue}
            disabled={loading}
          >
            <LinearGradient
              colors={['#9BFF32', '#3DEEFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#060612" />
              ) : (
                <Text style={styles.buttonText}>Continue to App</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#9CA3AF' },
  form: {},
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 8 },
  input: { backgroundColor: '#1a1a2e', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 12, fontSize: 16, color: '#FFFFFF' },
  countryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  countryChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a2e', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, gap: 6 },
  countryChipSelected: { backgroundColor: '#9BFF32' },
  countryFlag: { fontSize: 20 },
  countryName: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  countryNameSelected: { color: '#060612', fontWeight: '700' },
  button: { borderRadius: 12, overflow: 'hidden', marginTop: 30 },
  buttonGradient: { paddingVertical: 18, alignItems: 'center' },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#060612' },
});
