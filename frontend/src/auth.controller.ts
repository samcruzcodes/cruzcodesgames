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
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { deleteUser as firebaseDeleteUser } from "firebase/auth";

// User Profile Interface
type UserProfile = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  displayName?: string;
  photoURL?: string;
};

// Define a custom error type
interface CustomError extends Error {
  code?: string;
}

// Sign up a new user with email and password
export const doCreateUserWithEmailAndPassword = async (
  username: string, 
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile: UserProfile = {
      id: user.uid,
      username,
      email: user.email || '',
      createdAt: new Date().toISOString(),
      displayName: username,
      photoURL: user.photoURL || ''
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    if (user) {
      await sendEmailVerification(user);
    }

    return userCredential;
  } catch (error: unknown) {
    const typedError = error as CustomError;
    console.error("Error signing up:", typedError.message);
    throw new Error(`Sign-up failed: ${typedError.message}`);
  }
};

// Sign in with email and password
export const doSignInWithEmailAndPassword = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    const typedError = error as CustomError;
    console.error("Error signing in:", typedError.message);
    throw new Error(`Sign-in failed: ${typedError.message}`);
  }
};

// Google Sign-In
export const doSignInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);

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
  } catch (error: unknown) {
    const typedError = error as CustomError;
    console.error("Error signing in with Google:", typedError.message);
    throw new Error(`Google sign-in failed: ${typedError.message}`);
  }
};

// Sign out the current user
export const doSignOut = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error: unknown) {
    const typedError = error as CustomError;
    console.error("Error signing out:", typedError.message);
    throw new Error(`Sign-out failed: ${typedError.message}`);
  }
};

// Send password reset email
export const doPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    const typedError = error as CustomError;
    console.error("Error sending password reset email:", typedError.message);
    throw new Error(`Password reset failed: ${typedError.message}`);
  }
};

// Send email verification to the current user
export const doSendEmailVerification = async (): Promise<void> => {
  if (auth.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (error: unknown) {
      const typedError = error as CustomError;
      console.error("Error sending verification email:", typedError.message);
      throw new Error(`Email verification failed: ${typedError.message}`);
    }
  } else {
    console.error("No current user for verification.");
    throw new Error("No current user to verify email.");
  }
};

// Delete the user from database
export const deleteUserAccount = async (): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    await deleteDoc(doc(db, 'users', currentUser.uid));
    await firebaseDeleteUser(currentUser);
    
  } catch (error: unknown) {
    const typedError = error as CustomError;
    console.error("Error deleting user:", typedError.message);
    throw new Error(`Failed to delete account: ${typedError.message}`);
  }
};
