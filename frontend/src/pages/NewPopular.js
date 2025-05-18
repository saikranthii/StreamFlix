import React, { useState, useEffect } from 'react';
// import Header from '../components/Header';
import Row from '../components/Row';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import './NewPopular.css';

// Import posters
import kalkiPoster from '../data/Kalki.jpg';
import salaarPoster from '../data/salaar.jpg';
import chaavaPoster from '../data/chaava.jpg';
import rrrPoster from '../data/rrr.jpg';
import pushpa2Poster from '../data/pushpa2.jpg';
import hiNannaPoster from '../data/hinanna.jpg';
import mad2Poster from '../data/mad2.jpg';
import courtPoster from '../data/court.jpg';
import dragonPoster from '../data/rod.jpg';
import saripodaPoster from '../data/ss.jpg';
import saahoPoster from '../data/saaho.jpg';

function NewPopular() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('myList') || '[]'));
  const [notification, setNotification] = useState('');

  const trendingMovies = [
    { id: 900352, title: "Kalki 2898 AD", thumbnail: kalkiPoster, description: "A sci-fi epic set in a dystopian future." },
    { id: 934632, title: "Salaar", thumbnail: salaarPoster, description: "An action-packed saga of power and betrayal." },
    { id: 0, title: "Chaava", thumbnail: chaavaPoster, description: "A historical drama about bravery." },
    { id: 614933, title: "RRR", thumbnail: rrrPoster, description: "A revolutionary tale of friendship and rebellion." },
    { id: 614934, title: "Pushpa 2: The Rule", thumbnail: pushpa2Poster, description: "A gripping sequel to the smuggling saga." },
    { id: 1121402, title: "Hi Nanna", thumbnail: hiNannaPoster, description: "A heartwarming family drama." },
    { id: 1, title: "Mad2", thumbnail: mad2Poster, description: "A thrilling continuation of mystery." },
    { id: 297282, title: "Court", thumbnail: courtPoster, description: "A thought-provoking legal drama." },
    { id: 1560, title: "Return of the Dragon", thumbnail: dragonPoster, description: "A classic martial arts adventure." },
    { id: 2, title: "Saripoda Sanivaaram", thumbnail: saripodaPoster, description: "An intense vigilante story." },
    { id: 614932, title: "Saaho", thumbnail: saahoPoster, description: "A high-octane action thriller." },
  ];

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
    localStorage.setItem('myList', JSON.stringify(favorites));
    console.log('Favorites saved to localStorage:', favorites);
  }, [favorites]);

  const toggleFavorite = (item) => {
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === item.id);
      if (isFavorited) {
        console.log('Removing from favorites:', item.title);
        const updatedFavorites = prevFavorites.filter((fav) => fav.id !== item.id);
        setNotification(`"${item.title}" removed from favorites`);
        setTimeout(() => setNotification(''), 3000);
        return updatedFavorites;
      } else {
        setNotification(`"${item.title}" added to favorites`);
        setTimeout(() => setNotification(''), 3000);
        console.log('Adding to favorites:', item.title);
        return [...prevFavorites, item];
      }
    });
  };

  const handleMoreInfo = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="new-popular">
      {/* <Header /> */}
      <Row
        title="Trending Movies"
        items={trendingMovies}
        onMoreInfo={handleMoreInfo}
        favorites={favorites || []}
        toggleFavorite={toggleFavorite}
      />
      {notification && <div className="notification">{notification}</div>}
      {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      <Footer />
    </div>
  );
}

export default NewPopular;