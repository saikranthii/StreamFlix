import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import Header from '../components/Header';
import Footer from '../components/Footer';
import './Privacy.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Privacy() {
  const [policy, setPolicy] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [selectedCsv, setSelectedCsv] = useState(null);
  const [csvData, setCsvData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPolicy = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/privacy');
        setPolicy(response.data);
      } catch (err) {
        console.error('Failed to fetch privacy policy:', err);
        // Fallback data
        setPolicy([
          {
            section: 'Privacy Collection',
            content: (
              <div>
                <h4>Overview of Data Collection</h4>
                <p>
                  Our platform is dedicated to providing a personalized movie recommendation experience, which requires collecting certain personal information. We gather data such as email addresses for account creation, user preferences to tailor content, and browsing history to understand your viewing habits. This data enables us to deliver relevant movie suggestions and improve platform functionality.
                </p>
                <h4>Types of Personal Data</h4>
                <p>
                  The personal data we collect includes identifiers like email addresses and usernames, as well as optional demographic details such as age, gender, or location if provided during profile setup. Interaction data, such as clicks, search queries, and time spent on specific titles, is also collected to refine recommendations. We may collect device information, such as IP addresses or browser types, to ensure compatibility and security.
                </p>
                <h4>Consent Mechanisms</h4>
                <p>
                  All data collection is consent-based, with clear opt-in prompts displayed at the point of data entry. For example, during account creation, users are informed about the data we collect and its purpose. You can withdraw consent or opt out of non-essential data collection at any time through your account settings, ensuring full control over your information.
                </p>
                <h4>Compliance with Regulations</h4>
                <p>
                  We adhere to global privacy regulations, including the General Data Protection Regulation (GDPR) in the EU and the California Consumer Privacy Act (CCPA) in the US. These laws grant you rights to access, correct, or delete your data. We process such requests within 30 days and provide clear instructions in our privacy portal for submitting requests.
                </p>
                <h4>Data Security Practices</h4>
                <p>
                  To protect your data, we implement robust security measures. Data in transit is secured with SSL/TLS encryption, and data at rest is encrypted using AES-256 standards. Access to personal information is limited to authorized personnel who undergo regular training. We conduct security audits and penetration testing to identify and address vulnerabilities.
                </p>
                <h4>User Rights and Portability</h4>
                <p>
                  You have the right to access your data, request corrections, or delete it entirely. We support data portability, allowing you to download your data in a structured, machine-readable format. For users under 16, we require verified parental consent for data collection, ensuring compliance with laws like COPPA. Automated decision-making with significant effects is avoided without human oversight.
                </p>
                <h4>Data Sharing and Third Parties</h4>
                <p>
                  We do not share personal data with third parties for marketing without explicit consent. Anonymized, aggregated data may be shared with partners for analytics or service improvements, such as cloud providers or recommendation algorithm developers. For instance, we might share that “80% of users prefer action movies,” but this data cannot identify individuals.
                </p>
                <h4>Data Minimization</h4>
                <p>
                  We practice data minimization, collecting only what is necessary for our services. For example, we do not require phone numbers or other sensitive details unless directly relevant. Anonymous browsing is available, though it limits personalization features. Data retention is limited to the period needed, typically 90 days for browsing history, unless you opt to retain it longer.
                </p>
                <h4>Support and Transparency</h4>
                <p>
                  Our Data Protection Officer is available 24/7 at privacy@platform.com to address your concerns. Our website includes a comprehensive FAQ section covering topics like data deletion and opt-out processes. We provide a user-friendly privacy portal for managing preferences, and our support team responds promptly to inquiries.
                </p>
                <h4>Policy Updates and Audits</h4>
                <p>
                  We regularly review and update our privacy policy to reflect changes in regulations or practices. Users are notified of significant updates via email or in-app notifications. We conduct internal audits to ensure compliance with privacy standards and continuously improve our data protection measures, keeping your trust at the forefront of our operations.
                </p>
              </div>
            ),
          },
          {
            section: 'Data Collection',
            content: (
              <div>
                <p>Click a file to view its contents:</p>
                <ul>
                  <li>
                    <a href="#" onClick={() => handleCsvClick('movies.csv')}>
                      movies.csv
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={() => handleCsvClick('credits.csv')}>
                      credits.csv
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={() => handleCsvClick('TeluguMovies_enhanced.csv')}>
                      TeluguMovies_enhanced.csv
                    </a>
                  </li>
                </ul>
              </div>
            ),
          },
          {
            section: 'Data Usage',
            content: (
              <div>
                <h4>Personalized Content Delivery</h4>
                <p>
                  Our platform uses your data to deliver highly personalized movie recommendations. By analyzing your search queries, clicks, and viewing history, we identify patterns in your preferences. For example, if you frequently watch Telugu dramas, our algorithms prioritize similar titles, ensuring you discover content that resonates with your interests.
                </p>
                <h4>Platform Optimization</h4>
                <p>
                  Data is critical for enhancing platform functionality. We analyze aggregate usage to optimize search algorithms, improve filtering options, and streamline navigation. For instance, identifying that users often search for specific genres helps us create curated sections, while navigation data informs UI improvements like simplified menus or faster load times.
                </p>
                <h4>Usage Analytics</h4>
                <p>
                  We generate anonymized reports on platform usage to guide development and support research. These reports, such as “65% of users in India prefer Telugu movies,” are shared internally or with partners for market insights. No personal data is included, and partners receive only aggregated data to refine recommendation systems or analyze trends.
                </p>
                <h4>Data Security and Processing</h4>
                <p>
                  All data is processed in a secure environment with SSL/TLS encryption for transit and AES-256 encryption for storage. Access is restricted to authorized personnel, and we conduct regular security assessments to protect against threats. Our infrastructure is designed to ensure your data remains safe during analysis and storage.
                </p>
                <h4>Fraud Prevention</h4>
                <p>
                  We use data to detect and prevent fraudulent activity, such as unauthorized account access or suspicious payment attempts. Usage patterns are analyzed to identify anomalies, and minimal data is shared with partners like payment processors for compliance. Our support team is available to assist if you notice unusual activity.
                </p>
                <h4>Algorithm Fairness</h4>
                <p>
                  Our recommendation algorithms are designed to be fair and transparent. We regularly audit them to prevent biases, such as over-recommending certain genres. Users can view the basis for recommendations (e.g., “Based on your action movie views”) and adjust preferences. Significant automated decisions are reviewed by humans to ensure accuracy.
                </p>
                <h4>A/B Testing and Research</h4>
                <p>
                  We conduct A/B testing and surveys using anonymized data to evaluate new features, such as updated search filters. Participation is optional, and opting out does not affect core services. Research into recommendation technologies uses aggregated data to advance our platform without compromising your privacy.
                </p>
                <h4>Data Minimization and Retention</h4>
                <p>
                  We practice data minimization, collecting and retaining only what is necessary. For example, browsing history is retained for 90 days unless you opt to keep it longer. You can request data deletion within 30 days, per GDPR/CCPA requirements. Our retention policies are regularly reviewed to ensure compliance.
                </p>
                <h4>User Control and Transparency</h4>
                <p>
                  You have full control over how your data is used. Account settings allow you to opt out of personalization, manage data sharing, or request deletion. Our privacy portal provides clear instructions, and our Data Protection Officer is available at privacy@platform.com. We aim to balance personalization with user autonomy.
                </p>
                <h4>Data Usage Visualization</h4>
                <p>
                  To illustrate how we use your data, the line graph below shows the distribution of data usage across key categories. The accompanying table summarizes these figures, providing transparency into our practices. This visualization helps you understand the primary purposes of data processing on our platform.
                </p>
                <div className="chart-container">
                  <Line
                    data={{
                      labels: ['Recommendations', 'Analytics', 'Optimization', 'Fraud Prevention'],
                      datasets: [
                        {
                          label: 'Data Usage (%)',
                          data: [40, 30, 20, 10],
                          borderColor: '#e50914',
                          backgroundColor: 'rgba(229, 9, 20, 0.2)',
                          fill: true,
                          tension: 0.4,
                          pointRadius: 5,
                          pointHoverRadius: 8,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: { color: '#ffffff', font: { size: 12 } },
                        },
                        title: {
                          display: true,
                          text: 'Data Usage Distribution',
                          color: '#ffffff',
                          font: { size: 14 },
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw}%`,
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: { color: '#cccccc', font: { size: 10 } },
                          grid: { display: false },
                        },
                        y: {
                          beginAtZero: true,
                          max: 50,
                          ticks: {
                            color: '#cccccc',
                            font: { size: 10 },
                            stepSize: 10,
                          },
                          grid: { color: '#333' },
                          title: {
                            display: true,
                            text: 'Percentage (%)',
                            color: '#ffffff',
                            font: { size: 12 },
                          },
                        },
                      },
                    }}
                  />
                </div>
                <h4>Data Usage Summary</h4>
                <table className="data-usage-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Percentage (%)</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Recommendations</td>
                      <td>40%</td>
                      <td>Personalizing movie suggestions based on user preferences and viewing history.</td>
                    </tr>
                    <tr>
                      <td>Analytics</td>
                      <td>30%</td>
                      <td>Generating anonymized reports for platform improvements and market research.</td>
                    </tr>
                    <tr>
                      <td>Optimization</td>
                      <td>20%</td>
                      <td>Enhancing search, navigation, and UI based on usage patterns.</td>
                    </tr>
                    <tr>
                      <td>Fraud Prevention</td>
                      <td>10%</td>
                      <td>Detecting and preventing unauthorized access or suspicious activity.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ),
          },
        ]);
      }
    };
    fetchPolicy();
  }, []);

  const fetchCsvData = async (filename) => {
    console.log(`Fetching data for ${filename}`);
    try {
      let endpoint;
      if (filename === 'movies.csv') {
        endpoint = 'http://localhost:5000/api/csv/movies';
      } else if (filename === 'credits.csv') {
        endpoint = 'http://localhost:5000/api/csv/credits';
      } else if (filename === 'TeluguMovies_enhanced.csv') {
        endpoint = 'http://localhost:5000/api/csv/telugu';
      } else {
        throw new Error('Invalid CSV file');
      }

      const response = await axios.get(endpoint);
      console.log(`API response for ${filename}:`, response.data);
      const { headers, data } = response.data;
      if (!headers || !data || data.length <= 1) {
        throw new Error(`Invalid or empty data received for ${filename}`);
      }
      // Validate headers for movies.csv and TeluguMovies_enhanced.csv
      if (filename === 'movies.csv' && !headers.includes('Title')) {
        throw new Error("Missing 'Title' column in movies.csv");
      }
      if (filename === 'TeluguMovies_enhanced.csv' && !headers.includes('Title')) {
        throw new Error("Missing 'Title' column in TeluguMovies_enhanced.csv");
      }
      setCsvData({ headers, data: data.slice(1) }); // Skip header row
      console.log(`Set csvData for ${filename}:`, { headers, data: data.slice(1).slice(0, 5) }); // Log first 5 rows
    } catch (err) {
      console.error(`Failed to fetch ${filename}:`, err.message);
      // Fallback to synthetic data (only for debugging)
      let csv = '';
      let headers = [];
      if (filename === 'movies.csv') {
        headers = ['MovieId', 'Title', 'Genres'];
        csv = headers.join(',') + '\n';
        for (let i = 1; i <= 500; i++) {
          const genres = i % 3 === 0 ? 'Action|Adventure' : i % 2 === 0 ? 'Drama|Romance' : 'Comedy|Family';
          csv += `${i},Movie ${i} (202${i % 10}),${genres}\n`;
        }
      } else if (filename === 'credits.csv') {
        headers = ['MovieId', 'Cast', 'Crew'];
        csv = headers.join(',') + '\n';
        for (let i = 1; i <= 500; i++) {
          csv += `${i},Actor ${i}|Co-Actor ${i},Director ${i}\n`;
        }
      } else {
        headers = ['Id', 'Title', 'Genres', 'Original_Language'];
        csv = headers.join(',') + '\n';
        for (let i = 1; i <= 500; i++) {
          const genres = i % 3 === 0 ? 'Action|Drama' : i % 2 === 0 ? 'Comedy|Romance' : 'Drama|Thriller';
          csv += `${i},Telugu Movie ${i} (202${i % 10}),${genres},Telugu\n`;
        }
      }
      const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
      setCsvData({ headers: parsed.meta.fields, data: parsed.data.map(Object.values) });
      console.log(`Fallback csvData for ${filename}:`, { headers: parsed.meta.fields, data: parsed.data.slice(0, 5) });
    }
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    setSelectedCsv(null);
    setCsvData(null);
    console.log(`Nav clicked: ${section}`);
  };

  const handleCsvClick = (filename) => {
    setSelectedCsv(filename);
    fetchCsvData(filename);
    console.log(`CSV clicked: ${filename}`);
  };

  const handleBackClick = () => {
    setSelectedCsv(null);
    setCsvData(null);
    console.log('Back clicked');
  };

  const handleCloseClick = () => {
    setActiveSection(null);
    setSelectedCsv(null);
    setCsvData(null);
    console.log('Close clicked');
  };

  const renderSidePanel = () => {
    if (!activeSection && !selectedCsv) return null;

    console.log('Rendering side panel:', activeSection || selectedCsv);
    return (
      <div className="side-panel">
        <button className="close-button" onClick={handleCloseClick}>
          <i className="fas fa-times"></i>
        </button>
        {selectedCsv && csvData ? (
          <div>
            <div className="side-panel-header">
              <button className="back-button" onClick={handleBackClick}>
                <i className="fas fa-arrow-left"></i> Back
              </button>
              <h3>{selectedCsv}</h3>
            </div>
            <div className="table-container">
              <table className="csv-table">
                <thead>
                  <tr>
                    {csvData.headers.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell || 'N/A'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h3>{activeSection}</h3>
            {activeSection === 'Data Collection' && console.log('Rendering Data Collection')}
            {policy.find((item) => item.section === activeSection)?.content || <p>No details available.</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="privacy">
      {/* <Header /> */}
      <nav className="privacy-nav">
        <a
          href="#"
          className={activeSection === 'Privacy Collection' ? 'active' : ''}
          onClick={() => handleNavClick('Privacy Collection')}
        >
          Privacy Collection
        </a>
        <a
          href="#"
          className={activeSection === 'Data Collection' ? 'active' : ''}
          onClick={() => handleNavClick('Data Collection')}
        >
          Data Collection
        </a>
        <a
          href="#"
          className={activeSection === 'Data Usage' ? 'active' : ''}
          onClick={() => handleNavClick('Data Usage')}
        >
          Data Usage
        </a>
      </nav>
      <main></main>
      {renderSidePanel()}
      <Footer />
    </div>
  );
}

export default Privacy;