import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios, { requests } from '../services/tmdb';
import Banner from '../components/Banner';
import MovieGrid from '../components/MovieGrid';
import { LayoutGrid } from 'lucide-react';
import '../styles/Home.css';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams] = useSearchParams();
  
  // Lecture de la catégorie depuis l'URL
  const filter = searchParams.get('category') || 'trending';

  useEffect(() => {
    // Reset quand on change de catégorie via la Navbar
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [filter]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let url = "";
        if (filter === 'trending') url = `${requests.fetchTrending}&page=${page}`;
        if (filter === 'movies') url = `${requests.fetchTopRated}&page=${page}`;
        if (filter === 'tv') url = `${requests.fetchNetflixOriginals}&page=${page}`;
        if (filter === 'latest') {
          const response = await axios.get(`https://frembed.one/api/public/v1/movies?limit=28&page=${page}&order=latest`);
          if (response.data && response.data.result && response.data.result.items) {
            const newItems = response.data.result.items;
            setMovies(prev => {
              const combined = [...prev, ...newItems];
              return Array.from(new Map(combined.map(item => [item.id || item.tmdb, item])).values());
            });
            if (page >= response.data.result.totalPages) setHasMore(false);
          }
        } else {
          const request = await axios.get(url);
          if (request.data && request.data.results) {
            const newItems = request.data.results;
            setMovies(prev => {
              const combined = [...prev, ...newItems];
              return Array.from(new Map(combined.map(item => [item.id || item.tmdb, item])).values());
            });
            if (page >= request.data.total_pages) setHasMore(false);
          }
        }
      } catch (error) {
        console.error("Erreur chargement:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, [filter, page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="home">
      <Banner />
      
      <div className="home__content">
        {/* La barre de filtres a été déplacée dans la Navbar comme demandé */}

        <div className="home__sectionHeader">
          <LayoutGrid size={24} color="#e50914" />
          <h2>
            {filter === 'trending' && "Les Tendances du moment"}
            {filter === 'latest' && "Dernièrement ajouté sur Handy aime les pieds"}
            {filter === 'movies' && "Les Meilleurs Films"}
            {filter === 'tv' && "Séries Originales"}
          </h2>
        </div>

        <MovieGrid movies={movies} mediaType={filter === 'tv' ? 'tv' : undefined} />

        {hasMore && (
          <div className="home__loadMoreContainer">
            <button 
              className="home__loadMoreBtn" 
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Chargement..." : "CHARGER PLUS DE TITRES"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
