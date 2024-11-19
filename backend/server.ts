import express, { Express, Request, Response } from "express";
import cors from "cors";
import { User } from "../lib/types/index";
import { addUser, getUser, updateUser, deleteUser  } from "./user.controller";

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

// Endpoint to add likes
app.put("/api/games/:id/likes", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const gameRef = db.collection("games").doc(id);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      return res.status(404).json({ error: "Game not found" });
    }

    const currentLikes = gameDoc.data()?.likes || 0;
    const newLikes = currentLikes + 1;

    await gameRef.update({ likes: newLikes });

    res.json({ success: true, newLikes });
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to delete like
app.delete("/api/games/:id/likes", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const gameRef = db.collection("games").doc(id);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      return res.status(404).json({ error: "Game not found" });
    }

    const currentLikes = gameDoc.data()?.likes || 0;

    if (currentLikes === 0) {
      return res.status(400).json({ error: "Likes cannot be negative." });
    }

    const newLikes = currentLikes - 1;
    await gameRef.update({ likes: newLikes });

    res.json({ success: true, newLikes });
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to add user
app.post("/api/users/:id", async (req: Request, res: Response) => {
  console.log("[POST] entering '/users/:id' endpoint");
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
  console.log("[GET] entering '/users/:id' endpoint");
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
  console.log("[PUT] entering '/users/:id' endpoint");
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

app.listen(port, hostname, () => {
  console.log(`Listening`);
});
