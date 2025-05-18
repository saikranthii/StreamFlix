import React, { useEffect } from 'react';
import Footer from '../components/Footer';
import './LegalNotices.css';

function LegalNotices() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const notices = [
    { section: 'Copyright', content: '© StreamFlix, Inc. All rights reserved.' },
    { section: 'Trademarks', content: 'StreamFlix is a registered trademark in several countries.' },
    { section: 'Privacy Policy', content: 'We respect your privacy and are committed to protecting it.' },
    { section: 'Terms of Use', content: 'Use of this site is subject to terms and conditions.' },
    { section: 'Accessibility', content: 'We strive to make our content accessible to all users.' },
    { section: 'Content Guidelines', content: 'All content must comply with our usage policies.' },
    { section: 'User Submissions', content: 'By submitting content, you grant us rights to use it.' },
    { section: 'Third-party Links', content: 'We are not responsible for content on external sites.' },
    { section: 'Governing Law', content: 'These notices are governed by the laws of California.' },
    { section: 'Arbitration', content: 'Disputes shall be resolved through binding arbitration.' },
    { section: 'Severability', content: 'If any provision is held invalid, the rest shall remain in effect.' },
    { section: 'Modification of Terms', content: 'We reserve the right to modify these terms at any time.' },
    { section: 'Account Termination', content: 'We may suspend or terminate accounts at our discretion.' },
    { section: 'Contact Us', content: 'Reach out to legal@streamflix.com for any inquiries.' }
  ];

  return (
    <div className="legal-notices">
      <main>
        <h1>Legal Notices</h1>
        <div className="legal-container">
          {notices.map((notice, index) => (
            <div key={index} className="notice">
              <h3>{notice.section}</h3>
              <p>{notice.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LegalNotices;
