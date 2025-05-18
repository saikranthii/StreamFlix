import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Footer from '../components/Footer';
import './CookiePreferences.css';

function CookiePreferences() {
  const [settings, setSettings] = useState({
    essential: true,
    analytics: Cookies.get('analytics') === 'true',
    marketing: Cookies.get('marketing') === 'true',
  });

  const handleToggle = (key) => {
    if (key === 'essential') return;
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] };
      Cookies.set(key, newSettings[key], { expires: 365 });
      return newSettings;
    });
  };
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5001/api/cookies', settings);
      alert('Cookie preferences saved!');
    } catch (err) {
      alert('Error saving preferences.');
    }
  };

  return (
    <div className="cookie-preferences">
      <main>
        <h1>Cookie Preferences</h1>
        <p>Manage your cookie settings.</p>
        <div className="settings">
          <div className="setting">
            <label>Essential Cookies (Required)</label>
            <input type="checkbox" checked={settings.essential} disabled />
          </div>
          <div className="setting">
            <label>Analytics Cookies</label>
            <input
              type="checkbox"
              checked={settings.analytics}
              onChange={() => handleToggle('analytics')}
            />
          </div>
          <div className="setting">
            <label>Marketing Cookies</label>
            <input
              type="checkbox"
              checked={settings.marketing}
              onChange={() => handleToggle('marketing')}
            />
          </div>
          <button onClick={handleSave}>Save Preferences</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CookiePreferences;