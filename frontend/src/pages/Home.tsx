import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { Game } from "../../../lib/types/index";
import { getGames } from "../../../lib/gamesData";

const HomePage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getGames();
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div id="error-page"><h1>Loading...</h1></div>;
  }

  if (games.length === 0) {
    return <div>No games available</div>;
  }

  return (
    <div style={styles.homepage}>
      <h1>Featured Games</h1>
      <div style={styles.gameList}>
        {games.map((game) => (
          <GameCard key={game.id} {...game} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  homepage: {
    textAlign: "center" as const,
    padding: "20px",
  },
  gameList: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap" as const,
    gap: "20px",
    marginTop: "20px",
  },
};

export default HomePage;