import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children, leftPanelContent }) => {
  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link to="/home" className={styles.navLink}>Home</Link>
          <Link to="/features" className={styles.navLink}>Features</Link>
          <Link to="/pricing" className={styles.navLink}>Pricing</Link>
          <Link to="/login" className={`${styles.navLink} ${styles.loginBtn}`}>Login</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.splitContainer}>
          {/* Left Panel */}
          <div className={styles.leftPanel}>
            {leftPanelContent}
          </div>

          {/* Right Panel */}
          <div className={styles.rightPanel}>
            <div className={styles.formCard}>
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
