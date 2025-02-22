import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getGames } from '../../../lib/gamesData';
import { Game } from '../../../lib/types';
import { IconHeartFilled } from '@tabler/icons-react';
import './GamePage.css'; 

const GamePage = () => {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const allGames = await getGames();
        const foundGame = allGames.find((g) => g.id === id);

        if (foundGame) {
          setGame(foundGame);
          setLikes(foundGame.likes);
          setHasLiked(false);
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

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/games/${id}/likes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment: !hasLiked }),
      });

      if (!response.ok) {
        console.error('Failed to update likes');
        return;
      }

      const data = await response.json();
      setLikes(data.newLikes);
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  if (loading) {
    return <div id="error-page"><h1>Loading...</h1></div>;
  }

  if (error || !game) {
    return <div className="gamePage">{error || 'Game not found!'}</div>;
  }

  return (
    <div className="gamePage">
      <h1 className="title">{game.title}</h1>
      <iframe
        src={game.itchIoUrl}
        width={game.width}
        height={game.height}
        className="gameContainer"
      />
      <div className="gameDetails">
        <p><strong>Description:</strong> {game.description}</p>
        <p>
          <strong>Views:</strong> {game.views}
          <br />
          <span
            className="likeButton"
            onClick={handleLike}
          >
            <IconHeartFilled
              className="heart"
              style={{ color: hasLiked ? 'darkred' : 'white' }}
            />
            <span style={{ marginLeft: '0.5rem' }}>{likes}</span>
          </span>
        </p>
        <div className="commentsSection">
          <h3>Comments</h3>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
