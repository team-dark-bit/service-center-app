// src/components/common/Card/Card.jsx
import React from 'react';
import styles from './Card.module.css';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  hoverable = false,
  onClick,
  className = '',
}) => {
  const cardClasses = [
    styles.card,
    hoverable && styles.hoverable,
    onClick && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      
      <div className={styles.body}>{children}</div>
      
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default Card;