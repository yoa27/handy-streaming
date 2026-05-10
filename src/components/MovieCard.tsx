import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, ListPlus } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/AuthContext';
import { usePlaylistUI } from '../hooks/usePlaylistUI';
import '../styles/MovieCard.css';

interface MovieCardProps {
  movie: any;
  mediaType?: 'movie' | 'tv';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, mediaType }) => {
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();
  const { openPlaylistModal } = usePlaylistUI();

  const id = movie.id || movie.tmdb;
  const determinedMediaType = mediaType || movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
  
  const posterUrl = movie.poster || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster');

  const handleWatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/watch/${determinedMediaType}/${id}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert("Vous devez être connecté pour ajouter des films à votre liste.");
      navigate('/login');
      return;
    }
    
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites({
        id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        overview: movie.overview || '',
        media_type: determinedMediaType
      });
    }
  };

  const handlePlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert("Vous devez être connecté pour gérer vos playlists.");
      navigate('/login');
      return;
    }
    openPlaylistModal(movie);
  };

  return (
    <div className="movieCard" onClick={handleWatch}>
      <div className="movieCard__imageContainer">
        <img src={posterUrl} alt={movie.title || movie.name} className="movieCard__image" />
        
        {/* Badges Style Frembed */}
        <div className="movieCard__badges">
          <span className="movieCard__badge movieCard__badge--quality">
            {movie.quality || 'HD'}
          </span>
          {movie.version && (
            <span className="movieCard__badge movieCard__badge--version">
              {movie.version}
            </span>
          )}
        </div>

        {/* Overlay au hover */}
        <div className="movieCard__overlay">
          <button className="movieCard__playBtn" onClick={handleWatch}>
            <Play fill="white" size={24} />
          </button>
          <div className="movieCard__actions">
            <button className="movieCard__actionBtn" title="Ajouter à Ma Liste" onClick={handleFavorite}>
              {isFavorite(id) ? <Check size={18} color="#e50914" /> : <Plus size={18} />}
            </button>
            <button className="movieCard__actionBtn" title="Ajouter à une Playlist" onClick={handlePlaylist}>
              <ListPlus size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="movieCard__info">
        <h3 className="movieCard__title">{movie.title || movie.name}</h3>
        <div className="movieCard__meta">
          <span>{movie.year || (movie.release_date || movie.first_air_date || '').split('-')[0]}</span>
          <span className="movieCard__dot">•</span>
          <span className="movieCard__type">{determinedMediaType === 'tv' ? 'Série' : 'Film'}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
