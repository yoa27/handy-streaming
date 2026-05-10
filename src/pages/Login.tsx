import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithGoogle, signInWithGithub } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Veuillez utiliser la connexion Google ou GitHub pour ce prototype.");
  };

  return (
    <div className="login">
      <div className="login__overlay">
        <Link to="/" className="login__back">
          <ArrowLeft size={20} /> Retour
        </Link>
        
        <div className="login__card">
          <h1 className="login__logo">handy aime les pieds</h1>
          <h2>Accédez à votre compte</h2>
          
          <div className="login__socials">
            <button className="login__socialBtn login__socialBtn--google" onClick={signInWithGoogle}>
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" width="20" />
              Continuer avec Google
            </button>
            <button className="login__socialBtn login__socialBtn--github" onClick={signInWithGithub}>
              Continuer avec GitHub
            </button>
          </div>

          <div className="login__divider">
            <span>OU</span>
          </div>
          
          <form onSubmit={handleSubmit} className="login__form">
            <div className="login__inputGroup">
              <Mail size={18} className="login__inputIcon" />
              <input 
                type="email" 
                placeholder="E-mail" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="login__inputGroup">
              <Lock size={18} className="login__inputIcon" />
              <input 
                type="password" 
                placeholder="Mot de passe" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            
            <button type="submit" className="login__submitBtn">
              <LogIn size={20} /> CONNEXION
            </button>
          </form>
          
          <div className="login__footer">
            <p>Nouveau sur le site ? <Link to="/login">S'inscrire</Link></p>
            <Link to="/login" className="login__forgot">Mot de passe oublié ?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
