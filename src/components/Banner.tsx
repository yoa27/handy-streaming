import React, { useState, useEffect } from 'react';
import axios, { requests } from '../services/tmdb';
import { Play, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WatchProviders from './WatchProviders';
import '../styles/Banner.css';

const Banner: React.FC = () => {
  const [movie, setMovie] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      return request;
    }
    fetchData();
  }, []);

  const handlePlay = () => {
    if (movie) {
      // Les Netflix Originals sont des séries (TV)
      navigate(`/watch/tv/${movie.id}`);
    }
  };

  function truncate(str: string, n: number) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  if (!movie) return <div className="banner--loading"></div>;

  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner__buttons">
          <button className="banner__button banner__button--play" onClick={handlePlay}>
            <Play size={20} fill="black" /> Lecture
          </button>
          <button className="banner__button banner__button--info">
            <Info size={20} /> Plus d'infos
          </button>
        </div>
        <WatchProviders mediaType="tv" id={movie?.id} />
        <h1 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>
      <div className="banner--fadeBottom" />
    </header>
  );
};

export default Banner;
