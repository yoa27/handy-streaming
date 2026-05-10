import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { 
  Search, User, Home, Film, Tv, Sparkles, 
  TrendingUp, ChevronDown, LogOut, Heart, FolderHeart 
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [show, handleShow] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'trending';
  const { user, signOut } = useAuth();

  const transitionNavbar = () => {
    if (window.scrollY > 50) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', transitionNavbar);
    return () => window.removeEventListener('scroll', transitionNavbar);
  }, []);

  // Fermer le menu et la recherche si on clique ailleurs ou si on change de page
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav__userMenu') && !target.closest('.nav__search')) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${searchValue}`);
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  return (
    <nav className={`nav ${show && 'nav__black'} ${isSearchOpen ? 'nav--searchActive' : ''}`}>
      <div className="nav__contents">
        <div className="nav__left">
          <Link to="/" className="nav__logoBox">
            <span className="nav__logoText">handy aime les pieds</span>
          </Link>
          
          <div className="nav__links">
            <Link to="/" className={`nav__linkItem ${location.pathname === '/' && !searchParams.get('category') ? 'active' : ''}`}>
              <Home size={18} />
              <span>Accueil</span>
            </Link>
            <Link to="/?category=trending" className={`nav__linkItem ${currentCategory === 'trending' && location.pathname === '/' ? 'active' : ''}`}>
              <TrendingUp size={18} />
              <span>Tendances</span>
            </Link>
            <Link to="/?category=latest" className={`nav__linkItem ${currentCategory === 'latest' ? 'active' : ''}`}>
              <Sparkles size={18} />
              <span>Nouveautés</span>
            </Link>
            <Link to="/?category=movies" className={`nav__linkItem ${currentCategory === 'movies' ? 'active' : ''}`}>
              <Film size={18} />
              <span>Films</span>
            </Link>
            <Link to="/?category=tv" className={`nav__linkItem ${currentCategory === 'tv' ? 'active' : ''}`}>
              <Tv size={18} />
              <span>Séries</span>
            </Link>
          </div>
        </div>

        <div className="nav__right">
          <form onSubmit={handleSearch} className={`nav__search ${isSearchOpen ? 'active' : ''}`}>
            <Search className="nav__icon" size={20} onClick={toggleSearch} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus={isSearchOpen}
            />
          </form>
          
          <div className="nav__userArea">
            <div className={`nav__userMenu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
              <div className="nav__avatarCircle">
                {user?.user_metadata.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" width="35" height="35" />
                ) : (
                  <User size={20} fill="#3b82f6" color="#3b82f6" />
                )}
              </div>
              <div className="nav__userInfo">
                <p className="nav__userName">{user ? (user.user_metadata.full_name || user.email?.split('@')[0]) : 'invité'}</p>
                <span className="nav__userStatus">{user ? 'Membre' : 'Se connecter'}</span>
              </div>
              <ChevronDown size={16} className={`nav__chevron ${isMenuOpen ? 'rotate' : ''}`} />
              
              {user && isMenuOpen && (
                <div className="nav__dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="nav__dropdownItem" onClick={() => { navigate('/mylist'); setIsMenuOpen(false); }}>
                    <Heart size={16} /> Ma Liste
                  </div>
                  <div className="nav__dropdownItem" onClick={() => { navigate('/playlists'); setIsMenuOpen(false); }}>
                    <FolderHeart size={16} /> Mes Playlists
                  </div>
                  <div className="nav__dropdownDivider" />
                  <div className="nav__dropdownItem nav__logout" onClick={signOut}>
                    <LogOut size={16} /> Déconnexion
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
