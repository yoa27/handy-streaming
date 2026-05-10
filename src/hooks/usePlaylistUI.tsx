import React, { createContext, useContext, useState } from 'react';
import PlaylistModal from '../components/PlaylistModal';

interface PlaylistUIContextType {
  openPlaylistModal: (movie: any) => void;
}

const PlaylistUIContext = createContext<PlaylistUIContextType | undefined>(undefined);

export const PlaylistUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  const openPlaylistModal = (movie: any) => {
    setSelectedMovie(movie);
  };

  const closePlaylistModal = () => {
    setSelectedMovie(null);
  };

  return (
    <PlaylistUIContext.Provider value={{ openPlaylistModal }}>
      {children}
      {selectedMovie && (
        <PlaylistModal 
          movie={selectedMovie} 
          onClose={closePlaylistModal} 
        />
      )}
    </PlaylistUIContext.Provider>
  );
};

export const usePlaylistUI = () => {
  const context = useContext(PlaylistUIContext);
  if (!context) {
    throw new Error('usePlaylistUI must be used within a PlaylistUIProvider');
  }
  return context;
};
