import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { createUserProfile } from '../../services/auth';

const COUNTRIES = [
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
];

export default function SetupProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('AE');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinue = async () => {
    // Validation
    if (!firstName.trim()) {
      Alert.alert('Required', 'Please enter your first name');
      return;
    }

    if (!lastName.trim()) {
      Alert.alert('Required', 'Please enter your last name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Required', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await createUserProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        country: selectedCountry,
      });

      // Go to email verification
      router.replace('/auth/verify-email');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = firstName.trim() && lastName.trim() && email.trim() && validateEmail(email);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="person" size={32} color="#9BFF32" />
          </View>
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>
            We need a few details to set up your account
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>
              First Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor="#666666"
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              placeholderTextColor="#666666"
              value={lastName}
              onChangeText={setLastName}
              editable={!loading}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Email Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="john.doe@example.com"
              placeholderTextColor="#666666"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>
              We'll send a verification email to confirm your address
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Country</Text>
            <View style={styles.countryContainer}>
              {COUNTRIES.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={[
                    styles.countryOption,
                    selectedCountry === country.code && styles.countryOptionSelected
                  ]}
                  onPress={() => setSelectedCountry(country.code)}
                  disabled={loading}
                >
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={[
                    styles.countryName,
                    selectedCountry === country.code && styles.countryNameSelected
                  ]}>
                    {country.name}
                  </Text>
                  {selectedCountry === country.code && (
                    <Ionicons name="checkmark-circle" size={20} color="#9BFF32" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!isFormValid || loading) && styles.buttonDisabled
          ]}
          onPress={handleContinue}
          disabled={!isFormValid || loading}
        >
          <LinearGradient
            colors={['#9BFF32', '#3DEEFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {loading ? (
              <Text style={styles.buttonText}>Setting up...</Text>
            ) : (
              <>
                <Text style={styles.buttonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#060612" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060612' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(155, 255, 50, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#999999', textAlign: 'center', lineHeight: 22 },
  form: { marginBottom: 32 },
  field: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 12 },
  required: { color: '#FF6B6B' },
  input: { backgroundColor: '#1a1a1a', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 16, fontSize: 16, color: '#FFFFFF', borderWidth: 2, borderColor: '#2a2a2a' },
  hint: { fontSize: 12, color: '#666666', marginTop: 8, lineHeight: 16 },
  countryContainer: { gap: 12 },
  countryOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 16, borderRadius: 16, gap: 12, borderWidth: 2, borderColor: '#2a2a2a' },
  countryOptionSelected: { borderColor: '#9BFF32', backgroundColor: 'rgba(155, 255, 50, 0.05)' },
  countryFlag: { fontSize: 24 },
  countryName: { flex: 1, fontSize: 16, color: '#FFFFFF' },
  countryNameSelected: { color: '#9BFF32', fontWeight: '600' },
  button: { borderRadius: 16, overflow: 'hidden', elevation: 4, shadowColor: '#9BFF32', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  buttonDisabled: { opacity: 0.5, elevation: 0, shadowOpacity: 0 },
  buttonGradient: { flexDirection: 'row', paddingVertical: 18, alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#060612' },
});
