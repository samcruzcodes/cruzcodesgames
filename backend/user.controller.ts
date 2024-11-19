// @ts-nocheck
import { User } from "../lib/types/index";
import { db } from "./server";

const userCollectionRef = db.collection("users");

export const addUser = async (id: String, user: User) => {
  const userRef = userCollectionRef.doc(id);
  return await userRef.set(user);
};

export const getUser = async (id: string) => {
  const userRef = userCollectionRef.doc(id);
  const snapshot = await userRef.get();
  if (snapshot.exists) {
    const user = snapshot.data();
    return user;
  }
  return null;
};

export const updateUser = async (id: string, updates: Partial<Omit<User, "id" | "createdAt">>) => {
    const userRef = userCollectionRef.doc(id);
    return await userRef.update(updates);
};
  

export const deleteUser = async (id: string) => {
  const userRef = userCollectionRef.doc(id);
  return await userRef.delete();
};