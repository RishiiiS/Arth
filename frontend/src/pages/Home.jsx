import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import DashboardGrid from '../components/DashboardGrid';
import styles from './Home.module.css';

const Home = () => {
  const [url, setUrl] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusMessage, setStatusMessage] = React.useState('Idle');
  const [results, setResults] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsProcessing(true);
    setProgress(10);
    setStatusMessage('Downloading & transcribing...');
    setError(null);
    setResults(null);

    // Fake progress interval to simulate work
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Cap at 90% until backend finishes
        return prev + 5;
      });
    }, 5000); // Bump 5% every 5 seconds or so

    // Change status message at a certain duration
    setTimeout(() => {
      setStatusMessage(prev => prev === 'Downloading & transcribing...' ? 'Extracting semantic highlights...' : prev);
    }, 15000);

    try {
      const response = await fetch('/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      clearInterval(interval);

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Error communicating with backend');
      }

      setProgress(100);
      setStatusMessage('Done!');
      setResults(data);

    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      setStatusMessage('Failed.');
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <Navbar />
      <HeroSection 
        url={url} 
        setUrl={setUrl} 
        handleSubmit={handleSubmit} 
        isProcessing={isProcessing}
        error={error}
      />
      <DashboardGrid 
        progress={progress}
        statusMessage={statusMessage}
        isProcessing={isProcessing}
        results={results}
      />
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogo}>
            <div className={styles.dotsGrid}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
            <span>Arth AI</span>
          </div>
          <p className={styles.copyright}>
            © 2024 Arth AI. Distilling intelligence with architectural precision.
          </p>
        </div>
        <div className={styles.footerColumn}>
          <h4>Legal</h4>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>
        <div className={styles.footerColumn}>
          <h4>Connect</h4>
          <a href="#">Twitter</a>
          <a href="#">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
