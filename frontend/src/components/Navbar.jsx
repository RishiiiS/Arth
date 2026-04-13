import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logoLink}>
        <Logo />
      </Link>
      
      <div className={styles.navRight}>
        <div className={styles.navLinks}>
          <Link to="/" className={`${styles.navLink} ${styles.active}`}>Home</Link>
          <a href="#" className={styles.navLink}>About</a>
        </div>
        <Button onClick={() => navigate('/login')} className={styles.loginBtn}>
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
