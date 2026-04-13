import React from 'react';
import { Sparkles, Link as LinkIcon, Zap } from 'lucide-react';
import styles from './HeroSection.module.css';

const HeroSection = ({ url, setUrl, handleSubmit, isProcessing, error }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.badge}>
        <Sparkles size={14} className={styles.sparkleIcon} />
        <span>The Synthetic Curator</span>
      </div>
      
      <h1 className={styles.title}>
        Summarize Any Video <br />
        <span className={styles.highlight}>in Seconds.</span>
      </h1>
      
      <div className={styles.inputWrapper}>
        <form className={styles.inputContainer} onSubmit={handleSubmit}>
          <LinkIcon size={20} className={styles.inputIcon} />
          <input 
            type="text" 
            placeholder="Paste YouTube video URL here..." 
            className={styles.inputArea}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isProcessing}
            required
          />
          <button 
            type="submit" 
            className={`${styles.summarizeBtn} ${isProcessing ? styles.disabled : ''}`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Summarize'}
            {!isProcessing && <Zap size={16} fill="currentColor" />}
          </button>
        </form>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    </section>
  );
};

export default HeroSection;
