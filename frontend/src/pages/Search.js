import React, { useState, useEffect, useRef } from 'react';
import Row from '../components/Row';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import './Search.css';

function Search() {
  const [searchTitle, setSearchTitle] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const suggestionCache = useRef(new Map());
  const debounceTimeout = useRef(null);

  const fetchWithTimeout = async (url, options, timeout = 15000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    if (suggestionCache.current.has(query)) {
      const cached = suggestionCache.current.get(query);
      setSuggestions(cached);
      cached.forEach(s => {
        if (s.poster && s.poster.includes('placeholder')) {
          console.warn(`Placeholder poster in cache for ${s.title} (ID: ${s.id})`);
        }
      });
      return;
    }

    try {
      const response = await fetchWithTimeout(
        'http://localhost:5000/autocomplete',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        },
        15000
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      data.forEach(s => {
        if (s.poster && s.poster.includes('placeholder')) {
          console.warn(`Placeholder poster for ${s.title} (ID: ${s.id})`);
        }
      });
      suggestionCache.current.set(query, data);
      setSuggestions(data);
    } catch (err) {
      console.error('Autocomplete error:', err);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchTitle(query);
    setResults([]);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 200);
  };

  const handleInputFocus = () => {
    setSuggestions([]);
    setResults([]);
    setError(null);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTitle(suggestion.title);
    setSuggestions([]);
    handleSearch(suggestion.title);
  };

  const handleSearch = async (title = searchTitle) => {
    if (!title.trim()) {
      setError('Please enter a movie title');
      setResults([]);
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      // Fetch exact match
      const movieResponse = await fetchWithTimeout(
        'http://localhost:5000/movie',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        },
        18000
      );

      let exactMatch = null;
      if (movieResponse.ok) {
        exactMatch = await movieResponse.json();
        if (exactMatch.error) {
          exactMatch = null;
        } else if (exactMatch.poster && exactMatch.poster.includes('placeholder')) {
          console.warn(`Placeholder poster for exact match ${exactMatch.title} (ID: ${exactMatch.id})`);
        }
      }

      // Fetch recommendations
      const recommendResponse = await fetchWithTimeout(
        'http://localhost:5000/recommend',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movie_title: title }),
        },
        18000
      );

      let recommendations = [];
      if (recommendResponse.ok) {
        recommendations = await recommendResponse.json();
        recommendations.forEach(r => {
          if (r.poster && r.poster.includes('placeholder')) {
            console.warn(`Placeholder poster for recommendation ${r.title} (ID: ${r.id})`);
          }
        });
      }

      if (exactMatch && !exactMatch.error) {
        const mappedResults = [
          {
            id: exactMatch.id,
            title: exactMatch.title,
            thumbnail: exactMatch.poster,
            description: `Language: ${exactMatch.original_language || 'N/A'}, Genres: ${exactMatch.genres || 'N/A'}`
          },
          ...recommendations.map((rec, i) => ({
            id: rec.id || i + 100,
            title: rec.title || 'Unknown Title',
            thumbnail: rec.poster,
            description: `Language: ${rec.original_language || 'N/A'}, Genres: ${rec.genres || 'N/A'}`
          }))
        ];
        setResults(mappedResults.slice(0, 6));
      } else if (recommendations.length > 0) {
        const mappedResults = recommendations.map((rec, i) => ({
          id: rec.id || i + 100,
          title: rec.title || 'Unknown Title',
          thumbnail: rec.poster,
          description: `Language: ${rec.original_language || 'N/A'}, Genres: ${rec.genres || 'N/A'}`
        }));
        setResults(mappedResults.slice(0, 5));
        setError('Exact movie not found, showing related movies');
      } else {
        setError('No results found');
        setResults([]);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMoreInfo = (item) => {
    setSelectedItem(item);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.search-bar') && !e.target.closest('.suggestions')) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="search">
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            value={searchTitle}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search for a movie"
            autoFocus
          />
          <button onClick={() => handleSearch()}>Search</button>
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <img
                    src={suggestion.poster}
                    alt={suggestion.title}
                    className="suggestion-poster"
                  />
                  <span>{suggestion.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {results.length > 0 && (
          <Row
            title={`Search Results for "${searchTitle}"`}
            items={results}
            onMoreInfo={handleMoreInfo}
          />
        )}
        {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </div>
      <Footer />
    </div>
  );
}

export default Search;