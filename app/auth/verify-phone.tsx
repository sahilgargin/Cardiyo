import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { verifyOTP, loginUserWithPhone, resendOTP } from '../../services/auth';

export default function VerifyPhoneScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit code');
      return;
    }

    setLoading(true);

    try {
      console.log('Starting verification...');
      await verifyOTP(phoneNumber as string, otp);
      
      console.log('OTP verified, checking login...');
      const result = await loginUserWithPhone(phoneNumber as string);
      
      console.log('Login result:', result);

      if (result.needsProfile) {
        console.log('Needs profile');
        router.replace('/auth/profile-setup');
      } else {
        console.log('Profile complete, going to app');
        // Skip email verification, go straight to app
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert('Verification Failed', error.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await resendOTP(phoneNumber as string);
      Alert.alert('Code Resent', 'Please check your messages');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend code');
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter Code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to {phoneNumber}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="000000"
          placeholderTextColor="#6B7280"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          autoFocus
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
          <LinearGradient colors={['#9BFF32', '#3DEEFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGradient}>
            {loading ? (
              <ActivityIndicator color="#060612" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendText}>Didn't receive code? Resend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#9CA3AF', marginBottom: 48 },
  input: { backgroundColor: '#1a1a2e', padding: 20, borderRadius: 12, fontSize: 32, color: '#FFFFFF', textAlign: 'center', letterSpacing: 16, marginBottom: 24, fontWeight: 'bold' },
  button: { borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
  buttonGradient: { paddingVertical: 18, alignItems: 'center' },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#060612' },
  resendText: { fontSize: 14, color: '#9BFF32', textAlign: 'center', fontWeight: '600' },
});
