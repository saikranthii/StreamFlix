import React, { useEffect } from 'react';
import Footer from '../components/Footer';
import './Notifications.css';

function Notifications() {
  // Scroll to the top smoothly when the component is loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sample notification data with relevant TMDB and tech images
  const notifications = [
    {
      id: 1,
      title: 'New Release: "The Cosmic Voyage"',
      message: 'Check out the new sci-fi blockbuster now streaming!',
      date: '2025-04-27',
      image: 'https://www.soundtrack.net/img/album/31038.jpg', // Interstellar (sci-fi)
    },
    {
      id: 2,
      title: 'Recommendation: "Mystery Manor"',
      message: 'We think you’ll love this thrilling mystery series.',
      date: '2025-04-26',
      image: 'https://assets.telegraphindia.com/telegraph/8285ba81-51c5-4c17-bd3f-f4b4c3df54bf.jpg', // Sherlock (mystery)
    },
    {
      id: 3,
      title: 'Speed Test Reminder',
      message: 'Test your connection to ensure smooth streaming.',
      date: '2025-04-25',
      image: 'https://img.freepik.com/premium-vector/internet-speed-test-gauge-speed-test-speedometer-vector-illustration_853484-222.jpg', // Speedometer
    },
  ];

  return (
    <div className="notifications">
      <main className="notifications-container">
        <h1>Notifications</h1>
        {notifications.length === 0 ? (
          <p className="no-notifications">No new notifications.</p>
        ) : (
          <ul className="notifications-list">
            {notifications.map((notification) => (
              <li key={notification.id} className="notification-card">
                <img
                  src={notification.image}
                  alt={notification.title}
                  className="notification-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/50?text=Image'; // Fallback
                  }}
                />
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span className="notification-date">{notification.date}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Notifications;
