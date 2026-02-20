import React, { useState, useEffect } from "react";
import productApi from "../../../api/productApi";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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
              id: pkg.productPackageId, // Usamos el ID del paquete como key única en la lista
              productId: product.productId,
              name: product.productName,
              packageName: pkg.packageCodedName, // Opcional: mostrar nombre del paquete si es relevante
              price: price,
              stock: totalStock,
              image: pkg.imageUrl || "https://bateriasaltoque.pe/wp-content/uploads/2021/05/YTX9-BSprueba-1.jpg",
              brand: product.brandName,
              category: product.categoryName
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

  const handleProductClick = (productId) => {
    console.log("Producto clickeado:", productId);
    // Aquí puedes navegar a la página de detalle del producto
    // navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Productos Disponibles</h1>
        <p className={styles.subtitle}>
          {products.length} producto{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
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
              <div className={styles.stockBadge}>
                <span className={styles.stockText}>
                  Stock: {product.stock}
                </span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.productName}>{product.name}</h3>

              <div className={styles.cardFooter}>
                <span className={styles.price}>S/{product.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className={styles.emptyState}>
          <p>No hay productos disponibles</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;