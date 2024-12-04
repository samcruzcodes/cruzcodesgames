import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Define UserProfile interface
export interface UserProfile {
  id: string;
  username?: string;
  email: string;
  createdAt: string;
  displayName?: string;
  photoURL?: string;
  updatedAt?: string;
}

// Define context type
interface AuthContextType {
  currentUser: UserProfile | null;
  userLoggedIn: boolean;
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userLoggedIn: false,
  loading: true,
  refreshUserProfile: async () => {}
});

// Auth context provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as Omit<UserProfile, 'id'>;
          setCurrentUser({
            id: auth.currentUser.uid,
            ...userData
          });
        }
      } catch (error) {
        console.error('Error refreshing user profile:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        try {
          // Fetch additional user details from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            // Combine Firebase Auth user with Firestore profile
            const userProfile: UserProfile = {
              id: user.uid,
              email: user.email || '',
              username: userDoc.data().username || user.displayName,
              createdAt: userDoc.data().createdAt || new Date().toISOString(),
              displayName: user.displayName || undefined,
              photoURL: user.photoURL || undefined,
              updatedAt: userDoc.data().updatedAt
            };

            setCurrentUser(userProfile);
            setUserLoggedIn(true);
          } else {
            // If no Firestore document, create a basic profile
            const basicProfile: UserProfile = {
              id: user.uid,
              email: user.email || '',
              username: user.displayName || user.email?.split('@')[0],
              createdAt: new Date().toISOString(),
              displayName: user.displayName || undefined,
              photoURL: user.photoURL || undefined
            };

            setCurrentUser(basicProfile);
            setUserLoggedIn(true);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setCurrentUser(null);
          setUserLoggedIn(false);
        }
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userLoggedIn, loading, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};