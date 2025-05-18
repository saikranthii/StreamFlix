import React, { useEffect } from 'react';
import Footer from '../components/Footer';
import './MediaCenter.css';

const staticArticles = [
  { id: 1, title: 'New Series Announced', date: '2025-04-01', content: 'A thrilling series coming this summer to StreamFlix.' },
  { id: 2, title: 'Global Expansion', date: '2025-03-15', content: 'StreamFlix is now available in 10 new countries worldwide.' },
  { id: 3, title: 'Award-Winning Films Added', date: '2025-03-01', content: 'Explore our new collection of award-winning movies and documentaries.' },
  { id: 4, title: 'Mobile App Update', date: '2025-02-20', content: 'Our mobile app just got faster and more user-friendly with the latest update.' },
  { id: 5, title: 'Exclusive Interview with Cast', date: '2025-02-10', content: 'Get behind the scenes with the cast of our hit original series.' },
  { id: 6, title: 'Streaming Tips & Tricks', date: '2025-01-30', content: 'Learn how to optimize your streaming experience on any device.' },
  { id: 7, title: 'New Kids Section', date: '2025-01-15', content: 'A safe and fun space for kids with parental controls and curated content.' },
  { id: 8, title: 'Holiday Specials Coming Soon', date: '2024-12-10', content: 'Celebrate with holiday-themed movies and series starting next week.' },
  { id: 9, title: 'Top 10 Trending Now', date: '2024-11-25', content: 'Check out what everyone is watching right now on StreamFlix.' },
  { id: 10, title: 'Behind the Music', date: '2024-11-10', content: 'Discover the music that makes your favorite shows unforgettable.' },
  { id: 11, title: 'Interactive Watch Parties', date: '2024-10-30', content: 'Host watch parties and chat with friends while watching your favorite shows.' },
  { id: 12, title: 'New Documentary Releases', date: '2024-10-15', content: 'Dive into real stories with our latest documentary releases.' },
  { id: 13, title: 'Subscription Plan Changes', date: '2024-10-01', content: 'Learn about our new flexible subscription plans designed for you.' },
  { id: 14, title: 'Tech Behind StreamFlix', date: '2024-09-20', content: 'A look at the innovative technology powering your streaming experience.' },
  { id: 15, title: 'User Experience Survey', date: '2024-09-05', content: 'Help us improve by taking our quick user experience survey.' },
  { id: 16, title: 'New Originals Preview', date: '2024-08-22', content: 'Sneak peek at the new original shows coming this fall.' },
  { id: 17, title: 'Enhanced Security Features', date: '2024-08-10', content: 'Your account security just got stronger with multi-factor authentication.' },
  { id: 18, title: 'Parental Controls Guide', date: '2024-07-28', content: 'Set up and customize parental controls for your family.' },
  { id: 19, title: 'Offline Viewing Improvements', date: '2024-07-15', content: 'Download your favorites faster and watch offline seamlessly.' },
  { id: 20, title: 'Community Events', date: '2024-07-01', content: 'Join StreamFlix-sponsored events and meet fellow fans.' },
];

function MediaCenter() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="media-center">
      <main>
        <h1>Media Center</h1>
        <p>Latest news from StreamFlix.</p>
        <div className="media-container">
          <div className="articles">
            {staticArticles.map(({ id, title, date, content }) => (
              <div key={id} className="article">
                <h3>{title}</h3>
                <p className="date">
                  {new Date(date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>{content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MediaCenter;
