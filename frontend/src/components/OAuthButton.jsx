import React from 'react';
import styles from './OAuthButton.module.css';

const OAuthButton = ({ provider, icon: Icon, onClick }) => {
  return (
    <button type="button" onClick={onClick} className={styles.button}>
      {Icon && <span className={styles.icon}><Icon size={18} /></span>}
      <span className={styles.text}>{provider}</span>
    </button>
  );
};

export default OAuthButton;
