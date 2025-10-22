// src/components/common/Button/Button.jsx
import React from 'react';
import styles from './Button.module.css';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, danger, success
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading && <span className={styles.spinner}></span>}
      {icon && !loading && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
    </button>
  );
};

export default Button;