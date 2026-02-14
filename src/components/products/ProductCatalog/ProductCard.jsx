import React, { useState } from "react";
import styles from "./ProductCatalog.module.css";

const ProductCard = ({
  product,
  isNew,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);
  const firstPackage = product.packages[0];
  const hasMultiplePackages = product.packages.length > 1;

  return (
    <div className={styles.productCard}>
      {/* Badges superiores */}
      <div className={styles.cardBadges}>
        <span
          className={`${styles.badge} ${styles.badgeStatus} ${product.status ? styles.badgeActive : styles.badgeInactive
            }`}
        >
          {product.status ? "Activo" : "Inactivo"}
        </span>
        {isNew && (
          <span className={`${styles.badge} ${styles.badgeNew}`}>Nuevo</span>
        )}
      </div>

      {/* Imagen */}
      <div
        className={styles.cardImageContainer}
        onClick={() => onViewDetails(product)}
        style={{ cursor: 'pointer' }}
        title="Ver detalles"
      >
        {!imageError ? (
          <img
            src={firstPackage?.imageUrl}
            alt={product.displayName}
            className={styles.cardImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <span>📦</span>
            <p>Sin imagen</p>
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{product.displayName}</h3>
        <p className={styles.cardSubtitle}>{product.name}</p>

        <div className={styles.cardDetails}>
          <p className={styles.cardSku}>
            <strong>SKU:</strong> {firstPackage?.sku}
          </p>
          <p className={styles.cardBarcode}>
            <strong>Código:</strong> {firstPackage?.barcode}
          </p>
        </div>

        <div className={styles.cardTags}>
          <span className={`${styles.badge} ${styles.badgeBrand}`}>
            {product.brandName}
          </span>
          <span className={`${styles.badge} ${styles.badgeCategory}`}>
            {product.categoryName}
          </span>
          {product.subcategoryName && (
            <span className={`${styles.badge} ${styles.badgeSubcategory}`}>
              {product.subcategoryName}
            </span>
          )}
        </div>

        {hasMultiplePackages && (
          <div className={styles.packageIndicator}>
            <span className={`${styles.badge} ${styles.badgePackages}`}>
              📦 {product.packages.length} presentaciones
            </span>
          </div>
        )}

        <div className={styles.cardPackageInfo}>
          <span>
            📦 {firstPackage?.quantity} {firstPackage?.unitName}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className={styles.cardActions}>
        <button
          onClick={() => onViewDetails(product)}
          className={`${styles.actionButton} ${styles.actionView}`}
          title="Ver detalles"
        >
          👁️
        </button>
        <button
          onClick={() => onEdit(product)}
          className={`${styles.actionButton} ${styles.actionEdit}`}
          title="Editar"
        >
          ✏️
        </button>
        <button
          onClick={() => onToggleStatus(product)}
          className={`${styles.actionButton} ${styles.actionToggle}`}
          title={product.status ? "Desactivar" : "Activar"}
        >
          {product.status ? "🔒" : "🔓"}
        </button>
        <button
          onClick={() => onDelete(product)}
          className={`${styles.actionButton} ${styles.actionDelete}`}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ProductCard;