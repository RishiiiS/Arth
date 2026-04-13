import React from 'react';
import styles from './Logo.module.css';

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
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
      <span className={styles.logoText}>Arth AI</span>
    </div>
  );
};

export default Logo;
