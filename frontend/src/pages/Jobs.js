import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import './Jobs.css';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/jobs');
        setJobs(response.data);
      } catch (err) {
        setError('Failed to load jobs.');
        setJobs([
          { id: 1, title: 'Software Engineer', location: 'Remote', description: 'Build streaming solutions.' },
          { id: 2, title: 'Content Manager', location: 'LA', description: 'Curate content.' },
        ]);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (job) => {
    try {
      await axios.post('http://localhost:5001/api/apply', { jobId: job.id });
      alert(`Applied for ${job.title}!`);
    } catch (err) {
      alert('Error applying for job.');
    }
  };

  return (
    <div className="jobs">
      <main>
        <h1>Jobs</h1>
        <p>Join StreamFlix!</p>
        {error && <p className="error">{error}</p>}
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job.id} className="job">
              <h3>{job.title}</h3>
              <p className="location">{job.location}</p>
              <p>{job.description}</p>
              <button onClick={() => handleApply(job)}>Apply</button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Jobs;