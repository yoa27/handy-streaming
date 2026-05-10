import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">handy aime les pieds</Link>
            <p className="footer__tagline">Le meilleur du streaming français, 100% gratuit et sans limites.</p>
          </div>
          
          <div className="footer__links">
            <div className="footer__linkCol">
              <h4>Navigation</h4>
              <Link to="/">Accueil</Link>
              <Link to="/mylist">Ma Liste</Link>
            </div>
            <div className="footer__linkCol">
              <h4>Catégories</h4>
              <Link to="/">Films</Link>
              <Link to="/">Séries</Link>
              <Link to="/">Tendances</Link>
            </div>
            <div className="footer__linkCol">
              <h4>Aide</h4>
              <Link to="/">Contact</Link>
              <Link to="/">FAQ</Link>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} <span className="footer__siteName">handy aime les pieds</span>. Tous droits réservés.
          </p>
          <p className="footer__credit">
            Fait avec <Heart size={14} fill="#e50914" color="#e50914" /> pour le cinéma.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
