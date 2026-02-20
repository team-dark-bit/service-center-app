import React, { useState } from "react";
import styles from "./ProductCatalog.module.css";

const ProductListItem = ({
  product,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);
  const firstPackage = product.packages[0];
  const hasMultiplePackages = product.packages.length > 1;

  return (
    <div className={styles.listItem}>
      {/* Imagen */}
      <div
        className={styles.listImageContainer}
        onClick={() => onViewDetails(product)}
        style={{ cursor: 'pointer' }}
        title="Ver detalles"
      >
        {!imageError ? (
          <img
            src={firstPackage?.imageUrl}
            alt={product.displayName}
            className={styles.listImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.listImagePlaceholder}>
            <span>📦</span>
          </div>
        )}
      </div>

      {/* Información Principal */}
      <div className={styles.listContent}>
        <div className={styles.listHeader}>
          <div>
            <h3 className={styles.listTitle}>{product.displayName}</h3>
            {/* Subtitle removed */}
          </div>
          <div className={styles.listBadges}>
            {/* Status and New badges removed */}
          </div>
        </div>

        <div className={styles.listDetails}>
          <div className={styles.listDetailItem}>
            <strong>SKU:</strong> {firstPackage?.sku}
          </div>
          <div className={styles.listDetailItem}>
            <strong>Código:</strong> {firstPackage?.barcode}
          </div>
          <div className={styles.listDetailItem}>
            <strong>Marca:</strong>{" "}
            <span className={`${styles.badge} ${styles.badgeBrand}`}>
              {product.brandName}
            </span>
          </div>
          <div className={styles.listDetailItem}>
            <strong>Categoría:</strong>{" "}
            <span className={`${styles.badge} ${styles.badgeCategory}`}>
              {product.categoryName}
            </span>
          </div>
          <div className={styles.listDetailItem}>
            <strong>Subcategoría:</strong>{" "}
            <span className={`${styles.badge} ${styles.badgeSubcategory}`}>
              {product.subcategoryName}
            </span>
          </div>
          {hasMultiplePackages && (
            <div className={styles.listDetailItem}>
              <span className={`${styles.badge} ${styles.badgePackages}`}>
                📦 {product.packages.length} presentaciones
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className={styles.listActions}>
        <button
          onClick={() => onViewDetails(product)}
          className={`${styles.actionButton} ${styles.actionView}`}
          title="Ver detalles"
        >
          👁️ Ver
        </button>
        <button
          onClick={() => onEdit(product)}
          className={`${styles.actionButton} ${styles.actionEdit}`}
          title="Editar"
        >
          ✏️ Editar
        </button>

        <button
          onClick={() => onDelete(product)}
          className={`${styles.actionButton} ${styles.actionDelete}`}
          title="Eliminar"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductListItem;