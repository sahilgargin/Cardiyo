import { auth, db } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function createUserAccount(
  phoneNumber: string,
  name?: string
): Promise<{ success: boolean; user?: User; error?: string; isNewUser: boolean }> {
  try {
    const email = `${phoneNumber.replace('+', '')}@cardiyo.app`;
    const password = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (name) {
      await updateProfile(user, { displayName: name });
    }

    await setDoc(doc(db, 'users', user.uid), {
      phoneNumber: phoneNumber,
      email: email,
      displayName: name || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      profileComplete: false,
    });

    return { success: true, user, isNewUser: true };
  } catch (error: any) {
    console.error('Create user error:', error);
    return { success: false, error: error.message, isNewUser: false };
  }
}

export async function loginUserWithPhone(
  phoneNumber: string
): Promise<{ success: boolean; user?: User; error?: string; isNewUser: boolean }> {
  try {
    const email = `${phoneNumber.replace('+', '')}@cardiyo.app`;
    
    // Check if user exists in Firestore
    const userSnapshot = await getDoc(doc(db, 'users', phoneNumber.replace(/\+/g, '_')));
    
    if (userSnapshot.exists()) {
      // Existing user - try to sign in
      const userData = userSnapshot.data();
      const password = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16);
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user, isNewUser: false };
      } catch (signInError: any) {
        // If sign in fails but user exists, create new auth account
        return await createUserAccount(phoneNumber);
      }
    } else {
      // New user
      return await createUserAccount(phoneNumber);
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: error.message, isNewUser: false };
  }
}
