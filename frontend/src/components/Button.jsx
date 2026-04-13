import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, type = 'button', onClick, className = '', icon: Icon }) => {
  return (
    <button type={type} onClick={onClick} className={`${styles.button} ${className}`}>
      {children}
      {Icon && <span className={styles.icon}><Icon size={18} /></span>}
    </button>
  );
};

export default Button;
