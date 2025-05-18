import React, { useState } from 'react';
import blackPoster from '../data/black.jpg'; // Import blackPoster as a fallback
import './Tile.css';

function Tile({ item, onMoreInfo, isFavorited = false, toggleFavorite }) {
  // State to track if the image failed to load
  const [imageFailed, setImageFailed] = useState(false);

  // Debug: Log the thumbnail value
  console.log(`Tile for ${item.title}: thumbnail =`, item.thumbnail);

  // Check if the thumbnail is missing or the image failed to load
  const isBlackPoster = !item.thumbnail || imageFailed;

  // Get the first letter of each word in the title
  const firstLetters = item.title
    ? item.title
        .split(/\s+/) // Split by whitespace to get words
        .filter(word => word.length > 0) // Filter out empty strings
        .map(word => word.charAt(0).toUpperCase()) // Get first letter of each word and uppercase it
        .join('') // Join the letters together
    : '';

  // Debug: Log whether this is a black poster and the first letters
  console.log(`Tile for ${item.title}: isBlackPoster =`, isBlackPoster);
  console.log(`Tile for ${item.title}: firstLetters =`, firstLetters);

  // Use blackPoster as a fallback if thumbnail is missing
  const backgroundImage = item.thumbnail || blackPoster;

  // Debug: Log the backgroundImage value
  console.log(`Tile for ${item.title}: backgroundImage =`, backgroundImage);

  return (
    <div
      className={`tile ${isBlackPoster ? 'tile-no-poster' : ''}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
      role="button"
      tabIndex={0}
      onClick={() => onMoreInfo(item)}
      onKeyPress={(e) => e.key === 'Enter' && onMoreInfo(item)}
      aria-label={`View details for ${item.title}`}
    >
      {/* Hidden img element to detect if the image fails to load */}
      <img
        src={item.thumbnail || blackPoster}
        alt=""
        style={{ display: 'none' }}
        onError={() => {
          console.log(`Image failed to load for ${item.title}, using blackPoster`);
          setImageFailed(true);
        }}
      />
      {isBlackPoster && (
        <div className="tile-no-poster-content">
          <span className="tile-first-letter">{firstLetters}</span>
          <span className="tile-no-poster-message">(oops! no poster found)</span>
        </div>
      )}
      <div className="tile-overlay">
        <p className="tile-title">{item.title}</p>
        <div className="tile-buttons">
          <i className="fas fa-play tile-btn play" aria-label="Play" />
          <i
            className="fas fa-info-circle tile-btn info"
            aria-label="More info"
            onClick={(e) => {
              e.stopPropagation();
              onMoreInfo(item);
            }}
          />
          <button
            className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item);
            }}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tile;