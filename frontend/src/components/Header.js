import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const logo = '/logo.png'; // Public folder logo

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header id="main-header" className={`header ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo-container">
        <div className="logo" style={{ backgroundImage: `url(${logo})` }}></div>
        <span className="logo-text">
          <svg
            className="logo-svg"
            viewBox="0 0 600 120"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id="textGradient"
                gradientUnits="userSpaceOnUse"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" className="gradient-start" />
                <stop offset="100%" className="gradient-end" />
              </linearGradient>
            </defs>
            <text
              x="10"
              y="90"
              fill="url(#textGradient)"
              className="svg-text"
            >
              STREAMFLIX
            </text>
          </svg>
          <span className="logo-fallback">STREAMFLIX</span>
        </span>
      </Link>
      <nav className="nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/tv-shows" className={location.pathname === '/tv-shows' ? 'active' : ''}>TV Shows</Link>
        <Link to="/new-popular" className={location.pathname === '/new-popular' ? 'active' : ''}>New & Popular</Link>
        <Link to="/my-list" className={location.pathname === '/my-list' ? 'active' : ''}>My List</Link>
        <Link to="/speed-test" className={location.pathname === '/speed-test' ? 'active' : ''}>Speed Test</Link>
      </nav>
      <div className="profile-section">
        <Link to="/search">
          <i className="fas fa-search search-icon" />
        </Link>
        <Link to="/notifications">
          <i className="fas fa-bell bell-icon" />
        </Link>
        {/* <Link to="/profile">
          <div className="profile" />
        </Link> */}
      </div>
    </header>
  );
}

export default Header;