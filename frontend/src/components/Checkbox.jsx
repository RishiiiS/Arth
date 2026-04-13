import React from 'react';
import styles from './Checkbox.module.css';

const Checkbox = ({ id, label, checked, onChange, children }) => {
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id={id}
        className={styles.checkbox}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className={styles.label}>
        {children || label}
      </label>
    </div>
  );
};

export default Checkbox;
