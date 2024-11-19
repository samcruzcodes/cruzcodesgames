import { useState } from "react";
import { Game } from "../../../lib/types/index";
import { Link } from "react-router-dom";

const GameCard = ({
  title,
  description,
  thumbnailUrl,
  views,
  likes,
  id,
}: Game) => {
  const [currentViews, setCurrentViews] = useState(views);
  const [active, setActive] = useState(false);

  const handleViewGame = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/games/${id}/increment-views`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        console.error("Failed to increment views");
        return;
      }

      const data = await response.json();
      setCurrentViews(data.newViews);
    } catch (error) {
      console.error("Error views:", error);
    }
  };

  const handleMouseEnter = () => {
    setActive(true);
  };

  const handleMouseLeave = () => {
    setActive(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img src={thumbnailUrl} alt={title} style={styles.image} />
      </div>
      <div>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>{description}</p>
        <p>
          <strong>Views:</strong> {currentViews} <strong>Likes:</strong> {likes}
        </p>
        <Link
          to={`../../public/games/${id}`}
          style={{
            ...styles.link,
            color: active ? "var(--accent-color)" : "var(--subtle-accent)",
            fontWeight: active ? "bold" : "500",
          }}
          onClick={handleViewGame}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          View Game
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: `1px solid var(--subtle-accent)`,
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center" as const,
    width: "400px",
    height: "450px",
    margin: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-around",
    backgroundColor: "var(--background-primary-mix)",
  },
  imageContainer: {
    width: "100%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "cover" as const,
    borderRadius: "8px",
  },
  title: {
    color: "var(--text-color)",
    fontSize: "1.25rem",
    fontWeight: "bold",
    margin: "0.5rem 0",
  },
  description: {
    color: "var(--subtle-accent)",
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
  link: {
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "color 0.2s ease",
  },
};

export default GameCard;
