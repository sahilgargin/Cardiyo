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
  const correctOTP = params.otp as string;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
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
      if (otp !== correctOTP) {
        setLoading(false);
        Alert.alert(
          'Invalid Code',
          'The verification code you entered is incorrect.',
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
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Login Failed',
          loginResult.error || 'Failed to complete login.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Verification error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
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
          Enter the 6-digit code for{'\n'}
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

        <TouchableOpacity onPress={() => router.back()} disabled={loading}>
          <Text style={[styles.changeNumber, loading && styles.changeNumberDisabled]}>
            Change Phone Number
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 140,
    alignItems: 'center',
  },
  iconContainer: { marginBottom: 32 },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F9F9F9',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  phoneNumber: {
    color: '#9BFF32',
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9F9F9',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#9BFF32',
    backgroundColor: 'rgba(155, 255, 50, 0.1)',
  },
  otpInputDisabled: { opacity: 0.5 },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#9BFF32',
    fontWeight: '600',
  },
  changeNumber: {
    fontSize: 14,
    color: '#9BFF32',
    fontWeight: '600',
    marginBottom: 24,
  },
  changeNumberDisabled: { opacity: 0.5 },
});
