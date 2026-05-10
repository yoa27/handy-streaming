import React from 'react';
import MovieCard from './MovieCard';
import '../styles/Grid.css';

interface MovieGridProps {
  movies: any[];
  mediaType?: 'movie' | 'tv';
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, mediaType }) => {
  return (
    <div className="movieGrid">
      {movies.map((movie) => (
        <MovieCard key={movie.id || movie.tmdb} movie={movie} mediaType={mediaType} />
      ))}
    </div>
  );
};

export default MovieGrid;
