import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { loginUserWithPhone } from '../../services/auth';

export default function VerifyPhoneScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phoneNumber = params.phoneNumber as string;
  const devOtp = params.devOtp as string; // Development OTP passed via params

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleCodeChange(text: string, index: number) {
    if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== '') && !loading) {
      handleVerify(newCode.join(''));
    }
  }

  function handleKeyPress(e: any, index: number) {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify(otp: string) {
    setLoading(true);
    
    try {
      console.log('Verifying:', otp, 'vs', devOtp);
      
      // In development, check against the passed OTP
      if (otp !== devOtp) {
        setLoading(false);
        Alert.alert(
          'Invalid Code',
          'The verification code is incorrect. Check your terminal.',
          [
            {
              text: 'OK',
              onPress: () => {
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
              }
            }
          ]
        );
        return;
      }

      const loginResult = await loginUserWithPhone(phoneNumber);
      setLoading(false);

      if (loginResult.success) {
        if (loginResult.isNewUser) {
          router.replace('/auth/setup-profile');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert(
          'Login Failed',
          loginResult.error || 'Failed to complete login. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Verification error:', error);
      Alert.alert('Error', 'An unexpected error occurred.', [{ text: 'OK' }]);
    }
  }

  async function handleResend() {
    if (timer > 0) return;
    
    // Just reset and go back
    router.back();
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

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#F9F9F9" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['rgba(155, 255, 50, 0.15)', 'rgba(61, 238, 255, 0.15)']}
            style={styles.iconCircle}
          >
            <Ionicons name="phone-portrait" size={48} color="#9BFF32" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                loading && styles.otpInputDisabled,
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              editable={!loading}
              selectTextOnFocus
            />
          ))}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#9BFF32" />
            <Text style={styles.loadingText}>Verifying...</Text>
          </View>
        )}

        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend code in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={loading}>
              <Text style={[styles.resendButton, loading && styles.resendButtonDisabled]}>
                Resend Code
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            (code.some((d) => !d) || loading) && styles.verifyButtonDisabled,
          ]}
          disabled={code.some((d) => !d) || loading}
          onPress={() => handleVerify(code.join(''))}
        >
          <LinearGradient
            colors={
              code.every((d) => d) && !loading
                ? ['#9BFF32', '#3DEEFF']
                : ['#383841', '#6A6A71']
            }
            style={styles.verifyGradient}
          >
            {loading ? (
              <ActivityIndicator color="#060612" />
            ) : (
              <Text style={styles.verifyText}>Verify & Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} disabled={loading}>
          <Text style={[styles.changeNumber, loading && styles.changeNumberDisabled]}>
            Change Phone Number
          </Text>
        </TouchableOpacity>

        <View style={styles.helpContainer}>
          <Ionicons name="information-circle-outline" size={16} color="#888" />
          <Text style={styles.helpText}>
            Check your terminal/console for the OTP code.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { position: 'absolute', top: 60, left: 24, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 24, paddingTop: 140, alignItems: 'center' },
  iconContainer: { marginBottom: 32 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F9F9F9', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  phoneNumber: { color: '#9BFF32', fontWeight: '600' },
  otpContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  otpInput: { width: 50, height: 60, borderRadius: 12, backgroundColor: '#1a1a1a', borderWidth: 2, borderColor: '#333', fontSize: 24, fontWeight: 'bold', color: '#F9F9F9', textAlign: 'center' },
  otpInputFilled: { borderColor: '#9BFF32', backgroundColor: 'rgba(155, 255, 50, 0.1)' },
  otpInputDisabled: { opacity: 0.5 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  loadingText: { fontSize: 14, color: '#9BFF32', fontWeight: '600' },
  resendContainer: { marginBottom: 32 },
  timerText: { fontSize: 14, color: '#888' },
  resendButton: { fontSize: 14, color: '#9BFF32', fontWeight: '600' },
  resendButtonDisabled: { opacity: 0.5 },
  verifyButton: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  verifyButtonDisabled: { opacity: 0.5 },
  verifyGradient: { padding: 20, alignItems: 'center' },
  verifyText: { fontSize: 18, fontWeight: '600', color: '#060612' },
  changeNumber: { fontSize: 14, color: '#9BFF32', fontWeight: '600', marginBottom: 24 },
  changeNumberDisabled: { opacity: 0.5 },
  helpContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 16, borderRadius: 12, maxWidth: '100%' },
  helpText: { fontSize: 12, color: '#888', flex: 1, lineHeight: 18 },
});
