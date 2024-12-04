import { auth } from "./firebase";
import { addUser } from "./user.controller";
import admin from "firebase-admin";

export const createUser = async (email: string, password: string) => {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Optionally, add the user to Firestore or another DB
    await addUser(userRecord.uid, {
      id: userRecord.uid,
      email: userRecord.email || '',
      createdAt: new Date().toISOString(),
    });

    return userRecord;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user");
  }
};

// Get a user by ID (admin-side)
export const getUser = async (uid: string) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user");
  }
};

// Update user info (admin-side)
export const updateUser = async (uid: string, updates: any) => {
  try {
    const updatedUser = await admin.auth().updateUser(uid, updates);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
};

// Delete user (admin-side)
export const deleteUser = async (uid: string) => {
  try {
    await admin.auth().deleteUser(uid);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user");
  }
};
