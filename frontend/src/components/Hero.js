import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

function Hero({ item, onMoreInfo }) {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Show video after 3 seconds
  useEffect(() => {
    if (item?.video) {
      const timer = setTimeout(() => {
        setShowVideo(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [item]);

  // Handle user interaction to unmute
  useEffect(() => {
    const handleUserInteraction = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch((err) => {
          console.warn('Play error after interaction:', err);
        });
      }
      window.removeEventListener('click', handleUserInteraction);
    };

    if (showVideo) {
      window.addEventListener('click', handleUserInteraction);
    }

    return () => {
      window.removeEventListener('click', handleUserInteraction);
    };
  }, [showVideo]);

  // Pause video when out of view
  useEffect(() => {
    if (!showVideo || !videoRef.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            // Play if visible
            if (videoRef.current.paused) {
              videoRef.current.play().catch((err) =>
                console.warn('Play failed on re-entry:', err)
              );
            }
          } else {
            // Pause if not visible
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.5 } // At least 50% in view
    );

    const el = containerRef.current;
    observer.observe(el);

    return () => {
      observer.disconnect(); // Disconnect observer to prevent async callbacks
    };
  }, [showVideo]);

  if (!item) return null;

  return (
    <div
      className="hero"
      ref={containerRef}
      style={{
        backgroundImage: !showVideo && item.thumbnail ? `url(${item.thumbnail})` : 'none',
      }}
    >
      {showVideo && item.video ? (
        <video
          ref={videoRef}
          src={item.video}
          autoPlay
          loop
          playsInline
          muted
          className="hero-video"
          onError={(e) => console.error(`Video error for ${item.title}:`, e)}
        >
          <source src={item.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : null}

      <div className="hero-content">
        <h1 className="hero-title">{item.title}</h1>
        <p className="hero-description">{item.description}</p>
        <div className="hero-buttons">
          <button className="btn info-btn" onClick={() => onMoreInfo(item)}>
            <i className="fas fa-info-circle" /> More Info
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;