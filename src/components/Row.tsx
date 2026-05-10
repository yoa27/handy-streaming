import React, { useState, useEffect } from 'react';
import axios from '../services/tmdb';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, Play } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import WatchProviders from './WatchProviders';
import '../styles/Row.css';

interface RowProps {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
}

const base_url = "https://image.tmdb.org/t/p/original/";

const Row: React.FC<RowProps> = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const handleWatch = (movie: any) => {
    let mediaType = movie.media_type;
    if (!mediaType) {
      mediaType = movie.first_air_date || title.includes("TV") || title.includes("ORIGINALS") ? "tv" : "movie";
    }
    navigate(`/watch/${mediaType}/${movie.id}`);
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => {
          const mediaType = movie.media_type || (movie.first_air_date || title.includes("TV") || title.includes("ORIGINALS") ? "tv" : "movie");
          return (
            <div key={movie.id} className={`row__posterContainer ${isLargeRow && "row__posterLargeContainer"}`}>
              <img
                onClick={() => handleWatch(movie)}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                alt={movie.name}
              />
              <div className="row__posterInfo">
                <div className="row__posterButtons">
                  <button className="row__iconButton" onClick={() => handleWatch(movie)}>
                    <Play size={16} fill="white" />
                  </button>
                  {isFavorite(movie.id) ? (
                    <button className="row__iconButton" onClick={() => removeFromFavorites(movie.id)}>
                      <Check size={16} color="#e50914" />
                    </button>
                  ) : (
                    <button className="row__iconButton" onClick={() => addToFavorites(movie)}>
                      <Plus size={16} />
                    </button>
                  )}
                </div>
                <p className="row__posterTitle">{movie?.title || movie?.name}</p>
                <WatchProviders mediaType={mediaType as 'movie' | 'tv'} id={movie.id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Row;
