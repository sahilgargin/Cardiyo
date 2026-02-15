import { auth, db } from '../firebaseConfig';
import { 
  signInAnonymously,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function loginUserWithPhone(
  phoneNumber: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Sign in anonymously (this always works)
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(doc(db, 'users', user.uid), {
        phoneNumber: phoneNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update display name with phone
      await updateProfile(user, { 
        displayName: phoneNumber 
      });
    } else {
      // Update existing user's phone if different
      const userData = userDoc.data();
      if (userData.phoneNumber !== phoneNumber) {
        await setDoc(doc(db, 'users', user.uid), {
          phoneNumber: phoneNumber,
          updatedAt: serverTimestamp(),
        }, { merge: true });

        await updateProfile(user, { 
          displayName: phoneNumber 
        });
      }
    }

    console.log('✅ User logged in:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to login' 
    };
  }
}
