import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSkip() {
    router.replace('/(tabs)');
  }

  async function handleContinue() {
    if (phoneNumber.length < 9) return;

    setLoading(true);
    const fullPhoneNumber = '+971' + phoneNumber;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 OTP for', fullPhoneNumber);
    console.log('🔢 CODE:', otp);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    setLoading(false);

    // Show OTP in alert
    Alert.alert(
      'OTP Code',
      `Your verification code is: ${otp}\n\n(In production, this will be sent via SMS)`,
      [
        {
          text: 'OK',
          onPress: () => {
            try {
              router.push(`/auth/verify-phone?phoneNumber=${fullPhoneNumber}&otp=${otp}`);
            } catch (error) {
              console.error('Navigation error:', error);
            }
          }
        }
      ]
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={['#9BFF32', '#3DEEFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoCircle}
          >
            <Text style={styles.logoLetter}>C</Text>
          </LinearGradient>
          <Text style={styles.logoText}>CARDIYO</Text>
          <View style={styles.divider} />
        </View>

        {/* Hero Text */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Maximize Your{'\n'}Credit Card Rewards
          </Text>
          <Text style={styles.heroSubtitle}>
            Discover personalized offers and never miss{'\n'}a reward opportunity again
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <LinearGradient
              colors={['rgba(155, 255, 50, 0.15)', 'rgba(61, 238, 255, 0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureIcon}
            >
              <Ionicons name="location" size={24} color="#9BFF32" />
            </LinearGradient>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Location-Based Offers</Text>
              <Text style={styles.featureDescription}>
                Get deals near you in real-time
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <LinearGradient
              colors={['rgba(255, 151, 235, 0.15)', 'rgba(217, 148, 255, 0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureIcon}
            >
              <Ionicons name="wallet" size={24} color="#FF97EB" />
            </LinearGradient>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>All Cards, One Place</Text>
              <Text style={styles.featureDescription}>
                Manage all your credit cards together
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <LinearGradient
              colors={['rgba(255, 239, 160, 0.15)', 'rgba(255, 169, 124, 0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureIcon}
            >
              <Ionicons name="trophy" size={24} color="#FFEFA0" />
            </LinearGradient>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Maximize Rewards</Text>
              <Text style={styles.featureDescription}>
                Earn more points on every purchase
              </Text>
            </View>
          </View>
        </View>

        {/* Phone Input */}
        <View style={styles.phoneSection}>
          <Text style={styles.label}>Enter your mobile number</Text>
          <View style={styles.phoneContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>🇦🇪</Text>
              <Text style={styles.code}>+971</Text>
              <Ionicons name="chevron-down" size={16} color="#888" />
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="50 123 4567"
              placeholderTextColor="#888"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={9}
              editable={!loading}
            />
          </View>
          
          {/* Development Note */}
          <View style={styles.devNote}>
            <Ionicons name="information-circle" size={16} color="#9BFF32" />
            <Text style={styles.devNoteText}>
              Development mode: OTP will show in popup
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (phoneNumber.length < 9 || loading) && styles.continueButtonDisabled
          ]}
          disabled={phoneNumber.length < 9 || loading}
          onPress={handleContinue}
        >
          <LinearGradient
            colors={
              phoneNumber.length >= 9 && !loading
                ? ['#9BFF32', '#3DEEFF']
                : ['#383841', '#6A6A71']
            }
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

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skipText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 24,
    paddingTop: 120,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#9BFF32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  logoLetter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#060612',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F9F9F9',
    letterSpacing: 3,
    marginBottom: 8,
  },
  divider: {
    width: 100,
    height: 3,
    backgroundColor: '#9BFF32',
    borderRadius: 2,
    transform: [{ skewX: '-10deg' }],
  },
  heroSection: {
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F9F9F9',
    marginBottom: 16,
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
  },
  features: {
    marginBottom: 40,
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9F9F9',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  phoneSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#F9F9F9',
    marginBottom: 12,
    fontWeight: '600',
  },
  phoneContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRightWidth: 1,
    borderRightColor: '#333',
    gap: 8,
  },
  flag: {
    fontSize: 20,
  },
  code: {
    fontSize: 16,
    color: '#F9F9F9',
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#F9F9F9',
  },
  devNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(155, 255, 50, 0.1)',
    borderRadius: 8,
  },
  devNoteText: {
    fontSize: 12,
    color: '#9BFF32',
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  continueText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#060612',
  },
  terms: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#9BFF32',
    textDecorationLine: 'underline',
  },
});
