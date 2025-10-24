// src/components/common/Select/Select.jsx
import React from 'react';
import styles from './Select.module.css';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  valueKey = 'value',
  labelKey = 'label',
  ...props
}) => {
  return (
    <div className={`${styles.selectGroup} ${className}`}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${styles.select} ${error ? styles.error : ''}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option, index) => {
          // Soporte para arrays de strings simples o arrays de objetos
          const optionValue = typeof option === 'object' ? option[valueKey] : option;
          const optionLabel = typeof option === 'object' ? option[labelKey] : option;
          
          return (
            <option key={index} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      
      {error && <span className={styles.errorText}>{error}</span>}
      {helperText && !error && (
        <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  );
};

export default Select;