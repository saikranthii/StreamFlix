import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import './GiftCards.css';

function GiftCards() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.match(/^[A-Z0-9]{10}$/)) {
      setMessage('Invalid gift card code (10 alphanumeric characters).');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/redeem-gift-card', { code });
      setMessage(response.data.message);
      setCode('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error redeeming gift card.');
    }
  };

  return (
    <div className="gift-cards">
      <main>
        <h1>Gift Cards</h1>
        <p>Redeem your StreamFlix gift card.</p>
        <form onSubmit={handleRedeem}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter gift card code"
            maxLength="10"
          />
          <button type="submit">Redeem</button>
        </form>
        {message && <p className="message">{message}</p>}
      </main>
      <Footer />
    </div>
  );
}

export default GiftCards;
