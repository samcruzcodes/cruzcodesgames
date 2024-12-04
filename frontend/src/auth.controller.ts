import { auth, db } from "../firebase";
import { 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// User Profile Interface
interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  displayName?: string;
  photoURL?: string;
}

// Sign up a new user with email and password
export const doCreateUserWithEmailAndPassword = async (
  username: string, 
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      id: user.uid,
      username,
      email: user.email || '',
      createdAt: new Date().toISOString(),
      displayName: username,
      photoURL: user.photoURL || undefined
    };

    // Store additional user details in Firestore
    await setDoc(doc(db, 'users', user.uid), userProfile);

    // Send email verification
    if (user) {
      await sendEmailVerification(user);
    }

    return userCredential;
  } catch (error: any) {
    console.error("Error signing up:", error.message);
    throw new Error(`Sign-up failed: ${error.message}`);
  }
};

// Sign in a user with email and password
export const doSignInWithEmailAndPassword = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error("Error signing in:", error.message);
    throw new Error(`Sign-in failed: ${error.message}`);
  }
};

// Google Sign-In
export const doSignInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    
    // Optional: Create/update user profile in Firestore
    if (result.user) {
      const userProfile: UserProfile = {
        id: result.user.uid,
        username: result.user.displayName || '',
        email: result.user.email || '',
        createdAt: new Date().toISOString(),
        displayName: result.user.displayName || undefined,
        photoURL: result.user.photoURL || undefined
      };

      await setDoc(doc(db, 'users', result.user.uid), userProfile, { merge: true });
    }

    return result;
  } catch (error: any) {
    console.error("Error signing in with Google:", error.message);
    throw new Error(`Google sign-in failed: ${error.message}`);
  }
};

// Sign out the current user
export const doSignOut = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error: any) {
    console.error("Error signing out:", error.message);
    throw new Error(`Sign-out failed: ${error.message}`);
  }
};

// Send password reset email
export const doPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error sending password reset email:", error.message);
    throw new Error(`Password reset failed: ${error.message}`);
  }
};

// Send email verification to the current user
export const doSendEmailVerification = async (): Promise<void> => {
  if (auth.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (error: any) {
      console.error("Error sending verification email:", error.message);
      throw new Error(`Email verification failed: ${error.message}`);
    }
  } else {
    console.error("No current user for verification.");
    throw new Error("No current user to verify email.");
  }
};