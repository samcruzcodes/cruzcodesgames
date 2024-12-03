import { auth } from "../frontend/src/firebase";
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from "firebase/auth";
import { addUser } from "./user.controller";

export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  if (user) {
    await addUser(user.uid, {
      id: user.uid,
      email: user.email || '',
      username: user.displayName || email.split('@')[0],
      createdAt: new Date().toISOString()
    });
  }

  return userCredential;
};

export const doSignInWithEmailAndPassword = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  if (result.user) {
    await addUser(result.user.uid, {
      id: result.user.uid,
      email: result.user.email || '',
      username: result.user.displayName || '',
      createdAt: new Date().toISOString()
    });
  }

  return result;
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const doSendEmailVerification = () => {
  if (auth.currentUser) {
    return sendEmailVerification(auth.currentUser, {
      url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/home`,
    });
  }
  throw new Error('No current user');
};