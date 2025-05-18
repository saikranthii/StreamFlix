const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.raw({ type: '*/*', limit: '100mb' })); // For binary uploads

// Test endpoint to confirm server version
app.get('/test', (req, res) => {
  console.log('GET /test requested');
  res.status(200).json({ message: 'StreamFlix server with upload endpoint', version: '2025-04-27' });
});

// Latency test endpoint
app.get('/', (req, res) => {
  console.log('GET / requested');
  res.status(200).json({ message: 'Ping successful' });
});

// Upload endpoint for speed test
app.post('/upload', (req, res) => {
  try {
    console.log('POST /upload received, size:', req.body.length / 1024 / 1024, 'MB');
    res.status(200).json({ message: 'Upload successful' });
  } catch (err) {
    console.error('Upload error:', err.message, 'Stack:', err.stack);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

// AdChoices
app.get('/api/ad-preferences', (req, res) => {
  console.log('GET /api/ad-preferences requested');
  res.json({ personalizedAds: true });
});
app.post('/api/ad-preferences', (req, res) => {
  console.log('POST /api/ad-preferences requested');
  res.json({ message: 'Preferences saved' });
});

// CookiePreferences
app.post('/api/cookies', (req, res) => {
  console.log('POST /api/cookies requested');
  res.json({ message: 'Cookie preferences saved' });
});

// Contact
app.post('/api/contact', (req, res) => {
  console.log('POST /api/contact requested');
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  res.json({ message: `Message received from ${name}` });
});

// FAQs (Help)
app.get('/api/faqs', (req, res) => {
  console.log('GET /api/faqs requested');
  res.json([
    { id: 1, question: 'How do I reset my password?', answer: 'Go to Profile > Settings.' },
    { id: 2, question: 'Why is my video buffering?', answer: 'Check your internet speed.' },
  ]);
});

// GiftCards
app.post('/api/redeem-gift-card', (req, res) => {
  console.log('POST /api/redeem-gift-card requested');
  const { code } = req.body;
  if (!code.match(/^[A-Z0-9]{10}$/)) {
    return res.status(400).json({ message: 'Invalid gift card code' });
  }
  res.json({ message: `Gift card ${code} redeemed` });
});

// MediaCenter
app.get('/api/news', (req, res) => {
  console.log('GET /api/news requested');
  res.json([
    { id: 1, title: 'New Series Announced', date: '2025-04-01', content: 'A thrilling series.' },
    { id: 2, title: 'Global Expansion', date: '2025-03-15', content: 'Now in 10 new countries.' },
  ]);
});

// InvestorRelations
app.get('/api/investor-relations', (req, res) => {
  console.log('GET /api/investor-relations requested');
  res.json({
    overview: 'StreamFlix is a leading streaming service.',
    reports: [{ year: 2024, revenue: '$1B' }, { year: 2023, revenue: '$800M' }],
    contact: 'ir@streamflix.com',
  });
});

// Jobs
app.get('/api/jobs', (req, res) => {
  console.log('GET /api/jobs requested');
  res.json([
    { id: 1, title: 'Software Engineer', location: 'Remote', description: 'Build streaming solutions.' },
    { id: 2, title: 'Content Manager', location: 'LA', description: 'Curate content.' },
  ]);
});
app.post('/api/apply', (req, res) => {
  console.log('POST /api/apply requested');
  const { jobId } = req.body;
  res.json({ message: `Applied for job ${jobId}` });
});

// Terms
app.get('/api/terms', (req, res) => {
  console.log('GET /api/terms requested');
  res.json([
    { section: 'Acceptance', content: 'by using StreamFlix, you agree to these terms.' },
    { section: 'Subscription', content: 'Monthly, cancel anytime.' },
  ]);
});

// Privacy
app.get('/api/privacy', (req, res) => {
  console.log('GET /api/privacy requested');
  res.json([
    { section: 'Data Collection', content: 'We collect data to improve your experience.' },
    { section: 'Data Usage', content: 'Used for personalization.' },
  ]);
});

// LegalNotices
app.get('/api/legal-notices', (req, res) => {
  console.log('GET /api/legal-notices requested');
  res.json([
    { section: 'Copyright', content: '© StreamFlix, Inc.' },
    { section: 'Trademarks', content: 'StreamFlix is a registered trademark.' },
  ]);
});

// CorporateInfo
app.get('/api/corporate-info', (req, res) => {
  console.log('GET /api/corporate-info requested');
  res.json({
    about: 'StreamFlix, founded in 2020, is a global streaming service.',
    headquarters: '123 Stream Way, LA, CA 90001',
    contact: 'info@streamflix.com',
  });
});

app.listen(5001, () => console.log('Server running on port 5001'));