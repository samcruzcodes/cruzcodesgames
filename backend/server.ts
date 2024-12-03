import express, { Express, Request, Response } from "express";
import cors from "cors";
import { User } from "../lib/types/index";
import { addUser, getUser, updateUser, deleteUser  } from "./user.controller";
import { 
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSignOut,
  doPasswordReset,
  doSendEmailVerification
} from "./auth.controller";


const app: Express = express();
const hostname = "0.0.0.0";
const port = 8080;

app.use(cors());
app.use(express.json());


import admin from "firebase-admin";

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };

// Endpoint for game Data
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

// Endpoint to get games views and likes
app.get("/api/games", async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("games").get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No games found" });
    }

    const games = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to add views
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

// Endpoint to update likes
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

    let newLikes = currentLikes;
    if (increment) {
      newLikes += 1; 
    } else if (currentLikes > 0) {
      newLikes -= 1; 
    } else {
      return res.status(400).json({ error: "Likes cannot be negative." });
    }

    await gameRef.update({ likes: newLikes });

    res.json({ success: true, newLikes });
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to add user
app.post("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, createdAt } = req.body;

  const user: User = {
    id,
    username,
    email,
    createdAt,
  };

  try {
    await addUser(id, user);
    res.status(200).json({
      message: `SUCCESS: added user with id: ${id} to the user collection in Firestore`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occurred in the /api/users/:id endpoint: ${err}`,
    });
  }
});

// Endpoint to get user
app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await getUser(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occurred in the /api/users/:id endpoint: ${err}`,
    });
  }
});

// Endpoint to update user
app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    await updateUser(id, updates);
    const updatedUser = await getUser(id);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occurred while updating user: ${err}`,
    });
  }
});

app.post("/api/auth/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userCredential = await doCreateUserWithEmailAndPassword(email, password);
    res.status(201).json({
      message: "User created successfully",
      user: userCredential.user
    });
  } catch (err) {
    res.status(400).json({ error: `ERROR: an error occurred while singing up: ${err}`,});
  }
});

app.post("/api/auth/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userCredential = await doSignInWithEmailAndPassword(email, password);
    res.status(200).json({
      message: "Signed in successfully",
      user: userCredential.user
    });
  } catch (err) {
    res.status(400).json({error: `ERROR: an error occurred while signing in: ${err}`,});
  }
});

app.post("/api/auth/google", async (req: Request, res: Response) => {
  try {
    const result = await doSignInWithGoogle();
    res.status(200).json({
      message: "Google sign-in successful",
      user: result.user
    });
  } catch (err) {
    res.status(400).json({error: `ERROR: an error occurred while signing in with google: ${err}`,});
  }
});

app.post("/api/auth/signout", async (req: Request, res: Response) => {
  try {
    await doSignOut();
    res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    res.status(400).json({ error: `ERROR: an error occurred while signing out: ${err}`,});
  }
});

app.post("/api/auth/password-reset", async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await doPasswordReset(email);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(400).json({ error: `ERROR: an error occurred while resetting the password: ${err}`, });
  }
});

app.post("/api/auth/verify-email", async (req: Request, res: Response) => {
  try {
    await doSendEmailVerification();
    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    res.status(400).json({ error: `ERROR: an error occurred while verifying the email: ${err}`,});
  }
});

