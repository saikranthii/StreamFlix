import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import './AdChoices.css';

function AdChoices() {
  const [settings, setSettings] = useState({
    personalizedAds: true,
    interestBasedAds: true,
    locationBasedAds: false,
    adFrequencyCapping: true,
    adDataSharing: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on load

    // Simulate fetching settings from backend or fallback static values
    const fetchSettings = async () => {
      try {
        // Uncomment when backend is ready
        // const response = await axios.get('http://localhost:5001/api/ad-preferences');
        // setSettings(response.data);
        
        // For static fallback demo:
        setSettings({
          personalizedAds: true,
          interestBasedAds: true,
          locationBasedAds: false,
          adFrequencyCapping: true,
          adDataSharing: false,
        });
      } catch (err) {
        setError('Failed to load preferences.');
      }
    };
    fetchSettings();
  }, []);

  // Toggle one setting by key
  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    // Here you could post to backend to save preferences
    // e.g. axios.post('/api/ad-preferences', newSettings)
    localStorage.setItem('adSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="ad-choices">
      <main>
        <h1>Ad Choices</h1>
        <p>Manage your advertising preferences below:</p>
        {error && <p className="error">{error}</p>}
        <div className="settings-wrapper">
          {Object.entries(settings).map(([key, value]) => (
            <div className="setting" key={key}>
              <label htmlFor={key}>
                {key
                  .replace(/([A-Z])/g, ' $1') // add space before capitals
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                id={key}
                type="checkbox"
                checked={value}
                onChange={() => handleToggle(key)}
              />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdChoices;
