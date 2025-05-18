import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import './TVShows.css';

function TVShows() {
  const [tvShows, setTVShows] = useState([]);

  // Sample data if API fails
  const sampleTVShows = [
    {
      id: 1,
      title: 'Stranger Things',
      poster: 'https://m.media-amazon.com/images/M/MV5BMjg2NmM0MTEtYWY2Yy00NmFlLTllNTMtMjVkZjEwMGVlNzdjXkEyXkFqcGc@._V1_.jpg',
    },
    {
      id: 2,
      title: 'The Witcher',
      poster: 'https://m.media-amazon.com/images/M/MV5BMTQ5MDU5MTktMDZkMy00NDU1LWIxM2UtODg5OGFiNmRhNDBjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    },
    {
      id: 3,
      title: 'Breaking Bad',
      poster: 'https://image.tmdb.org/t/p/w342/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    },
    {
      id: 4,
      title: 'The Crown',
      poster: 'https://dnm.nflximg.net/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABT6-ilIJZPo41mx2cuziG5zyjn7BWGZZgBKTF7F8eheSGHPGzL8jiYiL9ie1lExbidAdcjqVmXZtCho0A8qMgY4UP5rJEbR6qtvNG5ZP3Ls_1FEqyPQTvTMNnybGFsb202NhmA.jpg?r=844',
    },
    {
      id: 5,
      title: 'Game of Thrones',
      poster: 'https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    },
    {
      id: 6,
      title: 'Sherlock',
      poster: 'https://m.media-amazon.com/images/M/MV5BNTQzNGZjNDEtOTMwYi00MzFjLWE2ZTYtYzYxYzMwMjZkZDc5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page

    const fetchTVShows = async () => {
      try {
        const response = await axios.get('http://localhost:5000/recommend?category=tv');
        setTVShows(response.data);
      } catch (error) {
        console.error('Failed to fetch TV shows:', error);
        setTVShows(sampleTVShows); // Fallback to sample data
      }
    };

    fetchTVShows();
  }); // Removed dependency array

  return (
    <div className="tv-shows">
      <main className="tv-shows-container">
        <h1>TV Shows</h1>
        {tvShows.length === 0 ? (
          <p className="no-tv-shows">No TV shows available.</p>
        ) : (
          <div className="tv-shows-grid">
            {tvShows.map((show) => (
              <div key={show.id} className="tv-show-card">
                <img
                  src={show.poster}
                  alt={show.title}
                  className="tv-show-poster"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x225?text=Poster';
                  }}
                />
                <h3 className="tv-show-title">{show.title}</h3>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default TVShows;