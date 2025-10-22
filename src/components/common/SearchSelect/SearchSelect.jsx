// src/components/common/SearchSelect/SearchSelect.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchSelect.module.css';

const SearchSelect = ({
  label,
  name,
  options = [],           // Array de objetos: [{ id, name }, ...]
  value,                  // ID seleccionado
  onChange,               // Función que recibe el ID seleccionado
  placeholder = "Buscar...",
  required = false,
  disabled = false,
  error,
  displayKey = 'name',    // Campo a mostrar (default: 'name')
  valueKey = 'id',        // Campo del valor (default: 'id')
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const dropdownRef = useRef(null);

  // Actualizar el label cuando cambia el value
  useEffect(() => {
    if (value) {
      const selected = options.find(opt => opt[valueKey] === value);
      if (selected) {
        setSelectedLabel(selected[displayKey]);
        setSearchTerm(selected[displayKey]);
      }
    } else {
      setSelectedLabel('');
      setSearchTerm('');
    }
  }, [value, options, valueKey, displayKey]);

  // Filtrar opciones
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions([]);
      return;
    }

    const results = options.filter(option =>
      option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(results);
  }, [searchTerm, options, displayKey]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setShowDropdown(true);
    
    // Limpiar selección si el usuario escribe
    if (inputValue !== selectedLabel) {
      onChange({ target: { name, value: '' } });
    }
  };

  const handleSelectOption = (option) => {
    setSearchTerm(option[displayKey]);
    setSelectedLabel(option[displayKey]);
    setShowDropdown(false);
    
    // Llamar onChange con el ID seleccionado
    onChange({ target: { name, value: option[valueKey] } });
  };

  const handleInputFocus = () => {
    if (options.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedLabel('');
    setShowDropdown(false);
    onChange({ target: { name, value: '' } });
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputContainer}>
        <input
          id={name}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.input} ${error ? styles.error : ''}`}
          autoComplete="off"
        />
        
        {searchTerm && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            title="Limpiar"
          >
            ×
          </button>
        )}
      </div>

      {showDropdown && filteredOptions.length > 0 && (
        <ul className={styles.dropdown}>
          {filteredOptions.map((option) => (
            <li
              key={option[valueKey]}
              onClick={() => handleSelectOption(option)}
              className={styles.dropdownItem}
            >
              {option[displayKey]}
            </li>
          ))}
        </ul>
      )}

      {showDropdown && searchTerm && filteredOptions.length === 0 && (
        <ul className={styles.dropdown}>
          <li className={styles.emptyMessage}>
            No se encontraron resultados
          </li>
        </ul>
      )}

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default SearchSelect;