import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { verifyOTP, loginUserWithPhone } from '../../services/auth';

export default function VerifyPhoneScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phoneNumber = params.phoneNumber as string;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    if (loading) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode: string) => {
    if (loading) return;
    
    setLoading(true);

    try {
      console.log('Starting verification...');
      const isValid = await verifyOTP(phoneNumber, verificationCode);

      if (!isValid) {
        setLoading(false);
        Alert.alert('Invalid Code', 'The verification code you entered is incorrect. Please try again.');
        setCode(['', '', '', '', '', '']);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
        return;
      }

      console.log('OTP verified, checking login...');
      const loginResult = await loginUserWithPhone(phoneNumber);
      
      setLoading(false);

      if (loginResult.success) {
        console.log('Login successful, needs profile:', loginResult.needsProfile);
        
        if (loginResult.needsProfile) {
          router.replace({
            pathname: '/auth/setup-profile',
            params: { phoneNumber }
          });
        } else {
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Error', 'Failed to login. Please try again.');
        setCode(['', '', '', '', '', '']);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Verification error:', error);
      Alert.alert('Error', error.message || 'Verification failed. Please try again.');
      setCode(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#060612', '#0a0a1a', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Verify Phone Number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}{phoneNumber}
        </Text>
        <Text style={styles.hint}>
          (Check console logs for the OTP code)
        </Text>

        <View style={styles.otpContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={`otp-${index}`}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit !== '' && styles.otpInputFilled,
                loading && styles.otpInputDisabled
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!loading}
              autoComplete="sms-otp"
            />
          ))}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#9BFF32" size="small" />
            <Text style={styles.loadingText}>Verifying...</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.resendButton}
          disabled={loading}
          onPress={() => {
            Alert.alert('Resend Code', 'Check console logs for new OTP');
          }}
        >
          <Text style={styles.resendText}>Didn't receive code? Resend</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060612',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  hint: {
    fontSize: 12,
    color: '#9BFF32',
    marginBottom: 48,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#2a2a2a',
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#9BFF32',
    backgroundColor: '#1a2a1a',
  },
  otpInputDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  loadingText: {
    color: '#9BFF32',
    fontSize: 14,
  },
  resendButton: {
    marginTop: 24,
    alignItems: 'center',
    padding: 12,
  },
  resendText: {
    color: '#9BFF32',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 24,
    alignItems: 'center',
    padding: 12,
  },
  backText: {
    color: '#666666',
    fontSize: 14,
  },
});
