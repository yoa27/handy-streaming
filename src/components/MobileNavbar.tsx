import React from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Home, TrendingUp, Sparkles, Film, Heart } from 'lucide-react';
import '../styles/MobileNavbar.css';

const MobileNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isActive = (path: string, category?: string) => {
    if (category) {
      return location.pathname === '/' && searchParams.get('category') === category;
    }
    return location.pathname === path && !searchParams.get('category');
  };

  return (
    <div className="mobileNav">
      <button 
        className={`mobileNav__item ${isActive('/', 'trending') ? 'active' : ''}`}
        onClick={() => navigate('/?category=trending')}
      >
        <TrendingUp size={20} />
        <span>Tendances</span>
      </button>

      <button 
        className={`mobileNav__item ${isActive('/', 'latest') ? 'active' : ''}`}
        onClick={() => navigate('/?category=latest')}
      >
        <Sparkles size={20} />
        <span>Nouveau</span>
      </button>

      <button 
        className={`mobileNav__item ${isActive('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <Home size={24} />
        <span>Accueil</span>
      </button>

      <button 
        className={`mobileNav__item ${isActive('/', 'movies') ? 'active' : ''}`}
        onClick={() => navigate('/?category=movies')}
      >
        <Film size={20} />
        <span>Films</span>
      </button>

      <button 
        className={`mobileNav__item ${isActive('/mylist') ? 'active' : ''}`}
        onClick={() => navigate('/mylist')}
      >
        <Heart size={20} />
        <span>Ma Liste</span>
      </button>
    </div>
  );
};

export default MobileNavbar;
