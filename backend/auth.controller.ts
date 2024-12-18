import { auth, db } from "./firebase";
import admin from "firebase-admin";

type UserProfile = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  displayName?: string;
};

// Create user with email and password
export const createUser = async (username: string, email: string, password: string): Promise<admin.auth.UserRecord> => {
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username
    });

    const userProfile: UserProfile = {
      id: userRecord.uid,
      username,
      email: userRecord.email || '',
      createdAt: new Date().toISOString(),
      displayName: username,
    };

    await db.collection('users').doc(userRecord.uid).set(userProfile);

    return userRecord;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Get a user by ID 
export const getUser = async (uid: string): Promise<admin.auth.UserRecord | null> => {
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// Update user info 
export const updateUser = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    const updatedAuthUser = await auth.updateUser(uid, {
      displayName: updates.username,
      email: updates.email
    });

    await db.collection('users').doc(uid).update(updates);

    return updatedAuthUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete user 
export const deleteUser = async (uid: string) => {
  try {
    const batch = db.batch();

    const userRef = db.collection('users').doc(uid);
    
    batch.delete(userRef);

    const userGamesRef = await db.collection('games')
      .where('userId', '==', uid)
      .get();

    userGamesRef.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    await auth.deleteUser(uid);

    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};