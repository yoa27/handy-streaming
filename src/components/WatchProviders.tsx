import React, { useState, useEffect } from 'react';
import axios, { requests } from '../services/tmdb';

interface WatchProvidersProps {
  mediaType: 'movie' | 'tv';
  id: number | string;
}

const WatchProviders: React.FC<WatchProvidersProps> = ({ mediaType, id }) => {
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const url = mediaType === 'tv' ? requests.fetchTvProviders(id) : requests.fetchMovieProviders(id);
        const response = await axios.get(url);
        // On récupère les fournisseurs français (FR) en mode "flatrate" (abonnement)
        const frProviders = response.data.results?.FR?.flatrate || [];
        setProviders(frProviders);
      } catch (error) {
        console.error("Erreur providers:", error);
      }
    }
    fetchProviders();
  }, [mediaType, id]);

  if (providers.length === 0) return null;

  return (
    <div className="watchProviders">
      <span className="watchProviders__text">Disponible sur :</span>
      <div className="watchProviders__logos">
        {providers.map((provider) => (
          <img 
            key={provider.provider_id}
            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
            alt={provider.provider_name}
            title={provider.provider_name}
            className="watchProviders__logo"
          />
        ))}
      </div>
    </div>
  );
};

export default WatchProviders;
