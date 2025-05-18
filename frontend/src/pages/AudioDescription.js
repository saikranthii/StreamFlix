import React, { useRef, useState, useEffect } from 'react';
import Footer from '../components/Footer';
import './AudioDescription.css';

function AudioDescription() {
  const videoRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleToggle = () => {
    if (videoRef.current && videoRef.current.textTracks.length > 0) {
      const track = videoRef.current.textTracks[0];
      const shouldEnable = !enabled;
      track.mode = shouldEnable ? 'showing' : 'disabled';
      setEnabled(shouldEnable);
    }
  };

  return (
    <div className="audio-description">
      <main>
        <h1>Audio Description</h1>
        <p>Enable audio descriptions for accessibility.</p>
        <video ref={videoRef} controls width="600">
          <source src="/videos/bb2.mp4" type="video/mp4" />
          <track
            kind="descriptions"
            src="/descriptions/ad.vtt"
            srcLang="en"
            label="English Audio Description"
          />
        </video>
        <div className="setting">
          <label>Audio Description:</label>
          <button onClick={handleToggle}>
            {enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AudioDescription;
