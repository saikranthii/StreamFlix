import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import './Help.css';

function Help() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    { id: 1, question: 'How do I reset my password?', answer: 'Go to Profile > Settings and select "Reset Password" to receive an email link.' },
    { id: 2, question: 'Why is my video buffering?', answer: 'Check your internet connection or lower video quality in Settings.' },
    { id: 3, question: 'Why can’t I log in to my account?', answer: 'Verify your email and password. Use "Forgot Password" if needed.' },
    { id: 4, question: 'How do I update my email address?', answer: 'Go to Profile > Account and enter a new email address.' },
    { id: 5, question: 'Why did my subscription payment fail?', answer: 'Check your payment method in Profile > Billing. Contact your bank if issues persist.' },
    { id: 6, question: 'How do I cancel my subscription?', answer: 'Navigate to Profile > Billing and select "Cancel Subscription".' },
    { id: 7, question: 'Why won’t my video load?', answer: 'Refresh the page or clear your browser cache. Try another device if needed.' },
    { id: 8, question: 'How do I find my downloaded content?', answer: 'Go to Menu > Downloads to view offline content.' },
    { id: 9, question: 'How do I enable two-factor authentication?', answer: 'Go to Profile > Security and toggle on Two-Factor Authentication.' },
    { id: 10, question: 'Why is some content unavailable in my region?', answer: 'Content varies by region due to licensing. Check our support page.' },
    { id: 11, question: 'How do I change my subscription plan?', answer: 'Visit Profile > Billing and select a new plan.' },
    { id: 12, question: 'Why is my app crashing?', answer: 'Update the app to the latest version or reinstall it.' },
    { id: 13, question: 'How do I contact customer support?', answer: 'Go to Help > Contact Us to submit a support ticket.' },
    { id: 14, question: 'Why is my video quality low?', answer: 'Adjust video quality in Settings or check your internet speed.' },
    { id: 15, question: 'How do I delete my account?', answer: 'Go to Profile > Account and select "Delete Account".' },
    { id: 16, question: 'Why am I seeing ads?', answer: 'Ads may appear on free plans. Upgrade to a premium plan for ad-free viewing.' },
    { id: 17, question: 'How do I download content for offline viewing?', answer: 'Select the download icon next to eligible content.' },
    { id: 18, question: 'Why is my payment method not working?', answer: 'Ensure your card details are correct in Profile > Billing.' },
    { id: 19, question: 'How do I manage parental controls?', answer: 'Go to Profile > Parental Controls to set restrictions.' },
    { id: 20, question: 'Why can’t I find a specific show?', answer: 'Use the search bar or check if it’s available in your region.' },
    { id: 21, question: 'How do I update my app?', answer: 'Visit your device’s app store and check for updates.' },
    { id: 22, question: 'Why is my account locked?', answer: 'Contact support via Help > Contact Us to resolve security issues.' },
    { id: 23, question: 'How do I share my account with family?', answer: 'Set up profiles in Profile > Manage Profiles for family members.' },
    { id: 24, question: 'Why is my video skipping?', answer: 'Check your internet connection or restart the app.' },
    { id: 25, question: 'How do I recover my account?', answer: 'Use "Forgot Password" or contact support with your account details.' },
    { id: 26, question: 'Why am I getting an error code?', answer: 'Note the error code and check our support page or contact support.' },
    { id: 27, question: 'How do I turn off subtitles?', answer: 'Go to video settings during playback and disable subtitles.' },
    { id: 28, question: 'Why is my download not working?', answer: 'Ensure you have enough storage and a stable connection.' },
    { id: 29, question: 'How do I change my profile picture?', answer: 'Go to Profile > Edit Profile and upload a new image.' },
    { id: 30, question: 'Why is my app slow?', answer: 'Clear app cache in Settings or reinstall the app.' },
    { id: 31, question: 'How do I check my subscription status?', answer: 'Visit Profile > Billing to view your plan details.' },
    { id: 32, question: 'Why can’t I cast to my TV?', answer: 'Ensure your device and TV are on the same Wi-Fi network.' },
    { id: 33, question: 'How do I provide feedback?', answer: 'Go to Help > Feedback to submit your suggestions.' },
    { id: 34, question: 'Why is my audio out of sync?', answer: 'Restart the video or adjust audio settings in playback.' },
    { id: 35, question: 'How do I switch languages?', answer: 'Change language in Profile > Language Settings.' },
    { id: 36, question: 'Why is my free trial not working?', answer: 'Verify eligibility in Profile > Billing or contact support.' },
    { id: 37, question: 'How do I manage notifications?', answer: 'Go to Profile > Notifications to customize alerts.' },
    { id: 38, question: 'Why can’t I access live content?', answer: 'Check if live content is available in your plan or region.' },
    { id: 39, question: 'How do I clear my watch history?', answer: 'Go to Profile > Viewing History and select "Clear History".' },
    { id: 40, question: 'Why is my device not supported?', answer: 'Check our support page for compatible devices.' },
    { id: 41, question: 'How do I redeem a promo code?', answer: 'Enter the code in Profile > Billing > Redeem Code.' },
    { id: 42, question: 'Why is my video black?', answer: 'Refresh the page or update your browser/app.' },
    { id: 43, question: 'How do I enable auto-play?', answer: 'Toggle auto-play in Profile > Playback Settings.' },
    { id: 44, question: 'Why was I charged unexpectedly?', answer: 'Review your billing history in Profile > Billing.' },
    { id: 45, question: 'How do I connect to a different server?', answer: 'Change server settings in Profile > Network.' },
    { id: 46, question: 'Why is my content not in HD?', answer: 'Ensure your plan supports HD and check your internet speed.' },
    { id: 47, question: 'How do I report a bug?', answer: 'Submit a bug report via Help > Contact Us.' },
    { id: 48, question: 'Why can’t I log out?', answer: 'Go to Profile > Sign Out or clear browser data.' },
    { id: 49, question: 'How do I check my data usage?', answer: 'View data usage in Profile > Account Settings.' },
    { id: 50, question: 'Why is my account suspended?', answer: 'Contact support via Help > Contact Us for assistance.' },
  ];

  // Filter only when searchQuery is not empty
  const filteredFaqs =
    searchQuery.trim() === ''
      ? []
      : faqs.filter((faq) => {
          const query = searchQuery.toLowerCase();
          return (
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
          );
        });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="help-page">
      <main className="help-container">
        <h1>Help Center</h1>
        <p>Search for answers or browse FAQs below.</p>

        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help topics..."
          />
        </div>

        <div className="faqs-scroll-container">
          {searchQuery.trim() === '' ? (
            <p style={{ marginTop: '1rem', color: '#666' }}>
              Please enter a search term to see questions.
            </p>
          ) : filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div key={faq.id} className="faq">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Help;
