import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios, { requests } from '../services/tmdb';
import { 
  ChevronLeft, Star, Calendar, Clock, Play, 
  Heart, ListPlus, ExternalLink, Globe
} from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import PlaylistModal from '../components/PlaylistModal';
import { useAuth } from '../hooks/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import '../styles/Watch.css';

const Watch: React.FC = () => {
  const { mediaType, id } = useParams<{ mediaType: string; id: string }>();
  const navigate = useNavigate();
  const playerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  
  const [details, setDetails] = useState<any>(null);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodesList, setEpisodesList] = useState<any[]>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  useEffect(() => {
    async function fetchMainDetails() {
      try {
        const url = mediaType === 'tv' ? requests.fetchTvDetails(id!) : requests.fetchMovieDetails(id!);
        const response = await axios.get(url);
        setDetails(response.data);
      } catch (error) {
        console.error("Erreur détails:", error);
      }
    }
    fetchMainDetails();
    window.scrollTo(0, 0);
  }, [mediaType, id]);

  useEffect(() => {
    async function fetchEpisodes() {
      if (mediaType === 'tv' && id) {
        try {
          const response = await axios.get(requests.fetchSeasonDetails(id, season));
          setEpisodesList(response.data.episodes || []);
        } catch (error) {
          console.error("Erreur épisodes:", error);
        }
      }
    }
    fetchEpisodes();
  }, [mediaType, id, season]);

  const streamUrl = mediaType === 'tv'
    ? `https://frembed.one/embed/serie/${id}?sa=${season}&epi=${episode}`
    : `https://frembed.one/embed/movie/${id}`;

  const scrollToPlayer = () => {
    playerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert("Vous devez être connecté pour gérer vos favoris.");
      navigate('/login');
      return;
    }
    
    if (isFavorite(parseInt(id!))) {
      await removeFromFavorites(parseInt(id!));
    } else {
      await addToFavorites({
        id: parseInt(id!),
        title: details.title || details.name,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        overview: details.overview,
        media_type: mediaType
      });
    }
  };

  const handlePlaylistClick = () => {
    if (!user) {
      alert("Vous devez être connecté pour gérer vos playlists.");
      navigate('/login');
      return;
    }
    setShowPlaylistModal(true);
  };

  if (!details) return <div className="watch__loading">Chargement de l'expérience Cinéma...</div>;

  const cast = details.credits?.cast?.slice(0, 7) || [];
  
  // Filtrage des doublons dans les recommandations
  const rawRecommendations = details.recommendations?.results || [];
  const recommendations = Array.from(new Map(rawRecommendations.map((item: any) => [item.id, item])).values()).slice(0, 10);

  return (
    <div className="watch">
      {/* Bouton Retour Flottant */}
      <button onClick={() => navigate(-1)} className="watch__floatingBack">
        <ChevronLeft size={24} />
      </button>

      {/* Nouvelle Présentation Immersive (Inspirée de la capture) */}
      <div className="watch__presentationHero" style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), #050505), url(https://image.tmdb.org/t/p/original${details.backdrop_path})` 
      }}>
        <div className="watch__presContainer">
          
          {/* Colonne Gauche : Poster & Boutons */}
          <div className="watch__presLeft">
            <div className="watch__presPoster">
              <img src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} alt={details.title || details.name} />
            </div>
            <button className="watch__presTrailerBtn" onClick={scrollToPlayer}>
              <Play size={18} fill="white" /> Bande-annonce
            </button>
            <div className="watch__presActions">
              <button 
                className={`watch__presSmallBtn ${isFavorite(parseInt(id!)) ? 'active' : ''}`} 
                onClick={handleFavoriteToggle}
              >
                <Heart size={18} fill={isFavorite(parseInt(id!)) ? "#e50914" : "none"} color={isFavorite(parseInt(id!)) ? "#e50914" : "white"} /> 
                {isFavorite(parseInt(id!)) ? 'Favori' : 'Favoris'}
              </button>
              <button className="watch__presSmallBtn" onClick={handlePlaylistClick}>
                <ListPlus size={18} /> Playlist
              </button>
            </div>
          </div>

          {/* Colonne Centre : Infos & Synopsis */}
          <div className="watch__presCenter">
            <p className="watch__presSubtitle">STREAMING GRATUIT • VF • VOSTFR • HD 1080P • SANS INSCRIPTION</p>
            <h1 className="watch__presTitle">{details.title || details.name} <span>({(details.release_date || details.first_air_date || '').split('-')[0]})</span></h1>
            
            <div className="watch__presBadges">
              <div className="watch__presBadge watch__presBadge--rating">
                <Star size={14} fill="#f39c12" color="#f39c12" /> {details.vote_average?.toFixed(1)}
              </div>
              {details.runtime && (
                <div className="watch__presBadge">
                  <Clock size={14} /> {details.runtime} min
                </div>
              )}
              <div className="watch__presBadge">
                <Calendar size={14} /> {(details.release_date || details.first_air_date || '').split('-')[0]}
              </div>
              <div className="watch__presBadge">
                <Globe size={14} /> FR
              </div>
              <div className="watch__presBadge watch__presBadge--link">TMDB <ExternalLink size={10} /></div>
              <div className="watch__presBadge watch__presBadge--link">IMDB <ExternalLink size={10} /></div>
            </div>

            <div className="watch__presGenres">
              {details.genres?.slice(0, 3).map((g: any) => (
                <span key={g.id} className="watch__presGenre">{g.name}</span>
              ))}
            </div>

            <div className="watch__presSynopsis">
              <h3>SYNOPSIS</h3>
              <p>{details.overview}</p>
            </div>
          </div>

          {/* Colonne Droite : Casting */}
          <div className="watch__presRight">
            <div className="watch__castCard">
              <div className="watch__castHeader">
                <span>CASTING</span>
                <span className="watch__castCount">{details.credits?.cast?.length}</span>
              </div>
              <div className="watch__castListSmall">
                {cast.map((person: any) => (
                  <div key={person.id} className="watch__castItemSmall">
                    <img src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/40x40'} alt={person.name} />
                    <div className="watch__castNameSmall">
                      <p>{person.name}</p>
                      <span>{person.known_for_department === 'Directing' ? 'Réalisateur' : 'Acteur'}</span>
                    </div>
                    <Heart size={14} className="watch__castFav" />
                  </div>
                ))}
              </div>
              <button className="watch__castMoreBtn">Voir les {Math.max(0, (details.credits?.cast?.length || 0) - 7)} autres</button>
            </div>
          </div>

        </div>

        {/* Bouton Regarder Central */}
        <div className="watch__presRegarder" onClick={scrollToPlayer}>
           <Play size={24} color="#e50914" />
           <span>Regarder</span>
        </div>
      </div>

      <div className="watch__contentMain" ref={playerRef}>
        {/* Zone du Lecteur */}
        <div className="watch__playerArea">
          <div className="watch__playerContainer">
            <iframe
              key={streamUrl}
              src={streamUrl}
              className="watch__iframe"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
            ></iframe>
          </div>
        </div>

        {/* Épisodes (si c'est une série) */}
        {mediaType === 'tv' && (
          <div className="watch__tvControls">
            <div className="watch__selectors">
              <div className="watch__selector">
                <label>Saison</label>
                <select value={season} onChange={(e) => {
                  setSeason(parseInt(e.target.value));
                  setEpisode(1);
                }}>
                  {details.seasons?.filter((s: any) => s.season_number > 0).map((s: any) => (
                    <option key={s.id} value={s.season_number}>Saison {s.season_number}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="watch__episodesGridV2">
              <h3>Épisodes de la Saison {season}</h3>
              <div className="watch__epListV2">
                {episodesList.map((ep: any) => (
                  <div 
                    key={ep.id} 
                    className={`watch__epItemV2 ${episode === ep.episode_number ? 'active' : ''}`}
                    onClick={() => setEpisode(ep.episode_number)}
                  >
                    <div className="watch__epThumbV2">
                      <img src={ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : 'https://via.placeholder.com/300x169?text=No+Image'} alt={ep.name} />
                      <div className="watch__epOverlayV2"><Play fill="white" size={20} /></div>
                    </div>
                    <div className="watch__epInfoV2">
                      <p className="watch__epNumV2">Épisode {ep.episode_number}</p>
                      <p className="watch__epNameV2">{ep.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommandations */}
        {recommendations.length > 0 && (
          <div className="watch__recommendations">
            <h3 className="watch__sectionTitle">Vous pourriez aussi aimer</h3>
            <MovieGrid movies={recommendations} mediaType={mediaType as any} />
          </div>
        )}
      </div>
      
      {showPlaylistModal && (
        <PlaylistModal movie={details} onClose={() => setShowPlaylistModal(false)} />
      )}
    </div>
  );
};

export default Watch;
