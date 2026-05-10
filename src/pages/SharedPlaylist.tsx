import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylists } from '../hooks/PlaylistContext';
import MovieGrid from '../components/MovieGrid';
import { FolderHeart, AlertCircle } from 'lucide-react';
import '../styles/Playlists.css';

const SharedPlaylist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getSharedPlaylist } = usePlaylists();
  const [data, setData] = useState<{ playlist: any, items: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadShared() {
      if (id) {
        const result = await getSharedPlaylist(id);
        setData(result);
      }
      setLoading(false);
    }
    loadShared();
  }, [id]);

  if (loading) return <div className="playlists__loading">Chargement de la playlist partagée...</div>;

  if (!data || !data.playlist) {
    return (
      <div className="playlistsPage">
        <div className="playlistsPage__empty">
          <AlertCircle size={60} color="#e50914" />
          <h2>Playlist introuvable ou privée</h2>
          <p>Désolé, ce lien n'est pas valide ou le propriétaire a rendu cette playlist privée.</p>
          <button onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  const { playlist, items } = data;
  const formattedMovies = items.map(item => ({
    id: item.movie_id,
    title: item.title,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    overview: item.overview,
    media_type: item.media_type
  }));

  return (
    <div className="playlistsPage">
      <div className="playlistsPage__header">
        <div className="playlistDetail__info">
          <FolderHeart size={32} color="#e50914" />
          <h2 className="playlistsPage__title">
            Playlist partagée : <span>{playlist.name}</span>
          </h2>
        </div>
        <p className="playlistsPage__count">{items.length} titres • Partagé avec vous</p>
      </div>

      <MovieGrid movies={formattedMovies} />
      
      <div className="playlistsPage__footer">
        <button className="playlistsPage__joinBtn" onClick={() => navigate('/login')}>
          Créez vos propres playlists sur Handy aime les pieds
        </button>
      </div>
    </div>
  );
};

export default SharedPlaylist;
