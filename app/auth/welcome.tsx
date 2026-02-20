import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { sendOTP } from '../../services/auth';
import { Svg, Path, Rect, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

export default function WelcomeScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!phoneNumber || phoneNumber.length < 9) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const fullNumber = phoneNumber.startsWith('971') ? `+${phoneNumber}` : `+971${phoneNumber}`;
      await sendOTP(fullNumber);
      router.push({
        pathname: '/auth/verify-phone',
        params: { phoneNumber: fullNumber }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#060612', '#1a1a2e', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Professional Logo */}
        <View style={styles.logoContainer}>
          <Svg width="120" height="120" viewBox="0 0 200 200">
            <Defs>
              <SvgLinearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#9BFF32" />
                <Stop offset="1" stopColor="#3DEEFF" />
              </SvgLinearGradient>
            </Defs>
            <Rect x="30" y="60" width="140" height="90" rx="12" fill="url(#gradient)" opacity="0.2"/>
            <Rect x="30" y="60" width="140" height="90" rx="12" fill="none" stroke="url(#gradient)" strokeWidth="3"/>
            <Rect x="45" y="75" width="30" height="25" rx="4" fill="url(#gradient)"/>
            <Path d="M 140 85 Q 145 80, 150 85 T 160 85" stroke="url(#gradient)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <Path d="M 140 95 Q 145 90, 150 95 T 160 95" stroke="url(#gradient)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <Path d="M 140 105 Q 145 100, 150 105 T 160 105" stroke="url(#gradient)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <Circle cx="45" cy="120" r="2" fill="url(#gradient)"/>
            <Circle cx="55" cy="120" r="2" fill="url(#gradient)"/>
            <Circle cx="65" cy="120" r="2" fill="url(#gradient)"/>
            <Circle cx="75" cy="120" r="2" fill="url(#gradient)"/>
          </Svg>
        </View>

        <Text style={styles.brand}>Cardiyo</Text>
        <Text style={styles.tagline}>Smart credit card management</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>🇦🇪 +971</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="50 123 4567"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={9}
            />
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
              <Text style={styles.buttonText}>
                {loading ? 'Sending OTP...' : 'Continue'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  brand: { fontSize: 48, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 8, letterSpacing: -1 },
  tagline: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', marginBottom: 64 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 12, letterSpacing: 0.5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  countryCode: { backgroundColor: '#1a1a2e', paddingHorizontal: 16, paddingVertical: 18, borderRadius: 12, marginRight: 12 },
  countryCodeText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  input: { flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 20, paddingVertical: 18, borderRadius: 12, fontSize: 16, color: '#FFFFFF', fontWeight: '500' },
  button: { borderRadius: 12, overflow: 'hidden', marginBottom: 24, elevation: 8, shadowColor: '#9BFF32', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  buttonGradient: { paddingVertical: 18, alignItems: 'center' },
  buttonText: { fontSize: 18, fontWeight: '700', color: '#060612', letterSpacing: 0.5 },
  terms: { fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 18 },
});
