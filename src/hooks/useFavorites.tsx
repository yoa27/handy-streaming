import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  media_type?: string;
}

interface FavoritesContextType {
  favorites: Movie[];
  addToFavorites: (movie: Movie) => Promise<void>;
  removeFromFavorites: (id: number) => Promise<void>;
  isFavorite: (id: number) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Charger les favoris depuis Supabase au démarrage ou au changement d'utilisateur
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    async function loadFavorites() {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user?.id);

      if (!error && data) {
        // Formater les données pour qu'elles correspondent à l'interface Movie
        const formatted = data.map(item => ({
          id: item.movie_id,
          title: item.title,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          overview: item.overview,
          media_type: item.media_type
        }));
        setFavorites(formatted);
      }
      setLoading(false);
    }

    loadFavorites();
  }, [user]);

  const addToFavorites = async (movie: Movie) => {
    if (!user) return;

    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      movie_id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      media_type: movie.media_type || 'movie'
    });

    if (!error) {
      setFavorites(prev => [...prev, movie]);
    }
  };

  const removeFromFavorites = async (id: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', id);

    if (!error) {
      setFavorites(prev => prev.filter(m => m.id !== id));
    }
  };

  const isFavorite = (id: number) => {
    return favorites.some(m => m.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
