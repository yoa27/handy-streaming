import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import MyList from './pages/MyList';
import Watch from './pages/Watch';
import Login from './pages/Login';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import SharedPlaylist from './pages/SharedPlaylist';
import Navbar from './components/Navbar';
import MobileNavbar from './components/MobileNavbar';
import Footer from './components/Footer';
import { FavoritesProvider } from './hooks/useFavorites';
import { AuthProvider } from './hooks/AuthContext';
import { PlaylistsProvider } from './hooks/PlaylistContext';
import { PlaylistUIProvider } from './hooks/usePlaylistUI';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlaylistsProvider>
          <PlaylistUIProvider>
            <FavoritesProvider>
              <div className="app">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/mylist" element={<MyList />} />
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/playlists/:id" element={<PlaylistDetail />} />
                  <Route path="/shared/:id" element={<SharedPlaylist />} />
                  <Route path="/watch/:mediaType/:id" element={<Watch />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
                <Footer />
                <MobileNavbar />
              </div>
            </FavoritesProvider>
          </PlaylistUIProvider>
        </PlaylistsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
