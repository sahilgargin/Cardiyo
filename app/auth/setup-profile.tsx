import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../../firebaseConfig';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const COUNTRIES = [
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
];

export default function SetupProfileScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('AE');
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!firstName.trim()) {
      alert('Please enter your first name');
      return;
    }

    setLoading(true);
    const user = auth.currentUser;
    
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();
      
      // Update Firebase Auth profile
      await updateProfile(user, { displayName });

      // Update Firestore user document
      await setDoc(doc(db, 'users', user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || null,
        country: selectedCountry,
        phoneNumber: user.phoneNumber,
        displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setLoading(false);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Profile setup error:', error);
      setLoading(false);
      alert('Failed to save profile. Please try again.');
    }
  }

  const country = COUNTRIES.find(c => c.code === selectedCountry)!;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#9BFF32', '#3DEEFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Ionicons name="person" size={48} color="#060612" />
          </LinearGradient>
        </View>

        {/* Title */}
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Help us personalize your experience
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Country */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country</Text>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerFlag}>{country.flag}</Text>
              <Picker
                selectedValue={selectedCountry}
                onValueChange={setSelectedCountry}
                style={styles.picker}
                enabled={!loading}
              >
                {COUNTRIES.map((c) => (
                  <Picker.Item
                    key={c.code}
                    label={`${c.flag} ${c.name}`}
                    value={c.code}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, (!firstName.trim() || loading) && styles.continueButtonDisabled]}
          disabled={!firstName.trim() || loading}
          onPress={handleContinue}
        >
          <LinearGradient
            colors={firstName.trim() && !loading ? ['#9BFF32', '#3DEEFF'] : ['#383841', '#6A6A71']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueGradient}
          >
            {loading ? (
              <ActivityIndicator color="#060612" />
            ) : (
              <>
                <Text style={styles.continueText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#060612" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} disabled={loading}>
          <Text style={[styles.skipText, loading && styles.skipTextDisabled]}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 80 },
  iconContainer: { alignItems: 'center', marginBottom: 32 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#9BFF32', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F9F9F9', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 40 },
  form: { marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#F9F9F9', marginBottom: 8 },
  input: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333', borderRadius: 12, padding: 16, fontSize: 16, color: '#F9F9F9' },
  pickerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333', borderRadius: 12, paddingLeft: 16 },
  pickerFlag: { fontSize: 24, marginRight: 8 },
  picker: { flex: 1, color: '#F9F9F9' },
  continueButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  continueButtonDisabled: { opacity: 0.5 },
  continueGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 12 },
  continueText: { fontSize: 18, fontWeight: '600', color: '#060612' },
  skipText: { fontSize: 14, color: '#9BFF32', fontWeight: '600', textAlign: 'center' },
  skipTextDisabled: { opacity: 0.5 },
});
