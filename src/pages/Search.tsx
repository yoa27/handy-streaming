import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios, { requests } from '../services/tmdb';
import MovieGrid from '../components/MovieGrid';
import '../styles/Search.css';

const Search: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    async function fetchData() {
      if (query) {
        setLoading(true);
        try {
          const request = await axios.get(requests.searchMovies(query));
          setMovies(request.data.results);
        } catch (error) {
          console.error("Erreur recherche:", error);
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [query]);

  return (
    <div className="searchPage">
      <div className="searchPage__header">
        <h2 className="searchPage__title">
          Résultats pour : <span>"{query}"</span>
        </h2>
        <p className="searchPage__count">{movies.length} titres trouvés</p>
      </div>
      
      {loading ? (
        <div className="searchPage__loading">Recherche en cours...</div>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
};

export default Search;
