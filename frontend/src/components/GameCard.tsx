import React, { useState } from "react";
import { Game } from "../../../lib/types/index";
import { Link } from "react-router-dom";
import { createStyles } from "@mantine/core"; // Import createStyles from Mantine

const useStyles = createStyles((theme) => ({
  link: {
    color: "var(--subtle-accent)",
    textDecoration: "none",
    fontWeight: "500",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.2s ease",
  },
  linkActive: {
    color: "var(--accent-color)",
    fontWeight: "bold",
  },
}));

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
  const { classes, cx } = useStyles();

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
          className={cx(classes.link, { [classes.linkActive]: active })}
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
    textAlign: "center",
    width: "400px",
    height: "450px",
    margin: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
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
    objectFit: "cover",
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
  button: {
    padding: "10px 15px",
    fontSize: "1rem",
    borderRadius: "5px",
    backgroundColor: "var(--subtle-accent)",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default GameCard;
