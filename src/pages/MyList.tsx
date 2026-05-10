import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import MovieGrid from '../components/MovieGrid';
import '../styles/Search.css';

const MyList: React.FC = () => {
  const { favorites } = useFavorites();

  return (
    <div className="searchPage">
      <div className="searchPage__header">
        <h2 className="searchPage__title">
          <span>Ma Liste</span>
        </h2>
        <p className="searchPage__count">{favorites.length} titres sauvegardés</p>
      </div>

      {favorites.length === 0 ? (
        <div className="searchPage__loading">
          <p>Votre liste est vide. Ajoutez des films pour les retrouver ici !</p>
        </div>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </div>
  );
};

export default MyList;
