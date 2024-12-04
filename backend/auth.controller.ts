import { auth, db } from "./firebase";
import admin from "firebase-admin";

// User Profile Interface
interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  displayName?: string;
}

// Create user with email and password
export const createUser = async (username: string, email: string, password: string): Promise<admin.auth.UserRecord> => {
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username
    });

    // Create a detailed user profile in Firestore
    const userProfile: UserProfile = {
      id: userRecord.uid,
      username,
      email: userRecord.email || '',
      createdAt: new Date().toISOString(),
      displayName: username,
    };

    // Store additional user details in Firestore
    await db.collection('users').doc(userRecord.uid).set(userProfile);

    return userRecord;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Get a user by ID (admin-side)
export const getUser = async (uid: string): Promise<admin.auth.UserRecord | null> => {
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// Update user info (admin-side)
export const updateUser = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    // Update Firebase Auth user
    const updatedAuthUser = await auth.updateUser(uid, {
      displayName: updates.username,
      email: updates.email
    });

    // Update Firestore user profile
    await db.collection('users').doc(uid).update(updates);

    return updatedAuthUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete user (admin-side)
export const deleteUser = async (uid: string) => {
  try {
    // Delete from Firebase Auth
    await auth.deleteUser(uid);
    
    // Delete from Firestore
    await db.collection('users').doc(uid).delete();

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};