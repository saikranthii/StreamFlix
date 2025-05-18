import React, { useState, useEffect } from 'react';
import Row from '../components/Row';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import './MyList.css';

function MyList() {
  const [myList, setMyList] = useState(() => JSON.parse(localStorage.getItem('myList') || '[]'));
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    console.log('MyList loaded from localStorage:', myList);
    localStorage.setItem('myList', JSON.stringify(myList));
  }, [myList]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
    const handleStorageChange = (e) => {
      if (e.key === 'myList') {
        const updatedList = JSON.parse(e.newValue || '[]');
        console.log('MyList updated from storage event:', updatedList);
        setMyList(updatedList);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleMoreInfo = (item) => {
    setSelectedItem(item);
  };

  const toggleFavorite = (item) => {
    const isFavorited = myList.some((fav) => fav.id === item.id);
    if (isFavorited) {
      const updatedList = myList.filter((fav) => fav.id !== item.id);
      console.log('Removing from MyList:', item.title, 'New list:', updatedList);
      setMyList(updatedList);
      setNotification(`"${item.title}" removed from favorites`);
      setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
    } else {
      console.log('Item not in MyList, no action taken:', item.title);
    }
  };

  return (
    <div className="my-list">
      {/* <Header /> */}
      <h1>My List</h1>
      {myList.length > 0 ? (
        <Row
          title="Your Saved Movies"
          items={myList}
          onMoreInfo={handleMoreInfo}
          favorites={myList || []} // Default to empty array if undefined
          toggleFavorite={toggleFavorite}
        />
      ) : (
        <p className="empty-list">Your list is empty. Start adding movies!</p>
      )}
      {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {notification && <div className="notification">{notification}</div>}
      <Footer />
    </div>
  );
}

export default MyList;