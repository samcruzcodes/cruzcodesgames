import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getGames } from '../../../lib/gamesData';
import { Game } from '../../../lib/types';

const GamePage = () => {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const allGames = await getGames();
        const foundGame = allGames.find((g) => g.id === id);
        
        if (foundGame) {
          setGame(foundGame);
        } else {
          setError('Game not found!');
        }
      } catch (err) {
        setError('Error loading game data');
        console.error('Error fetching game:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  useEffect(() => {
    if (game && id) {
      const script = document.createElement('script');
      script.src = `/public/games/${id}/script.js`;
      script.async = true;

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [id, game]);

  if (loading) {
    return <div id="error-page"><h1>Loading...</h1></div>;
  }

  if (error || !game) {
    return <div style={styles.gamePage}>{error || 'Game not found!'}</div>;
  }

  return (
    <div style={styles.gamePage}>
      <h1 style={styles.title}>{game.title}</h1>
      <div id="game-container" style={styles.gameContainer}></div>
      <div style={styles.gameDetails}>
        <p><strong>Description:</strong> {game.description}</p>
        <p><strong>Views:</strong> {game.views}</p>
        {game.itchIoUrl && (
          <p>
            <a 
              href={game.itchIoUrl} 
              target="_blank" 
              style={styles.itchIoLink}
            >
              Play on itch.io
            </a>
          </p>
        )}
        <div style={styles.commentsSection}>
          <h3>Comments</h3>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  gamePage: {
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    color: 'var(--primary-color)',
    fontSize: '2rem',
    marginBottom: '20px',
  },
  gameContainer: {
    width: '100%',
    height: '60vh',
    border: '1px solid var(--subtle-accent)',
    marginTop: '20px',
    backgroundColor: '#f9f9f9',
  },
  gameDetails: {
    marginTop: '20px',
    color: 'var(--text-color)',
    textAlign: 'left',
    padding: '10px 20px',
  },
  commentsSection: {
    marginTop: '20px',
    padding: '10px',
    borderTop: '1px solid var(--subtle-accent)',
  },
  itchIoLink: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: 'var(--subtle-accent)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    marginTop: '10px',
  },
};

export default GamePage;