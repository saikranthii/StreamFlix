import React, { useRef } from 'react';
import Tile from './Tile';
import './Row.css';

function Row({ title, items, onMoreInfo, favorites = [], toggleFavorite }) {
  const tilesRef = useRef(null);

  const scroll = (direction) => {
    if (tilesRef.current) {
      const scrollAmount = 300;
      const currentScroll = tilesRef.current.scrollLeft;
      const maxScroll = tilesRef.current.scrollWidth - tilesRef.current.clientWidth;
      const newScroll = currentScroll + (direction * scrollAmount);
      const finalScroll = Math.max(0, Math.min(newScroll, maxScroll));
      tilesRef.current.scrollLeft = finalScroll;
      console.log('Scrolling to:', finalScroll);
    } else {
      console.log('tilesRef is null, cannot scroll');
    }
  };

  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <button className="slider-arrow left-arrow" onClick={() => scroll(-1)}>
        <i className="fas fa-chevron-left arrow-icon" />
      </button>
      <button className="slider-arrow right-arrow" onClick={() => scroll(1)}>
        <i className="fas fa-chevron-right arrow-icon" />
      </button>

      {/* Scrollable wrapper */}
      <div className="tiles-wrapper" ref={tilesRef}>
        <div className="tiles">
          {items.map((item) => (
            <Tile
              key={item.id}
              item={item}
              onMoreInfo={onMoreInfo}
              isFavorited={favorites.some((fav) => fav.id === item.id)}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Row;