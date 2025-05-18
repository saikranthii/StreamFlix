import React, { useState } from 'react';
import blackPoster from '../data/black.jpg'; // Import blackPoster as a fallback
import './Modal.css';

function Modal({ item, onClose }) {
  // State to track if the image failed to load
  const [imageFailed, setImageFailed] = useState(false);

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

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times" />
        </button>
        <div className="modal__poster-wrapper">
          {!isBlackPoster && (
            <img
              className="modal__poster"
              src={item.thumbnail || blackPoster}
              alt={item.title}
              onError={() => {
                console.log(`Modal image failed to load for ${item.title}, using blackPoster`);
                setImageFailed(true);
              }}
            />
          )}
          {isBlackPoster && (
            <div
              className="modal__poster modal-no-poster-bg"
              style={{ backgroundImage: `url(${blackPoster})` }}
            >
              <div className="modal-no-poster-content">
                <span className="modal-first-letters">{firstLetters}</span>
                <span className="modal-no-poster-message">(oops! no poster found)</span>
              </div>
            </div>
          )}
        </div>
        <div className="modal-details">
          <h2 className="modal-title">{item.title}</h2>
          <p className="modal-description">{item.description}</p>
          <div className="modal-buttons">
            <button className="btn play-btn">
              <i className="fas fa-play" /> Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;