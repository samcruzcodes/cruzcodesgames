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
      // Only include photoURL if it exists, otherwise omit it
      photoURL: user.photoURL || '' // or you could use a default URL here instead of ''
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    if (user) {
      await sendEmailVerification(user);
    }

    return userCredential;
  } catch (error: any) {
    console.error("Error signing up:", error.message);
    throw new Error(`Sign-up failed: ${error.message}`);
  }
};


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

// delete the user from database
export const deleteUserAccount = async (): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    await deleteDoc(doc(db, 'users', currentUser.uid));

    await firebaseDeleteUser(currentUser);
    
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw new Error(`Failed to delete account: ${error.message}`);
  }
};