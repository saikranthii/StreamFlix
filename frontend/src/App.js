import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
// import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import NewPopular from './pages/NewPopular';
import MyList from './pages/MyList';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
// import Profile from './pages/Profile';
import AudioSubtitles from './pages/AudioSubtitles';
import AudioDescription from './pages/AudioDescription';
import Help from './pages/Help';
import GiftCards from './pages/GiftCards';
import MediaCenter from './pages/MediaCenter';
import InvestorRelations from './pages/InvestorRelations';
import Jobs from './pages/Jobs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import LegalNotices from './pages/LegalNotices';
import CookiePreferences from './pages/CookiePreferences';
import CorporateInfo from './pages/CorporateInfo';
import Contact from './pages/Contact';
import SpeedTest from './pages/SpeedTest';
import AdChoices from './pages/AdChoices';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/movies" element={<Movies />} /> */}
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/new-popular" element={<NewPopular />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="/search" element={<Search />} />
            <Route path="/notifications" element={<Notifications />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/audio-subtitles" element={<AudioSubtitles />} />
            <Route path="/audio-description" element={<AudioDescription />} />
            <Route path="/help" element={<Help />} />
            <Route path="/gift-cards" element={<GiftCards />} />
            <Route path="/media-center" element={<MediaCenter />} />
            <Route path="/investor-relations" element={<InvestorRelations />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/legal-notices" element={<LegalNotices />} />
            <Route path="/cookie-preferences" element={<CookiePreferences />} />
            <Route path="/corporate-info" element={<CorporateInfo />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/speed-test" element={<SpeedTest />} />
            <Route path="/ad-choices" element={<AdChoices />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;