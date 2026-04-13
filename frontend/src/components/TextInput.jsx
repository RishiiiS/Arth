import React from 'react';
import styles from './TextInput.module.css';

const TextInput = ({ label, type = 'text', placeholder, icon: Icon, value, onChange, name }) => {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label} htmlFor={name}>{label}</label>}
      <div className={styles.inputWrapper}>
        {Icon && <span className={styles.icon}><Icon size={18} /></span>}
        <input
          id={name}
          name={name}
          type={type}
          className={`${styles.input} ${Icon ? styles.hasIcon : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default TextInput;
