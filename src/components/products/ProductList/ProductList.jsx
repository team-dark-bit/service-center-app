import React, { useState, useEffect } from "react";
import productApi from "../../../api/productApi";
import Modal from "../../common/Modal/Modal";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedProductForBatches, setSelectedProductForBatches] = useState(null);

  // Debounce para el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getInventory(debouncedSearchTerm);

      const mappedProducts = [];

      data.forEach(product => {
        if (product.packages && product.packages.length > 0) {
          product.packages.forEach(pkg => {
            // Calcular stock total de los lotes
            const totalStock = pkg.batches ? pkg.batches.reduce((sum, batch) => sum + batch.quantityAvailable, 0) : 0;

            // Obtener precio del PRIMER lote (como solicitó el usuario)
            const firstBatch = pkg.batches && pkg.batches.length > 0 ? pkg.batches[0] : null;
            const price = firstBatch ? firstBatch.saleUnitPrice : 0;

            mappedProducts.push({
              id: pkg.productPackageId,
              name: product.productName,
              packageName: pkg.packageCodedName,
              saleUnitPrice: firstBatch ? firstBatch.saleUnitPrice : 0,
              purchaseUnitPrice: firstBatch ? firstBatch.purchaseUnitPrice : 0,
              purchaseDate: firstBatch ? firstBatch.purchaseDate : null,
              stock: totalStock,
              image: pkg.imageUrl || "https://bateriasaltoque.pe/wp-content/uploads/2021/05/YTX9-BSprueba-1.jpg",
              brand: product.brandName,
              category: product.categoryName,
              batches: pkg.batches || []
            });
          });
        }
      });

      setProducts(mappedProducts);
      setLoading(false);
    } catch (err) {
      console.error("Error al listar productos:", err);
      setError("Error al cargar los productos");
      setLoading(false);
    }
  };

  const handleViewBatches = (e, product) => {
    e.stopPropagation();
    setSelectedProductForBatches(product);
    setIsBatchModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Productos Disponibles</h1>
        <p className={styles.subtitle}>
          {loading ? "Cargando..." : (
            `${products.length} producto${products.length !== 1 ? "s" : ""} disponible${products.length !== 1 ? "s" : ""}`
          )}
        </p>
      </div>

      {/* Barra de Búsqueda */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar producto por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        {searchTerm !== debouncedSearchTerm && (
          <span className={styles.searchingIndicator}>Buscando...</span>
        )}
      </div>

      {error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      ) : (
        <div className={`${styles.resultsArea} ${loading ? styles.loadingEffect : ""}`}>
          <div className={styles.grid}>
            {products.map((product) => (
              <div
                key={product.id}
                className={styles.card}
                onClick={() => handleProductClick(product.id)}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.image}
                  />
                  {product.batches.length > 1 && (
                    <button
                      className={styles.batchesBadge}
                      onClick={(e) => handleViewBatches(e, product)}
                      title="Ver lotes"
                    >
                      <i className="bi bi-eye-fill"></i>
                    </button>
                  )}
                  <div className={styles.stockBadge}>
                    <span className={styles.stockText}>
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.productName}>{product.name}</h3>

                  <div className={styles.cardFooter}>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Precio Venta:</span>
                      <div className={styles.priceWithIcon}>
                        <span className={styles.priceValue}>S/{product.saleUnitPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className={styles.purchasePriceRow}>
                      <span className={styles.purchasePriceLabel}>Precio Compra:</span>
                      <span className={styles.purchasePriceValue}>S/{product.purchaseUnitPrice.toFixed(2)}</span>
                    </div>
                    {product.purchaseDate && (
                      <div className={styles.dateRow}>
                        <span className={styles.dateLabel}>Fecha Compra:</span>
                        <span className={styles.dateValue}>
                          {new Date(product.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && products.length === 0 && (
            <div className={styles.emptyState}>
              <p>No hay productos disponibles</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Lotes */}
      {selectedProductForBatches && (
        <Modal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          title={
            <div className={styles.modalTitleContainer}>
              <span>Lotes de: {selectedProductForBatches.name}</span>
              <img
                src={selectedProductForBatches.image}
                alt={selectedProductForBatches.name}
                className={styles.modalHeaderImage}
              />
            </div>
          }
          size="large"
        >
          <div className={styles.modalTableContainer}>
            <table className={styles.batchesTable}>
              <thead>
                <tr>
                  <th>Fecha Compra</th>
                  <th>Cantidad</th>
                  <th>P. Compra</th>
                  <th>P. Venta</th>
                  <th>Lote #</th>
                </tr>
              </thead>
              <tbody>
                {selectedProductForBatches.batches.map((batch, index) => (
                  <tr key={index}>
                    <td>{new Date(batch.purchaseDate).toLocaleDateString()}</td>
                    <td>{batch.quantityAvailable}</td>
                    <td className={styles.tablePurchasePrice}>S/{batch.purchaseUnitPrice.toFixed(2)}</td>
                    <td className={styles.tableSalePrice}>S/{batch.saleUnitPrice.toFixed(2)}</td>
                    <td>{batch.purchaseNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProductList;