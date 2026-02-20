import { auth, db } from '../firebaseConfig';
import { 
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  sendEmailVerification as firebaseSendEmailVerification,
  updateProfile,
  updateEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Platform } from 'react-native';

const DEV_MODE = __DEV__;

let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;
const devOtpStore: { [phone: string]: { code: string; timestamp: number } } = {};

export async function sendOTP(phoneNumber: string): Promise<boolean> {
  try {
    console.log('🔐 Sending OTP to:', phoneNumber);
    
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+971${phoneNumber}`;
    
    if (DEV_MODE && Platform.OS !== 'web') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      devOtpStore[formattedPhone] = {
        code: otp,
        timestamp: Date.now()
      };
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📱 DEVELOPMENT OTP');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Phone:', formattedPhone);
      console.log('Code: ', otp);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return true;
    }
    
    if (Platform.OS === 'web') {
      if (!recaptchaVerifier) {
        const container = document.getElementById('recaptcha-container');
        if (!container) {
          const div = document.createElement('div');
          div.id = 'recaptcha-container';
          div.style.position = 'absolute';
          div.style.top = '-9999px';
          document.body.appendChild(div);
        }
        
        recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }
      
      confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      return true;
    }
    
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, undefined as any);
    return true;
  } catch (error: any) {
    console.error('Send OTP error:', error);
    throw error;
  }
}

export async function verifyOTP(phoneNumber: string, code: string): Promise<boolean> {
  try {
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+971${phoneNumber}`;
    
    if (DEV_MODE && Platform.OS !== 'web') {
      const stored = devOtpStore[formattedPhone];
      
      if (!stored || code !== stored.code) {
        throw new Error('Invalid verification code');
      }
      
      if (Date.now() - stored.timestamp > 5 * 60 * 1000) {
        delete devOtpStore[formattedPhone];
        throw new Error('OTP expired');
      }
      
      // Create anonymous account
      const { signInAnonymously } = await import('firebase/auth');
      await signInAnonymously(auth);
      
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          phoneNumber: formattedPhone,
          phoneVerified: true,
          createdAt: serverTimestamp(),
        });
      }
      
      delete devOtpStore[formattedPhone];
      return true;
    }
    
    if (!confirmationResult) {
      throw new Error('No verification in progress');
    }
    
    await confirmationResult.confirm(code);
    confirmationResult = null;
    return true;
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    throw new Error(error.message || 'Verification failed');
  }
}

export async function loginUserWithPhone(phoneNumber: string): Promise<{ 
  success: boolean; 
  needsProfile: boolean;
  needsEmailVerification: boolean;
}> {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return { success: false, needsProfile: false, needsEmailVerification: false };
    }
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      return { success: true, needsProfile: true, needsEmailVerification: false };
    }
    
    const userData = userDoc.data();
    
    // User has complete profile - let them in
    if (userData.firstName && userData.lastName && userData.email) {
      console.log('✅ Returning user with complete profile');
      return { 
        success: true, 
        needsProfile: false,
        needsEmailVerification: false
      };
    }
    
    const needsProfile = !userData.firstName || !userData.lastName || !userData.email;
    const needsEmailVerification = userData.email && !userData.emailVerified;
    
    return { 
      success: true, 
      needsProfile,
      needsEmailVerification
    };
  } catch (error) {
    console.error('Login check error:', error);
    return { success: false, needsProfile: false, needsEmailVerification: false };
  }
}

export async function createUserProfile(data: {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
}): Promise<boolean> {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    await updateProfile(user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });
    
    const existingDoc = await getDoc(doc(db, 'users', user.uid));
    const phoneNumber = existingDoc.exists() ? existingDoc.data().phoneNumber : null;
    
    await setDoc(doc(db, 'users', user.uid), {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      country: data.country,
      phoneNumber,
      phoneVerified: true,
      emailVerified: false,
      onboarded: true,
      createdAt: existingDoc.exists() ? existingDoc.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('✅ Profile created');
    return true;
  } catch (error) {
    console.error('Create profile error:', error);
    throw error;
  }
}

export async function sendVerificationEmail(): Promise<boolean> {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    console.log('📧 Current user state:', {
      uid: user.uid,
      email: user.email,
      isAnonymous: user.isAnonymous,
      emailVerified: user.emailVerified
    });
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists() || !userDoc.data().email) {
      throw new Error('No email found in profile');
    }
    
    const email = userDoc.data().email;
    console.log('📧 Email from Firestore:', email);
    
    // If anonymous user, update their email directly
    if (user.isAnonymous) {
      try {
        console.log('🔗 Updating email for anonymous user...');
        await updateEmail(user, email);
        console.log('✅ Email updated successfully');
      } catch (updateError: any) {
        console.error('❌ Update email error:', updateError.code, updateError.message);
        
        if (updateError.code === 'auth/email-already-in-use') {
          throw new Error('This email is already registered to another account. Please use a different email or sign in with that account.');
        }
        
        if (updateError.code === 'auth/requires-recent-login') {
          throw new Error('For security, please sign in again to verify your email.');
        }
        
        throw updateError;
      }
    }
    
    // Send verification email
    console.log('📤 Sending verification email...');
    await firebaseSendEmailVerification(user);
    console.log('✅ Verification email sent to:', email);
    
    return true;
  } catch (error: any) {
    console.error('❌ Send email verification error:', error);
    throw error;
  }
}

export async function checkEmailVerification(): Promise<boolean> {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return false;
    }
    
    await user.reload();
    
    if (user.emailVerified) {
      await updateDoc(doc(db, 'users', user.uid), {
        emailVerified: true,
        emailVerifiedAt: serverTimestamp(),
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Check email verification error:', error);
    return false;
  }
}

export async function getUserProfile(): Promise<any | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return { id: user.uid, ...userDoc.data() };
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export async function resendOTP(phoneNumber: string): Promise<boolean> {
  confirmationResult = null;
  return await sendOTP(phoneNumber);
}

export async function logout(): Promise<void> {
  try {
    await auth.signOut();
    confirmationResult = null;
    recaptchaVerifier = null;
    Object.keys(devOtpStore).forEach(key => delete devOtpStore[key]);
    console.log('✅ Signed out');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function isAuthenticated(): boolean {
  return !!auth.currentUser;
}
