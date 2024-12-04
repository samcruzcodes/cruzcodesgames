import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from "firebase/auth";

// Sign up a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      // Send email verification
      await sendEmailVerification(user);
    }

    return userCredential;
  } catch (error: any) {
    console.error("Error signing up:", error.message);
    throw new Error(`Sign-up failed: ${error.message}`);
  }
};

// Sign in a user with email and password
export const doSignInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error("Error signing in:", error.message);
    throw new Error(`Sign-in failed: ${error.message}`);
  }
};

// Google Sign-In
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: any) {
    console.error("Error signing in with Google:", error.message);
    throw new Error(`Google sign-in failed: ${error.message}`);
  }
};

// Sign out the current user
export const doSignOut = async () => {
  try {
    await auth.signOut();
  } catch (error: any) {
    console.error("Error signing out:", error.message);
    throw new Error(`Sign-out failed: ${error.message}`);
  }
};

// Send password reset email
export const doPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error sending password reset email:", error.message);
    throw new Error(`Password reset failed: ${error.message}`);
  }
};

// Send email verification to the current user
export const doSendEmailVerification = async () => {
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
