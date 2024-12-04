import express, { Express, Request, Response } from "express";
import cors from "cors";
import { addUser, getUser, updateUser, deleteUser } from "./user.controller";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSignOut,
  doPasswordReset,
  doSendEmailVerification,
} from "./auth.controller";
import admin from "firebase-admin";

// Firebase Admin SDK setup
const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL
};

if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
  console.error('Missing Firebase Admin SDK credentials');
  throw new Error('Missing required Firebase Admin SDK credentials. Check your environment variables.');
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.projectId,
    privateKey: serviceAccount.privateKey,
    clientEmail: serviceAccount.clientEmail
  })
});

const db = admin.firestore();
const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Get user details from Firestore
app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await getUser(id);  // Retrieve user from Firestore
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: `Error fetching user:` });
  }
});

// Update user
app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    await updateUser(id, updates);  // Update user in Firestore
    const updatedUser = await getUser(id);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: `Error updating user:` });
  }
});

// Delete user
app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteUser(id);  // Delete user from Firestore
    await admin.auth().deleteUser(id);  // Also remove from Firebase Auth
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: `Error deleting user:` });
  }
});

// Sign up user
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userCredential = await doCreateUserWithEmailAndPassword(email, password);
    res.status(201).json({ message: "User created successfully", user: userCredential.user });
  } catch (err) {
    res.status(400).json({ error: "Sign-up failed" });
  }
});

// Sign in user
app.post("/api/auth/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userCredential = await doSignInWithEmailAndPassword(email, password);
    res.status(200).json({ message: "Signed in successfully", user: userCredential.user });
  } catch (err) {
    res.status(400).json({ error: "Sign-in failed" });
  }
});

// Google Sign-In
app.post("/api/auth/google", async (req: Request, res: Response) => {
  try {
    const result = await doSignInWithGoogle();
    res.status(200).json({ message: "Google sign-in successful", user: result.user });
  } catch (err) {
    res.status(400).json({error: "Google sign-in failed" });
  }
});

// Sign out user
app.post("/api/auth/signout", async (req: Request, res: Response) => {
  try {
    await doSignOut();
    res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    res.status(400).json({error: "Sign-out failed" });
  }
});

// Password reset
app.post("/api/auth/password-reset", async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await doPasswordReset(email);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(400).json({error: "Password reset failed" });
  }
});

// Email verification
app.post("/api/auth/verify-email", async (req: Request, res: Response) => {
  try {
    await doSendEmailVerification();
    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    res.status(400).json({error: "Email verification failed" });
  }
});
