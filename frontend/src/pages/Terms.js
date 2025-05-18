import React, { useState, useEffect } from 'react';
import './Terms.css';
import Footer from '../components/Footer'; // Adjust path if needed

const defaultTerms = [
  {
    section: '1. Acceptance of Terms',
    content:
      'By accessing or using StreamFlix, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree with any part of these terms, you must not use our services. Continued use of the service constitutes acceptance of any changes made to these terms.'
  },
  {
    section: '2. Subscription and Billing',
    content:
      'StreamFlix operates on a subscription basis. Billing occurs monthly on the day you subscribe. You can view and manage your billing information in your account settings. We reserve the right to modify subscription fees with prior notice.'
  },
  {
    section: '3. User Responsibilities',
    content:
      'You are responsible for maintaining the confidentiality of your account. You agree not to share your login credentials and not to use the service for illegal purposes. Misuse of the platform can result in termination of your account.'
  },
  {
    section: '4. Content Use Policy',
    content:
      'The content on StreamFlix is intended for personal and non-commercial use only. Downloading, distributing, or reproducing content is strictly prohibited without explicit permission from the copyright owner.'
  },
  {
    section: '5. Cancellation and Refunds',
    content:
      'You may cancel your subscription at any time through your account. Upon cancellation, you will continue to have access until the end of your billing cycle. Refunds are only issued for billing errors or service interruptions caused by us.'
  },
  {
    section: '6. Privacy and Data Collection',
    content:
      'We respect your privacy and only collect data essential for service delivery and improvement. Read our Privacy Policy to learn how we store and use your personal information.'
  },
  {
    section: '7. Account Termination',
    content:
      'We reserve the right to suspend or terminate your account if any suspicious, fraudulent, or abusive activity is detected. Reinstatement of your account will be considered on a case-by-case basis.'
  },
  {
    section: '8. Content Availability',
    content:
      'The availability of titles may change without notice due to licensing agreements. We strive to keep your favorite content available, but cannot guarantee permanent availability of any title.'
  },
  {
    section: '9. Service Interruptions',
    content:
      'Occasional interruptions for maintenance, upgrades, or outages may occur. While we aim to minimize these, we are not liable for service interruptions or downtime.'
  },
  {
    section: '10. Legal Compliance',
    content:
      'You agree to use the platform in accordance with all local, state, and federal laws. Any illegal or unauthorized use may lead to legal action against you.'
  },
  {
    section: '11. Modifications to Terms',
    content:
      'StreamFlix may update these terms at any time. Continued use after changes implies your agreement to the new terms. You are encouraged to review this page periodically.'
  },
  {
    section: '12. Contact and Support',
    content:
      'For questions, concerns, or technical support, please contact our support team at support@streamflix.com or visit the Help Center accessible from your account menu.'
  }
];

function Terms() {
  const [terms, setTerms] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTerms(defaultTerms);
  }, []);

  return (
    <div className="terms-page">
      <h1>Terms of Use</h1>
      <div className="terms-container">
        <div className="terms-sidebar">
          {terms.map((term, idx) => (
            <div
              key={idx}
              className={`sidebar-item ${idx === selectedIndex ? 'active' : ''}`}
              onClick={() => setSelectedIndex(idx)}
            >
              {term.section}
            </div>
          ))}
        </div>
        <div className="terms-content">
          {terms[selectedIndex] && (
            <>
              <h2>{terms[selectedIndex].section}</h2>
              <p>{terms[selectedIndex].content}</p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Terms;
