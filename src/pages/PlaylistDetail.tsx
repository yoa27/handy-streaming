import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylists } from '../hooks/PlaylistContext';
import MovieGrid from '../components/MovieGrid';
import { ChevronLeft, FolderHeart } from 'lucide-react';
import '../styles/Playlists.css';

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { playlists, getPlaylistItems } = usePlaylists();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const playlist = playlists.find(p => p.id === id);

  useEffect(() => {
    async function loadItems() {
      if (id) {
        const items = await getPlaylistItems(id);
        // Formater pour MovieGrid
        const formatted = items.map(item => ({
          id: item.movie_id,
          title: item.title,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          overview: item.overview,
          media_type: item.media_type
        }));
        setMovies(formatted);
      }
      setLoading(false);
    }
    loadItems();
  }, [id, getPlaylistItems]);

  if (loading) return <div className="playlists__loading">Chargement du contenu...</div>;
  if (!playlist) return <div className="playlists__loading">Playlist introuvable.</div>;

  return (
    <div className="playlistsPage">
      <div className="playlistsPage__header">
        <button onClick={() => navigate('/playlists')} className="playlistDetail__back">
          <ChevronLeft size={20} /> Retour aux playlists
        </button>
        <div className="playlistDetail__info">
          <FolderHeart size={32} color="#e50914" />
          <h2 className="playlistsPage__title">
            Playlist : <span>{playlist.name}</span>
          </h2>
        </div>
        <p className="playlistsPage__count">{movies.length} titres dans ce dossier</p>
      </div>

      {movies.length === 0 ? (
        <div className="playlistsPage__empty">
          <p>Cette playlist est vide.</p>
          <button onClick={() => navigate('/')}>Ajouter des films</button>
        </div>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
};

export default PlaylistDetail;
