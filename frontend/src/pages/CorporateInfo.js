import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import './CorporateInfo.css';

function CorporateInfo() {
  // Static data since you said no backend
  const info = {
    about:
      'StreamFlix, founded in 2020, is a global streaming service providing movies, series, and exclusive content to millions worldwide. Our mission is to entertain and inspire.',
    headquarters: '123 Stream Way, Los Angeles, CA 90001, USA',
    contact: 'info@streamflix.com | +1 800 555 1234',
    ceo: 'Jane Doe',
    founded: '2020',
    employees: '500+ worldwide',
    mission:
      'To bring the best streaming experience with cutting-edge technology and the most diverse content library.',
    vision:
      'To be the world’s leading entertainment platform that connects people through stories.',
    values:
      'Innovation, customer focus, diversity, integrity, and social responsibility.',
    legal: 'StreamFlix complies with all international laws and respects user privacy and copyrights.'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="corporate-info">
      <main>
        <h1>Corporate Information</h1>
        <div className="info-scroll-wrapper">
          <div className="info-container">
            <section id="about">
              <h3>About StreamFlix</h3>
              <p>{info.about}</p>
            </section>
            <section id="headquarters">
              <h3>Headquarters</h3>
              <p>{info.headquarters}</p>
            </section>
            <section id="contact">
              <h3>Contact</h3>
              <p>{info.contact}</p>
            </section>
            <section id="ceo">
              <h3>CEO</h3>
              <p>{info.ceo}</p>
            </section>
            <section id="founded">
              <h3>Founded</h3>
              <p>{info.founded}</p>
            </section>
            <section id="employees">
              <h3>Employees</h3>
              <p>{info.employees}</p>
            </section>
            <section id="mission">
              <h3>Mission</h3>
              <p>{info.mission}</p>
            </section>
            <section id="vision">
              <h3>Vision</h3>
              <p>{info.vision}</p>
            </section>
            <section id="values">
              <h3>Values</h3>
              <p>{info.values}</p>
            </section>
            <section id="legal">
              <h3>Legal</h3>
              <p>{info.legal}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CorporateInfo;
