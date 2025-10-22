// src/components/common/DataTable/DataTable.jsx
import React, { useState, useMemo } from 'react';
import styles from './DataTable.module.css';

const DataTable = ({
  columns = [],           // Array de definición de columnas
  data = [],             // Datos a mostrar
  onEdit,                // Callback para editar
  onDelete,              // Callback para eliminar
  onRowClick,            // Callback al hacer click en fila
  loading = false,       // Estado de carga
  emptyMessage = 'No hay datos disponibles',
  searchable = true,     // Si tiene búsqueda
  searchPlaceholder = 'Buscar...',
  actions = true,        // Si muestra columna de acciones
  striped = false,       // Filas alternadas
  hoverable = true,      // Hover en filas
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtrar datos por búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) => {
      return columns.some((column) => {
        const value = row[column.key];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Manejar ordenamiento
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Renderizar valor de celda
  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    return row[column.key] || '-';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Búsqueda */}
      {searchable && (
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      )}

      {/* Tabla */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${styles.th} ${column.sortable ? styles.sortable : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <div className={styles.thContent}>
                    {column.label}
                    {column.sortable && sortConfig.key === column.key && (
                      <span className={styles.sortIcon}>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className={styles.actionsHeader}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`
                    ${striped && index % 2 === 1 ? styles.striped : ''}
                    ${hoverable ? styles.hoverable : ''}
                    ${onRowClick ? styles.clickable : ''}
                  `}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={styles.td}>
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {actions && (
                    <td className={styles.actionsCell}>
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row.id, row);
                          }}
                          className={styles.editButton}
                          title="Editar"
                        >
                          ✏️
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row.id, row);
                          }}
                          className={styles.deleteButton}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className={styles.emptyState}
                >
                  {searchTerm
                    ? 'No se encontraron resultados'
                    : emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con conteo */}
      {sortedData.length > 0 && (
        <div className={styles.footer}>
          Mostrando {sortedData.length} de {data.length} registro{data.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default DataTable;