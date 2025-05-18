import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('Please fill all fields.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/contact', formData);
      setStatus(response.data.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error sending message.');
    }
  };

  return (
    <div className="contact">
      <main>
        <h1>Contact Us</h1>
        <p>Send us a message.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
            ></textarea>
          </div>
          <button type="submit">Send</button>
        </form>
        {status && <p className="status">{status}</p>}
      </main>
      <Footer />
    </div>
  );
}

export default Contact;