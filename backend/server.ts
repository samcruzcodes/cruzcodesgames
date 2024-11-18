import express, { Express, Request, Response } from "express";
import cors from "cors";
import admin from "firebase-admin";

const app: Express = express();
const hostname = "0.0.0.0";
const port = 8080;

app.use(cors());
app.use(express.json());

var serviceAccount = require("./cruzcodesgames-c2fe2-firebase-adminsdk-n98uk-fdb181c3b6.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

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


// Endpoint to delete likes
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


app.listen(port, hostname, () => {
  console.log(`Listening`);
});
