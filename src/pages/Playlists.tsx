import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaylists } from '../hooks/PlaylistContext';
import { FolderHeart, Trash2, ChevronRight, Share2, Globe, Lock, Check } from 'lucide-react';
import '../styles/Playlists.css';

const Playlists: React.FC = () => {
  const { playlists, loading, deletePlaylist, togglePlaylistPrivacy } = usePlaylists();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleShare = (id: string) => {
    const shareUrl = `${window.location.origin}/shared/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div className="playlists__loading">Chargement de vos playlists...</div>;

  return (
    <div className="playlistsPage">
      <div className="playlistsPage__header">
        <h2 className="playlistsPage__title">
          Mes <span>Playlists</span>
        </h2>
        <p className="playlistsPage__count">{playlists.length} dossiers créés</p>
      </div>

      {playlists.length === 0 ? (
        <div className="playlistsPage__empty">
          <FolderHeart size={60} color="#333" />
          <p>Vous n'avez pas encore de playlist personnalisée.</p>
          <button onClick={() => navigate('/')}>Explorer des films</button>
        </div>
      ) : (
        <div className="playlistsPage__grid">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="playlistCard">
              <div className="playlistCard__top">
                <div className="playlistCard__icon">
                  <FolderHeart size={40} color="#e50914" />
                  <span className="playlistCard__badge">{playlist.itemCount}</span>
                </div>
                <div className="playlistCard__privacy">
                  <button 
                    className={`privacyBtn ${playlist.is_public ? 'public' : 'private'}`}
                    onClick={() => togglePlaylistPrivacy(playlist.id, !playlist.is_public)}
                    title={playlist.is_public ? "Rendre privée" : "Rendre publique"}
                  >
                    {playlist.is_public ? <Globe size={16} /> : <Lock size={16} />}
                    <span>{playlist.is_public ? 'Publique' : 'Privée'}</span>
                  </button>
                </div>
              </div>

              <div className="playlistCard__info">
                <h3>{playlist.name}</h3>
                <p>Créée le {new Date().toLocaleDateString()}</p>
              </div>

              <div className="playlistCard__actions">
                <div className="playlistCard__mainActions">
                  <button 
                    className="playlistCard__viewBtn"
                    onClick={() => navigate(`/playlists/${playlist.id}`)}
                  >
                    Ouvrir <ChevronRight size={16} />
                  </button>
                  
                  {playlist.is_public && (
                    <button 
                      className={`playlistCard__shareBtn ${copiedId === playlist.id ? 'copied' : ''}`}
                      onClick={() => handleShare(playlist.id)}
                    >
                      {copiedId === playlist.id ? <Check size={16} /> : <Share2 size={16} />}
                      {copiedId === playlist.id ? 'Copié !' : 'Partager'}
                    </button>
                  )}
                </div>
                
                <button 
                  className="playlistCard__deleteBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm('Supprimer cette playlist ?')) deletePlaylist(playlist.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;
