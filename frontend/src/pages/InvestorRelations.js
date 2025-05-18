import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import './InvestorRelations.css';

function InvestorRelations() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/investor-relations');
        setData(response.data);
      } catch (err) {
        setError('Failed to load data.');
        setData({
          overview: 'StreamFlix is a leading streaming service.',
          reports: [{ year: 2024, revenue: '$1B' }],
          contact: 'ir@streamflix.com',
        });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="investor-relations">
      <main>
        <h1>Investor Relations</h1>
        {error && <p className="error">{error}</p>}
        {data && (
          <div className="info">
            <h3>Overview</h3>
            <p>{data.overview}</p>
            <h3>Financial Reports</h3>
            {data.reports.map((report, index) => (
              <p key={index}>{report.year}: {report.revenue}</p>
            ))}
            <h3>Contact</h3>
            <p>{data.contact}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default InvestorRelations;