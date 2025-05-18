import React, { useRef, useState, useEffect } from 'react';
import Footer from '../components/Footer';
import './AudioSubtitles.css';

function AudioSubtitles() {
  const videoRef = useRef(null);
  const [audioTrack, setAudioTrack] = useState('en');
  const [subtitleTrack, setSubtitleTrack] = useState('none');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAudioChange = (track) => {
    setAudioTrack(track);
    alert(`Audio track changed to ${track}`);
    // For real audio track change, you need multiple audio sources or media APIs like Media Source Extensions.
  };

  const handleSubtitleChange = (track) => {
    setSubtitleTrack(track);
    const tracks = videoRef.current.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = track === 'none' ? 'disabled' : (tracks[i].language === track ? 'showing' : 'disabled');
    }
  };

  return (
    <div className="audio-subtitles">
      <main>
        <h1>Audio and Subtitles</h1>
        <p>Customize audio and subtitle settings for your content.</p>
        <video ref={videoRef} controls width="600">
          <source src="/videos/bb2.mp4" type="video/mp4" />
          <track kind="subtitles" src="/subtitles/en.vtt" srcLang="en" label="English" />
          <track kind="subtitles" src="/subtitles/es.vtt" srcLang="es" label="Spanish" />
        </video>
        <div className="settings">
          <div className="setting">
            <label>Audio Track:</label>
            <select value={audioTrack} onChange={(e) => handleAudioChange(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <div className="setting">
            <label>Subtitles:</label>
            <select value={subtitleTrack} onChange={(e) => handleSubtitleChange(e.target.value)}>
              <option value="none">None</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AudioSubtitles;
