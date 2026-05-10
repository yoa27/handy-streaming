import React, { useState, useEffect } from 'react';
import axios from '../services/tmdb';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, Play } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import WatchProviders from './WatchProviders';
import '../styles/Row.css';

const VidSrcLatestRow: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("https://frembed.one/api/public/v1/movies?limit=15&order=latest");
        if (response.data && response.data.result && response.data.result.items) {
          setMovies(response.data.result.items);
        }
      } catch (error) {
        console.error("Erreur chargement nouveautés Frembed:", error);
      }
    }
    fetchData();
  }, []);

  const handleWatch = (movie: any) => {
    navigate(`/watch/movie/${movie.tmdb}`);
  };

  if (movies.length === 0) return null;

  return (
    <div className="row">
      <h2>Dernièrement ajouté sur Handy aime les pied</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <div key={movie.tmdb} className="row__posterContainer">
            <img
              onClick={() => handleWatch(movie)}
              className="row__poster"
              src={movie.poster}
              alt={movie.title}
            />
            <div className="row__posterInfo">
              <div className="row__posterButtons">
                <button className="row__iconButton" onClick={() => handleWatch(movie)}>
                  <Play size={16} fill="white" />
                </button>
                {isFavorite(parseInt(movie.tmdb)) ? (
                  <button className="row__iconButton" onClick={() => removeFromFavorites(parseInt(movie.tmdb))}>
                    <Check size={16} color="#e50914" />
                  </button>
                ) : (
                  <button className="row__iconButton" onClick={() => addToFavorites({
                    id: parseInt(movie.tmdb),
                    title: movie.title,
                    poster_path: movie.poster.replace('https://image.tmdb.org/t/p/original/', ''),
                    backdrop_path: '',
                    overview: ''
                  })}>
                    <Plus size={16} />
                  </button>
                )}
              </div>
              <div className="row__posterTitle">
                {movie.title} <span style={{ color: '#e50914', marginLeft: '5px' }}>{movie.quality}</span>
              </div>
              <WatchProviders mediaType="movie" id={movie.tmdb} />
              <p style={{ fontSize: '10px', color: '#aaa', marginTop: '5px' }}>Version : {movie.version}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VidSrcLatestRow;
