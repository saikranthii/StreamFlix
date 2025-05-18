import React, { useState, useEffect } from 'react';
// import Header from '../components/Header';
import Hero from '../components/Hero';
import Row from '../components/Row';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import './Home.css';

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
import baahubaliPoster from '../data/bb2.jpg';
import blackPoster from '../data/black.jpg';

function Home() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [recommendations, setRecommendations] = useState(() => {
    const saved = sessionStorage.getItem('recommendations');
    console.log('Initializing recommendations from sessionStorage:', saved);
    return saved ? JSON.parse(saved) : {};
  });
  const [initialRows, setInitialRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem('myList') || '[]')
  );
  const [notification, setNotification] = useState('');

  const staticMoviesWithLocalPosters = {
    Chaava: chaavaPoster,
    Mad2: mad2Poster,
    'Saripodhaa Sanivaaram': saripodaPoster,
    Saaho: saahoPoster,
    'Baahubali 2: The Conclusion': baahubaliPoster // Assuming same poster as Baahubali 1
  };

  const featuredItem = {
    id: 271726,
    title: 'Baahubali: The Conclusion',
    description: 'A Telugu epic about valor and sacrifice.',
    thumbnail: baahubaliPoster,
    video: '/videos/bb2.mp4',
    language: 'te',
    genres: ['Action', 'Period', 'Epic']
  };

  const initialRowsData = [
    {
      title: 'Trending Movies',
      items: [
        { id: 900352, title: 'Kalki 2898 AD', thumbnail: kalkiPoster, description: 'A futuristic film inspired by Hindu mythology.', language: 'te', isStatic: true, genres: ['Sci-Fi', 'Mythology', 'Action'] },
        { id: 934632, title: 'Salaar: Part 1 – Ceasefire', thumbnail: salaarPoster, description: 'An action-packed saga of power and betrayal.', language: 'te', isStatic: true, genres: ['Action', 'Drama', 'Epic'] },
        { id: 0, title: 'Chhaava', thumbnail: chaavaPoster, description: 'A historical drama about bravery.', isStatic: true, language: 'hi', genres: ['Historical', 'Action', 'Drama'] },
        { id: 614933, title: 'RRR', thumbnail: rrrPoster, description: 'A revolutionary tale of friendship and rebellion.', language: 'te', isStatic: true, genres: ['Action', 'Historical', 'Drama', 'Epic'] },
        { id: 614934, title: 'Pushpa 2: The Rule', thumbnail: pushpa2Poster, description: 'A gripping sequel to the smuggling saga.', language: 'te', isStatic: true, genres: ['Action', 'Drama'] },
        { id: 1121402, title: 'Hi Nanna', thumbnail: hiNannaPoster, description: 'A heartwarming family drama.', language: 'te', isStatic: true, genres: ['Romance', 'Drama'] },
        { id: 1, title: 'Mad2', thumbnail: mad2Poster, description: 'A thrilling continuation of mystery.', isStatic: true, language: 'te', genres: ['Comedy', 'Drama', 'Coming-of-Age'] },
        { id: 297282, title: 'Court', thumbnail: courtPoster, description: 'A thought-provoking legal drama.', language: 'mr', isStatic: true, genres: ['Drama', 'Legal'] },
        { id: 1560, title: 'Return of the Dragon', thumbnail: dragonPoster, description: 'A classic martial arts adventure.', language: 'en', isStatic: true, genres: ['Action', 'Comedy', 'Martial Arts'] },
        { id: 614932, title: 'Saaho', thumbnail: saahoPoster, description: 'A high-octane action thriller.', language: 'te', isStatic: true, genres: ['Action', 'Thriller'] },
        { id: 2, title: 'Saripodhaa Sanivaaram', thumbnail: saripodaPoster, description: 'An intense vigilante story.', isStatic: true, language: 'te', genres: ['Action', 'Thriller', 'Vigilante'] },
        { id: 301345, title: 'Baahubali 2: The Conclusion', thumbnail: baahubaliPoster, description: 'The epic conclusion of a warrior’s saga.', language: 'te', isStatic: true, genres: ['Action', 'Period', 'Epic'] }
      ]
    },
    {
      title: 'Watch It Again',
      items: [
        { id: 5, title: 'Inception', thumbnail: blackPoster, description: 'A mind-bending heist movie.', language: 'en', genres: ['Sci-Fi', 'Thriller'] },
        { id: 6, title: 'Titanic', thumbnail: blackPoster, description: 'A romantic disaster film.', language: 'en', genres: ['Romance', 'Drama'] }
      ]
    }
  ];

  // List of static movie titles for genre-based recommendations
  const staticMovieTitles = initialRowsData[0].items.map(item => item.title);

  // Clear recommendations from sessionStorage on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('Clearing recommendations from sessionStorage on unload');
      sessionStorage.removeItem('recommendations');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    window.scrollTo(0, 0);
    localStorage.setItem('myList', JSON.stringify(favorites));
    console.log('Favorites saved to localStorage:', favorites);
  }, [favorites]);

  // Save recommendations to sessionStorage
  useEffect(() => {
    console.log('Saving recommendations to sessionStorage:', recommendations);
    sessionStorage.setItem('recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

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

  const fetchRandomTeluguRecommendations = async (movieTitle, numMovies) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching ${numMovies} random Telugu recommendations for "${movieTitle}"...`);
      const response = await fetch('http://localhost:5000/random-telugu', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`/random-telugu response: status ${response.status}, statusText: ${response.statusText}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        console.log(`Received ${data.length} random Telugu recommendations for "${movieTitle}":`, data);
        const uniqueData = Array.from(new Map(data.map((item) => [item.title.toLowerCase(), item])).values());
        console.log(`After removing duplicates, ${uniqueData.length} unique Telugu recommendations for "${movieTitle}":`, uniqueData);
        const shuffled = uniqueData.sort(() => 0.5 - Math.random());
        const selectedRecommendations = shuffled.slice(0, Math.min(numMovies, uniqueData.length)).map((rec, i) => {
          console.log(`Processing recommendation ${i}:`, rec);
          const poster = rec.poster || blackPoster;
          console.log(`Poster for ${rec.title}:`, poster);
          if (!poster) {
            console.warn(`No poster found for ${rec.title}, using blackPoster`);
          }
          return {
            id: i + 200,
            title: rec.title,
            thumbnail: poster,
            description: `Language: ${rec.original_language || 'te'}, Genres: ${rec.genres || 'N/A'}`,
            language: 'te'
          };
        });
        setRecommendations((prev) => ({ ...prev, [movieTitle]: selectedRecommendations }));
      } else {
        throw new Error('Invalid data format from /random-telugu endpoint');
      }
    } catch (err) {
      console.error(`Error fetching random Telugu recommendations for "${movieTitle}":`, err);
      setError(`Network error fetching random recommendations: ${err.message}`);
      setRecommendations((prev) => ({ ...prev, [movieTitle]: [] }));
    } finally {
      setLoading(false);
    }
  };

  const fetchTeluguRecommendationsByGenre = async (movieTitle, genres, numMovies) => {
    setLoading(true);
    setError(null);
    // Normalize genres for backend
    const normalizedGenres = genres.map(genre => {
      switch (genre.toLowerCase()) {
        case 'epic mythological science fiction': return ['Sci-Fi', 'Mythology', 'Action'];
        case 'epic action drama': return ['Action', 'Drama', 'Epic'];
        case 'historical action drama': return ['Historical', 'Action', 'Drama'];
        case 'epic historical action drama': return ['Action', 'Historical', 'Drama', 'Epic'];
        case 'action drama': return ['Action', 'Drama'];
        case 'romantic drama': return ['Romance', 'Drama'];
        case 'coming-of-age comedy-drama': return ['Comedy', 'Drama', 'Coming-of-Age'];
        case 'legal drama': return ['Drama', 'Legal'];
        case 'martial arts action comedy': return ['Action', 'Comedy', 'Martial Arts'];
        case 'vigilante action thriller': return ['Action', 'Thriller', 'Vigilante'];
        case 'action thriller': return ['Action', 'Thriller'];
        case 'epic period action': return ['Action', 'Period', 'Epic'];
        default: return genre;
      }
    }).flat();
    console.log(`Normalized genres for "${movieTitle}":`, normalizedGenres);

    try {
      console.log(`Fetching ${numMovies} Telugu recommendations for "${movieTitle}" in genres: ${normalizedGenres.join(', ')}...`);
      const response = await fetch('http://localhost:5000/random-telugu-by-genre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genres: normalizedGenres, exclude_titles: staticMovieTitles })
      });
      console.log(`/random-telugu-by-genre response: status ${response.status}, statusText: ${response.statusText}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        console.log(`Received ${data.length} Telugu recommendations for "${movieTitle}":`, data);
        const uniqueData = Array.from(new Map(data.map((item) => [item.title.toLowerCase(), item])).values());
        console.log(`After removing duplicates, ${uniqueData.length} unique Telugu recommendations for "${movieTitle}":`, uniqueData);
        const shuffled = uniqueData.sort(() => 0.5 - Math.random());
        const selectedRecommendations = shuffled.slice(0, Math.min(numMovies, uniqueData.length)).map((rec, i) => {
          console.log(`Processing recommendation ${i}:`, rec);
          const poster = rec.poster || blackPoster;
          console.log(`Poster for ${rec.title}:`, poster);
          if (!poster) {
            console.warn(`No poster found for ${rec.title}, using blackPoster`);
          }
          return {
            id: i + 200,
            title: rec.title,
            thumbnail: poster,
            description: `Language: ${rec.original_language || 'te'}, Genres: ${rec.genres || 'N/A'}, Year: ${rec.release_year || 'N/A'}`,
            language: 'te'
          };
        });
        setRecommendations((prev) => ({ ...prev, [movieTitle]: selectedRecommendations }));
      } else {
        throw new Error('Invalid data format from /random-telugu-by-genre endpoint');
      }
    } catch (err) {
      console.warn(`Failed to fetch genre-based recommendations for "${movieTitle}": ${err.message}. Falling back to random Telugu recommendations.`);
      await fetchRandomTeluguRecommendations(movieTitle, numMovies);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosterForMovie = async (movieTitle) => {
    try {
      console.log(`Fetching poster for "${movieTitle}" via /recommend endpoint...`);
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie_title: movieTitle })
      });
      if (!response.ok) {
        console.warn(`Failed to fetch poster for "${movieTitle}": HTTP status ${response.status}, ${response.statusText}`);
        return blackPoster;
      }
      const data = await response.json();
      console.log(`Poster fetch response for "${movieTitle}":`, data);
      if (Array.isArray(data) && data.length > 0) {
        const firstMovie = data[0];
        if (firstMovie.poster && typeof firstMovie.poster === 'string' && firstMovie.poster.trim() !== '') {
          console.log(`Valid poster found for "${movieTitle}":`, firstMovie.poster);
          return firstMovie.poster;
        } else {
          console.warn(`No valid poster field in response for "${movieTitle}":`, firstMovie);
          return blackPoster;
        }
      } else {
        console.warn(`Empty or invalid response for "${movieTitle}" when fetching poster`);
        return blackPoster;
      }
    } catch (err) {
      console.error(`Error fetching poster for "${movieTitle}":`, err);
      return blackPoster;
    }
  };

  const fetchRecommendations = async (movieTitle) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching recommendations for "${movieTitle}"...`);
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie_title: movieTitle })
      });
      const data = await response.json();
      console.log(`Response for /recommend: status ${response.status}, data:`, data);
      if (response.ok && Array.isArray(data) && data.length > 0) {
        const uniqueData = Array.from(new Map(data.map((item) => [item.title.toLowerCase(), item])).values());
        console.log(`After removing duplicates, ${uniqueData.length} unique recommendations for "${movieTitle}":`, uniqueData);
        const numRecs = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
        console.log(`Selecting ${numRecs} recommendations for "${movieTitle}"...`);
        const shuffled = uniqueData.sort(() => 0.5 - Math.random());
        const mappedRecommendations = shuffled.slice(0, Math.min(numRecs, uniqueData.length)).map((rec, i) => {
          const poster = rec.poster || blackPoster;
          console.log(`Poster for ${rec.title}:`, poster);
          if (!poster) {
            console.warn(`No poster found for ${rec.title}, using blackPoster`);
          }
          return {
            id: i + 100,
            title: rec.title,
            thumbnail: poster,
            description: `Language: ${rec.original_language || 'en'}, Genres: ${rec.genres || 'N/A'}`,
            language: rec.original_language || 'en'
          };
        });
        setRecommendations((prev) => ({ ...prev, [movieTitle]: mappedRecommendations }));
      } else {
        console.log(`No valid data from /recommend for "${movieTitle}"`);
        setRecommendations((prev) => ({ ...prev, [movieTitle]: [] }));
      }
    } catch (err) {
      console.error(`Network error for "${movieTitle}":`, err);
      setError(`Network error fetching recommendations: ${err.message}`);
      setRecommendations((prev) => ({ ...prev, [movieTitle]: [] }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const updatedRows = JSON.parse(JSON.stringify(initialRowsData));

        for (const row of updatedRows) {
          if (row.title === 'Watch It Again') {
            for (const item of row.items) {
              if (item.language === 'en') {
                const poster = await fetchPosterForMovie(item.title);
                item.thumbnail = poster;
              }
            }
          }
        }

        setInitialRows(updatedRows);

        if (featuredItem.language === 'te' && !recommendations[featuredItem.title]) {
          const numRecsForBaahubali = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
          console.log(`Fetching initial Baahubali recommendations (${numRecsForBaahubali})`);
          await fetchRandomTeluguRecommendations(featuredItem.title, numRecsForBaahubali);
        } else {
          console.log(`Skipping Baahubali recommendations fetch; already exists:`, recommendations[featuredItem.title]);
        }
      } catch (err) {
        setError('Failed to fetch initial data');
        console.error('Initial fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [recommendations]);

  const handleMoreInfo = (item) => {
    const updatedItem = { ...item };
    if (item.isStatic && staticMoviesWithLocalPosters[item.title]) {
      updatedItem.thumbnail = staticMoviesWithLocalPosters[item.title];
    }
    setSelectedItem(updatedItem);
    const numRecs = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    if (staticMovieTitles.includes(item.title)) {
      // For static movies, fetch genre-based Telugu recommendations
      fetchTeluguRecommendationsByGenre(item.title, item.genres, numRecs);
    } else if (item.language === 'te') {
      fetchRandomTeluguRecommendations(item.title, numRecs);
    } else {
      fetchRecommendations(item.title);
    }
  };

  return (
    <div className="home">
      {/* <Header /> */}
      <Hero
        item={featuredItem}
        onMoreInfo={handleMoreInfo}
        favorites={favorites || []}
        toggleFavorite={toggleFavorite}
      />
      {(initialRows.length > 0 ? initialRows : initialRowsData).map((row, index) => (
        <Row
          key={index}
          title={row.title}
          items={row.items}
          onMoreInfo={handleMoreInfo}
          favorites={favorites || []}
          toggleFavorite={toggleFavorite}
        />
      ))}
      {Object.entries(recommendations).map(([title, recs]) => (
        <Row
          key={`rec-${title}`}
          title={`Recommendations for ${title}`}
          items={recs}
          onMoreInfo={handleMoreInfo}
          favorites={favorites || []}
          toggleFavorite={toggleFavorite}
        />
      ))}
      {!Object.keys(recommendations).length && !loading && (
        <div className="no-recommendations">No recommendations loaded yet.</div>
      )}
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {notification && <div className="notification">{notification}</div>}
      <Footer />
    </div>
  );
}

export default Home;