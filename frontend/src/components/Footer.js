import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-column">
          <Link to="/audio-subtitles">Audio and Subtitles</Link>
          <Link to="/audio-description">Audio Description</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/gift-cards">Gift Cards</Link>
        </div>
        <div className="footer-column">
          <Link to="/media-center">Media Center</Link>
          <Link to="/investor-relations">Investor Relations</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/terms">Terms of Use</Link>
        </div>
        <div className="footer-column">
          <Link to="/privacy">Privacy</Link>
          <Link to="/legal-notices">Legal Notices</Link>
          <Link to="/cookie-preferences">Cookie Preferences</Link>
          <Link to="/corporate-info">Corporate Information</Link>
        </div>
        <div className="footer-column">
          <Link to="/contact">Contact Us</Link>
          <Link to="/speed-test">Speed Test</Link>
          <Link to="/ad-choices">Ad Choices</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 StreamFlix, Inc.
      </div>
    </footer>
  );
}

export default Footer;