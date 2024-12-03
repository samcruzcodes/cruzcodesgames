import express, { Express, Request, Response } from "express";
import cors from "cors";
import { User } from "../lib/types/index";
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

const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


// Fetch a specific game
app.get("/api/games/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const gameDoc = await db.collection("games").doc(id).get();
    if (!gameDoc.exists) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(gameDoc.data());
  } catch (error) {
    console.error("Error fetching game data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch all games
app.get("/api/games", async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("games").get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "No games found" });
    }
    const games = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Increment game views
app.post("/api/games/:id/increment-views", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const gameRef = db.collection("games").doc(id);
    const gameDoc = await gameRef.get();
    if (!gameDoc.exists) {
      return res.status(404).json({ error: "Game not found" });
    }
    const currentViews = gameDoc.data()?.views || 0;
    await gameRef.update({ views: currentViews + 1 });
    res.json({ success: true, newViews: currentViews + 1 });
  } catch (error) {
    console.error("Error updating views:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update game likes
app.patch("/api/games/:id/likes", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { increment } = req.body;
  try {
    const gameRef = db.collection("games").doc(id);
    const gameDoc = await gameRef.get();
    if (!gameDoc.exists) {
      return res.status(404).json({ error: "Game not found" });
    }
    const currentLikes = gameDoc.data()?.likes || 0;
    const newLikes = increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    await gameRef.update({ likes: newLikes });
    res.json({ success: true, newLikes });
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a user
app.post("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, createdAt } = req.body;
  const user: User = { id, username, email, createdAt };
  try {
    await addUser(id, user);
    res.status(200).json({ message: `User added with ID: ${id}` });
  } catch (err) {
    res.status(500).json({ error: `Error adding user: ${err}` });
  }
});

// Get a user
app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await getUser(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: `Error fetching user: ${err}` });
  }
});

// Update a user
app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    await updateUser(id, updates);
    const updatedUser = await getUser(id);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: `Error updating user: ${err}` });
  }
});

// Sign up a user
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userCredential = await doCreateUserWithEmailAndPassword(email, password);
    res.status(201).json({ message: "User created successfully", user: userCredential.user });
  } catch (err) {
    res.status(400).json({ error: `Sign-up failed` });
  }
});

// Sign in a user
app.post("/api/auth/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userCredential = await doSignInWithEmailAndPassword(email, password);
    res.status(200).json({ message: "Signed in successfully", user: userCredential.user });
  } catch (err) {
    res.status(400).json({ error: `Sign-in failed` });
  }
});

// Google Sign-In
app.post("/api/auth/google", async (req: Request, res: Response) => {
  try {
    const result = await doSignInWithGoogle();
    res.status(200).json({ message: "Google sign-in successful", user: result.user });
  } catch (err) {
    res.status(400).json({ error: `Google sign-in failed` });
  }
});

// Sign out a user
app.post("/api/auth/signout", async (req: Request, res: Response) => {
  try {
    await doSignOut();
    res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    res.status(400).json({ error: `Sign-out failed` });
  }
});

// Password reset
app.post("/api/auth/password-reset", async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await doPasswordReset(email);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(400).json({ error: `Password reset failed` });
  }
});

// Email verification
app.post("/api/auth/verify-email", async (req: Request, res: Response) => {
  try {
    await doSendEmailVerification();
    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    res.status(400).json({ error: `Email verification failed` });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
