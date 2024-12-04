import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../authcontext';

export type ProfileUpdateData = {
  username?: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  location?: string;
}

export const updateProfile = async (userId: string, updateData: ProfileUpdateData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });

    const updatedDoc = await getDoc(userRef);
    return updatedDoc.data() as UserProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { id: userId, ...userDoc.data() as Omit<UserProfile, 'id'> };
    }
    return null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
