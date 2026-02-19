import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { sendVerificationEmail, checkEmailVerification } from '../../services/auth';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Auto-send verification email
    handleSendEmail();
  }, []);

  async function handleSendEmail() {
    try {
      setResending(true);
      await sendVerificationEmail();
      Alert.alert('Email Sent', 'Please check your inbox and spam folder');
    } catch (error: any) {
      console.error('Send email error:', error);
      // Don't block user if email fails
      Alert.alert(
        'Continue Anyway?',
        'Email verification is optional. You can verify later in settings.',
        [
          { text: 'Verify Later', onPress: () => router.replace('/(tabs)') },
          { text: 'Try Again', onPress: handleSendEmail }
        ]
      );
    } finally {
      setResending(false);
    }
  }

  async function handleCheckVerification() {
    setChecking(true);

    try {
      const verified = await checkEmailVerification();
      
      if (verified) {
        Alert.alert('Success!', 'Email verified successfully', [
          { text: 'Continue', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        Alert.alert('Not Verified', 'Please click the link in your email');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check verification status');
    } finally {
      setChecking(false);
    }
  }

  function handleSkip() {
    Alert.alert(
      'Skip Verification?',
      'You can verify your email later in Profile settings',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => router.replace('/(tabs)') }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#060612', '#1a1a2e', '#060612']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#9BFF32', '#3DEEFF']}
            style={styles.iconGradient}
          >
            <Ionicons name="mail" size={64} color="#060612" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification link to your email. Please check your inbox and spam folder.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCheckVerification}
          disabled={checking}
        >
          <LinearGradient
            colors={['#9BFF32', '#3DEEFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {checking ? (
              <ActivityIndicator color="#060612" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#060612" />
                <Text style={styles.buttonText}>I've Verified</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleSendEmail}
          disabled={resending}
        >
          <View style={styles.secondaryButtonContent}>
            {resending ? (
              <ActivityIndicator color="#9BFF32" />
            ) : (
              <>
                <Ionicons name="refresh" size={24} color="#9BFF32" />
                <Text style={styles.secondaryButtonText}>Resend Email</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  iconContainer: { marginBottom: 32 },
  iconGradient: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', marginBottom: 48, lineHeight: 24 },
  button: { width: '100%', marginBottom: 16, borderRadius: 12, overflow: 'hidden' },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#060612' },
  secondaryButton: { backgroundColor: '#1a1a2e' },
  secondaryButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 },
  secondaryButtonText: { fontSize: 18, fontWeight: 'bold', color: '#9BFF32' },
  skipText: { fontSize: 16, color: '#6B7280', marginTop: 24 },
});
