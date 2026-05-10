import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';

interface Playlist {
  id: string;
  name: string;
  is_public: boolean;
  itemCount?: number;
}

interface PlaylistsContextType {
  playlists: Playlist[];
  loading: boolean;
  createPlaylist: (name: string) => Promise<string | null>;
  deletePlaylist: (id: string) => Promise<void>;
  addToPlaylist: (playlistId: string, movie: any) => Promise<void>;
  removeFromPlaylist: (playlistId: string, movieId: number) => Promise<void>;
  getPlaylistItems: (playlistId: string) => Promise<any[]>;
  togglePlaylistPrivacy: (id: string, isPublic: boolean) => Promise<void>;
  getSharedPlaylist: (id: string) => Promise<{ playlist: Playlist | null, items: any[] }>;
}

const PlaylistsContext = createContext<PlaylistsContextType | undefined>(undefined);

export const PlaylistsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    async function loadPlaylists() {
      setLoading(true);
      const { data, error } = await supabase
        .from('playlists')
        .select('*, playlist_items(count)')
        .eq('user_id', user?.id);

      if (!error && data) {
        const formatted = data.map(p => ({
          ...p,
          itemCount: p.playlist_items[0]?.count || 0
        }));
        setPlaylists(formatted);
      }
      setLoading(false);
    }

    loadPlaylists();
  }, [user]);

  const createPlaylist = async (name: string) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('playlists')
      .insert({ user_id: user.id, name, is_public: false })
      .select()
      .single();

    if (!error && data) {
      setPlaylists(prev => [...prev, { ...data, itemCount: 0 }]);
      return data.id;
    }
    return null;
  };

  const deletePlaylist = async (id: string) => {
    const { error } = await supabase.from('playlists').delete().eq('id', id);
    if (!error) {
      setPlaylists(prev => prev.filter(p => p.id !== id));
    }
  };

  const addToPlaylist = async (playlistId: string, movie: any) => {
    if (!user) return;
    const { error } = await supabase.from('playlist_items').insert({
      playlist_id: playlistId,
      user_id: user.id,
      movie_id: movie.id || movie.tmdb,
      title: movie.title || movie.name,
      poster_path: movie.poster_path || (movie.poster?.split('original')[1]),
      backdrop_path: movie.backdrop_path || '',
      overview: movie.overview || '',
      media_type: movie.media_type || (movie.first_air_date ? 'tv' : 'movie')
    });

    if (!error) {
      setPlaylists(prev => prev.map(p => 
        p.id === playlistId ? { ...p, itemCount: (p.itemCount || 0) + 1 } : p
      ));
    }
  };

  const removeFromPlaylist = async (playlistId: string, movieId: number) => {
    const { error } = await supabase
      .from('playlist_items')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('movie_id', movieId);

    if (!error) {
      setPlaylists(prev => prev.map(p => 
        p.id === playlistId ? { ...p, itemCount: Math.max(0, (p.itemCount || 0) - 1) } : p
      ));
    }
  };

  const getPlaylistItems = async (playlistId: string) => {
    const { data, error } = await supabase
      .from('playlist_items')
      .select('*')
      .eq('playlist_id', playlistId);
    
    return error ? [] : data;
  };

  const togglePlaylistPrivacy = async (id: string, isPublic: boolean) => {
    const { error } = await supabase
      .from('playlists')
      .update({ is_public: isPublic })
      .eq('id', id);

    if (!error) {
      setPlaylists(prev => prev.map(p => p.id === id ? { ...p, is_public: isPublic } : p));
    }
  };

  const getSharedPlaylist = async (id: string) => {
    const { data: playlist, error: pError } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', id)
      .eq('is_public', true)
      .single();

    if (pError || !playlist) return { playlist: null, items: [] };

    const { data: items } = await supabase
      .from('playlist_items')
      .select('*')
      .eq('playlist_id', id);

    return { playlist, items: items || [] };
  };

  return (
    <PlaylistsContext.Provider value={{ 
      playlists, loading, createPlaylist, deletePlaylist, 
      addToPlaylist, removeFromPlaylist, getPlaylistItems,
      togglePlaylistPrivacy, getSharedPlaylist
    }}>
      {children}
    </PlaylistsContext.Provider>
  );
};

export const usePlaylists = () => {
  const context = useContext(PlaylistsContext);
  if (!context) {
    throw new Error('usePlaylists must be used within a PlaylistsProvider');
  }
  return context;
};
