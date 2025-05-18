import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
// import Header from '../components/Header';
import Footer from '../components/Footer';
import './SpeedTest.css';

function SpeedTest() {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [latency, setLatency] = useState(null);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('speedTestHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [chartData, setChartData] = useState({ download: [], upload: [] });

  // Update local storage when history changes
  useEffect(() => {
    localStorage.setItem('speedTestHistory', JSON.stringify(history));
  }, [history]);

  // Initialize chart
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
    const ctx = document.getElementById('speedChart')?.getContext('2d');
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.download.map((_, i) => `Sample ${i + 1}`),
          datasets: [
            {
              label: 'Download Speed (Mbps)',
              data: chartData.download,
              borderColor: '#ff0000',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              fill: true,
            },
            {
              label: 'Upload Speed (Mbps)',
              data: chartData.upload,
              borderColor: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Speed (Mbps)' } },
            x: { title: { display: true, text: 'Sample' } },
          },
        },
      });
      return () => chart.destroy();
    }
  }, [chartData]);

  const runSpeedTest = async () => {
    setTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setLatency(null);
    setError('');
    setChartData({ download: [], upload: [] });

    let pingMs = null;
    let avgDownloadSpeed = null;
    let avgUploadSpeed = null;

    try {
      // Latency test
      try {
        const pingStart = performance.now();
        const pingResponse = await axios.get('http://localhost:5001/', { timeout: 10000 });
        const pingEnd = performance.now();
        pingMs = (pingEnd - pingStart).toFixed(2);
        setLatency(pingMs);
        console.log('Latency:', pingMs, 'ms', 'Status:', pingResponse.status);
      } catch (err) {
        console.error('Latency test failed (port 5001):', err.message);
        // Fallback to port 3000
        try {
          const pingStart = performance.now();
          const pingResponse = await axios.get('http://localhost:3000/', { timeout: 10000 });
          const pingEnd = performance.now();
          pingMs = (pingEnd - pingStart).toFixed(2);
          setLatency(pingMs);
          console.log('Latency (fallback 3000):', pingMs, 'ms', 'Status:', pingResponse.status);
        } catch (fallbackErr) {
          console.error('Latency fallback failed (port 3000):', fallbackErr.message);
          setError((prev) => prev + ' Latency test failed. ');
        }
      }

      // Download test
      try {
        const downloadSamples = 3;
        const downloadSpeeds = [];
        for (let i = 0; i < downloadSamples; i++) {
          const startTime = performance.now();
          const response = await axios.get('http://localhost:3000/files/100MB.bin', {
            responseType: 'blob',
            timeout: 30000,
          });
          const endTime = performance.now();
          const duration = (endTime - startTime) / 1000; // seconds
          const fileSize = response.data.size / 1024 / 1024; // MB
          const speedMbps = (fileSize * 8 / duration).toFixed(2); // Mbps
          downloadSpeeds.push(parseFloat(speedMbps));
          setChartData((prev) => ({
            download: [...prev.download, parseFloat(speedMbps)],
            upload: prev.upload,
          }));
          console.log(`Download sample ${i + 1}: ${speedMbps} Mbps`, 'Status:', response.status);
        }
        avgDownloadSpeed = (downloadSpeeds.reduce((a, b) => a + b, 0) / downloadSamples).toFixed(2);
        setDownloadSpeed(avgDownloadSpeed);
        console.log('Average download speed:', avgDownloadSpeed, 'Mbps');
      } catch (err) {
        console.error('Download test failed:', err.message);
        setError((prev) => prev + ' Download test failed. ');
      }

      // Upload test
      try {
        const uploadSamples = 3;
        const uploadSpeeds = [];
        const fileSizeMB = 2; // 2MB
        const fileData = new Blob([new ArrayBuffer(fileSizeMB * 1024 * 1024)], { type: 'application/octet-stream' });
        for (let i = 0; i < uploadSamples; i++) {
          const startTime = performance.now();
          const response = await axios.post('http://localhost:5001/upload', fileData, {
            headers: { 'Content-Type': 'application/octet-stream' },
            timeout: 60000,
          });
          const endTime = performance.now();
          const duration = (endTime - startTime) / 1000; // seconds
          const speedMbps = (fileSizeMB * 8 / duration).toFixed(2); // Mbps
          uploadSpeeds.push(parseFloat(speedMbps));
          setChartData((prev) => ({
            download: prev.download,
            upload: [...prev.upload, parseFloat(speedMbps)],
          }));
          console.log(`Upload sample ${i + 1}: ${speedMbps} Mbps`, 'Status:', response.status, 'Response:', response.data);
        }
        avgUploadSpeed = (uploadSpeeds.reduce((a, b) => a + b, 0) / uploadSamples).toFixed(2);
        setUploadSpeed(avgUploadSpeed);
        console.log('Average upload speed:', avgUploadSpeed, 'Mbps');
      } catch (err) {
        console.error('Upload test failed:', err.message, 'Response:', err.response?.data, 'Status:', err.response?.status, 'URL:', 'http://localhost:5001/upload');
        setError((prev) => prev + ` Upload test failed: ${err.message}. `);
      }

      // Update history even if some tests fail
      if (pingMs || avgDownloadSpeed || avgUploadSpeed) {
        const result = {
          downloadSpeed: avgDownloadSpeed || '-',
          uploadSpeed: avgUploadSpeed || '-',
          latency: pingMs || '-',
          timestamp: new Date().toLocaleString(),
        };
        console.log('History entry:', result);
        setHistory((prev) => [result, ...prev].slice(0, 5)); // Keep last 5 results
      } else {
        setError((prev) => prev || 'Failed to save to localStorage.');
      }
    } catch (err) {
      console.error('Unexpected error:', err.message, 'Response:', err.response?.data);
      setError('Failed to run speed test: ' + err.message);
    }
    setTesting(false);
  };

  // Calculate needle rotation and gauge offsets (0-100 Mbps maps to 0-360 deg)
  const downloadGaugeOffset = downloadSpeed ? (1 - parseFloat(downloadSpeed) / 100) * 439.8 : 439.8;
  const uploadGaugeOffset = uploadSpeed ? (1 - parseFloat(uploadSpeed) / 100) * 439.8 : 439.8;
  const needleAngle = testing
    ? 0
    : uploadSpeed
      ? (parseFloat(uploadSpeed) / 100) * 360
      : downloadSpeed
        ? (parseFloat(downloadSpeed) / 100) * 360
        : 0;

  // Generate scale ticks and labels
  const ticks = [];
  for (let i = 0; i <= 100; i += 5) {
    const isMajor = i % 20 === 0;
    const angle = (i / 100) * 360;
    const rad = (angle * Math.PI) / 180;
    const innerRadius = isMajor ? 55 : 60;
    const outerRadius = isMajor ? 45 : 50;
    const x1 = 100 + innerRadius * Math.cos(rad);
    const y1 = 100 + innerRadius * Math.sin(rad);
    const x2 = 100 + outerRadius * Math.cos(rad);
    const y2 = 100 + outerRadius * Math.sin(rad);
    ticks.push(
      <line
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#ffffff"
        strokeWidth={isMajor ? 2 : 1}
      />
    );
    if (isMajor) {
      const labelX = 100 + 35 * Math.cos(rad);
      const labelY = 100 + 35 * Math.sin(rad);
      ticks.push(
        <text
          key={`label-${i}`}
          x={labelX}
          y={labelY}
          fill="#ffffff"
          fontSize="10"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {i}
        </text>
      );
    }
  }

  return (
    <div className="speed-test">
      {/* <Header /> */}
      <main>
        <h1>Speed Test</h1>
        <p>Test your internet speed for optimal streaming on StreamFlix.</p>
        <div className="speedometer">
          <svg viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="10"
            />
            <circle
              className={testing || downloadSpeed ? 'gauge download-gauge' : ''}
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="#ff0000"
              strokeWidth="5"
              strokeDasharray="439.8"
              strokeDashoffset={testing ? '0' : downloadGaugeOffset}
            />
            <circle
              className={testing || uploadSpeed ? 'gauge upload-gauge' : ''}
              cx="100"
              cy="100"
              r="65"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
              strokeDasharray="408.4"
              strokeDashoffset={testing ? '0' : uploadGaugeOffset}
            />
            {ticks}
            <line
              className={testing || downloadSpeed || uploadSpeed ? 'needle' : ''}
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke="#ffffff"
              strokeWidth="4"
              style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '100px 100px' }}
            />
          </svg>
          <div className="speed-display">
            {testing ? 'Testing...' : (
              <>
                {downloadSpeed && <span>Download: {downloadSpeed} Mbps</span>}
                {uploadSpeed && <span> | Upload: {uploadSpeed} Mbps</span>}
              </>
            )}
          </div>
        </div>
        <div className="metrics">
          {latency && <p>Latency: {latency} ms</p>}
          {downloadSpeed && <p>Download Speed: {downloadSpeed} Mbps</p>}
          {uploadSpeed && <p>Upload Speed: {uploadSpeed} Mbps</p>}
        </div>
        <button onClick={runSpeedTest} disabled={testing}>
          {testing ? 'Testing...' : 'Run Speed Test'}
        </button>
        {error && <p className="error">{error}</p>}
        <div className="chart-container">
          <h3>Speed Test Results</h3>
          <canvas id="speedChart" width="400" height="200"></canvas>
        </div>
        {history.length > 0 && (
          <div className="history">
            <h3>Test History</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Download (Mbps)</th>
                  <th>Upload (Mbps)</th>
                  <th>Latency (ms)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.timestamp}</td>
                    <td>{entry.downloadSpeed || '-'}</td>
                    <td>{entry.uploadSpeed || '-'}</td>
                    <td>{entry.latency || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default SpeedTest;