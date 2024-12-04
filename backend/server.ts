import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createUser, getUser, updateUser, deleteUser } from "./auth.controller";
import { db, auth } from "./firebase";

const app: Express = express();
const port = 8080;

app.use(cors());
app.use(express.json());

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

// Fetch a specific game
app.get("/api/games/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const gameDoc = await db.collection("games").doc(id).get();
    if (!gameDoc.exists) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json({ id: gameDoc.id, ...gameDoc.data() });
  } catch (error) {
    console.error("Error fetching game data:", error);
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
    const result = await deleteUser(id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Error deleting user" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;