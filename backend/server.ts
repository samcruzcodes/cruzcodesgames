import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createUser, getUser, updateUser, deleteUser } from "./auth.controller";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSignOut,
  doPasswordReset,
  doSendEmailVerification,
} from "../frontend/src/auth.controller";
import { db, auth } from "./firebase";

const app: Express = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-production-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Authentication Routes
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const userRecord = await createUser(username, email, password);
    res.status(201).json({ 
      message: "User created successfully", 
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        username: userRecord.displayName
      }
    });
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      res.status(400).json({ error: "Email already in use" });
    } else if (err.code === 'auth/invalid-email') {
      res.status(400).json({ error: "Invalid email format" });
    } else {
      res.status(500).json({ error: "Internal server error during signup" });
    }
  }
});

app.post("/api/auth/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userCredential = await doSignInWithEmailAndPassword(email, password);
    res.status(200).json({ message: "Signed in successfully", user: userCredential.user });
  } catch (err) {
    res.status(400).json({ error: "Sign-in failed" });
  }
});

app.post("/api/auth/google", async (req: Request, res: Response) => {
  try {
    const result = await doSignInWithGoogle();
    res.status(200).json({ message: "Google sign-in successful", user: result.user });
  } catch (err) {
    res.status(400).json({error: "Google sign-in failed" });
  }
});

app.post("/api/auth/signout", async (req: Request, res: Response) => {
  try {
    await doSignOut();
    res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    res.status(400).json({error: "Sign-out failed" });
  }
});

app.post("/api/auth/password-reset", async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await doPasswordReset(email);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(400).json({error: "Password reset failed" });
  }
});

app.post("/api/auth/verify-email", async (req: Request, res: Response) => {
  try {
    await doSendEmailVerification();
    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    res.status(400).json({error: "Email verification failed" });
  }
});

// User Management Routes
app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await getUser(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedUser = await updateUser(id, updates);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Error updating user" });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});