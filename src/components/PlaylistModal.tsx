import React, { useState } from 'react';
import { X, Plus, FolderPlus, Check } from 'lucide-react';
import { usePlaylists } from '../hooks/PlaylistContext';
import '../styles/PlaylistModal.css';

interface PlaylistModalProps {
  movie: any;
  onClose: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ movie, onClose }) => {
  const { playlists, createPlaylist, addToPlaylist } = usePlaylists();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addedStatus, setAddedStatus] = useState<string | null>(null);

  const handleCreateAndAdd = async () => {
    if (!newPlaylistName.trim()) return;
    setLoading(true);
    const id = await createPlaylist(newPlaylistName);
    if (id) {
      await addToPlaylist(id, movie);
      setAddedStatus(id);
      setTimeout(onClose, 1500);
    }
    setLoading(false);
  };

  const handleAddToExisting = async (playlistId: string) => {
    setLoading(true);
    await addToPlaylist(playlistId, movie);
    setAddedStatus(playlistId);
    setTimeout(onClose, 1500);
    setLoading(false);
  };

  return (
    <div className="pModal__overlay" onClick={onClose}>
      <div className="pModal__content" onClick={e => e.stopPropagation()}>
        <div className="pModal__header">
          <h3>Ajouter à une playlist</h3>
          <button className="pModal__close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="pModal__movieInfo">
          <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path || movie.poster?.split('original')[1]}`} alt="" />
          <p>{movie.title || movie.name}</p>
        </div>

        <div className="pModal__list">
          {playlists.length > 0 ? (
            playlists.map(p => (
              <div 
                key={p.id} 
                className={`pModal__item ${addedStatus === p.id ? 'added' : ''}`}
                onClick={() => !addedStatus && handleAddToExisting(p.id)}
              >
                <span>{p.name}</span>
                {addedStatus === p.id ? <Check size={18} color="#2ecc71" /> : <Plus size={18} />}
              </div>
            ))
          ) : (
            <p className="pModal__empty">Vous n'avez pas encore de playlist.</p>
          )}
        </div>

        {!showCreate ? (
          <button className="pModal__showCreate" onClick={() => setShowCreate(true)}>
            <FolderPlus size={18} /> Créer une nouvelle playlist
          </button>
        ) : (
          <div className="pModal__createForm">
            <input 
              type="text" 
              placeholder="Nom de la playlist..." 
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              autoFocus
            />
            <div className="pModal__createActions">
              <button onClick={() => setShowCreate(false)}>Annuler</button>
              <button 
                className="pModal__confirmBtn" 
                onClick={handleCreateAndAdd}
                disabled={loading || !newPlaylistName.trim()}
              >
                Créer et ajouter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistModal;
