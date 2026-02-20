import React, { useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import ProductCard from "./ProductCard";
import ProductListItem from "./ProductListItem";
import productApi from "@/api/productApi";
import styles from "./ProductCatalog.module.css";

const ProductCatalog = () => {
  // Estados
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" o "list"
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all"); // "all", "active", "inactive"
  const [sortBy, setSortBy] = useState("name-asc"); // "name-asc", "name-desc", "brand", "category"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce para el término de búsqueda (espera 500ms después de que el usuario deje de escribir)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Cargar productos desde la API cuando cambia el término de búsqueda debounced
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getCatalog(debouncedSearchTerm, 0, 100);

        // Transformar la respuesta de la API al formato esperado por el componente
        const transformedProducts = response.map((item) => ({
          id: item.productId,
          brandName: item.brandName,
          subcategoryName: item.subCategoryName,
          displayName: item.productName,
          categoryName: item.categoryName,
          packages: item.packages.map((pkg) => ({
            id: pkg.productPackageId,
            sku: pkg.sku || '',
            barcode: pkg.barcode || '',
            unitName: pkg.packageCodedName || 'Unidad',
            packageName: pkg.packageDescription || pkg.packageCodedName || 'Sin descripción',
            imageUrl: pkg.imageUrl || 'https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000',
          })),
        }));

        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        Swal.fire("Error", "No se pudieron cargar los productos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchTerm]); // Se ejecuta cuando cambia el término de búsqueda debounced

  // Extraer opciones únicas para filtros
  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.categoryName))];
    return unique.sort();
  }, [products]);

  const brands = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.brandName))];
    return unique.sort();
  }, [products]);

  const subcategories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.subcategoryName))];
    return unique.sort();
  }, [products]);

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // La búsqueda ahora se hace en el servidor via API (debouncedSearchTerm)
    // Solo aplicamos filtros adicionales del lado del cliente

    // Filtros
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categoryName === selectedCategory);
    }
    if (selectedBrand) {
      filtered = filtered.filter((p) => p.brandName === selectedBrand);
    }
    if (selectedSubcategory) {
      filtered = filtered.filter((p) => p.subcategoryName === selectedSubcategory);
    }
    // Status filter removed

    // Ordenamiento
    const sorted = [...filtered];
    switch (sortBy) {
      // Recent sort removed
      case "name-asc":
        sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.displayName.localeCompare(a.displayName));
        break;
      case "brand":
        sorted.sort((a, b) => a.brandName.localeCompare(b.brandName));
        break;
      case "category":
        sorted.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
        break;
      default:
        break;
    }

    return sorted;
  }, [
    products,
    selectedCategory,
    selectedBrand,
    selectedSubcategory,
    selectedStatus,
    sortBy,
  ]);

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedSubcategory("");
    setSelectedStatus("all");
    setSortBy("name-asc");
  };

  // Ver detalles del producto
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Editar producto
  const handleEdit = (product) => {
    Swal.fire("Editar", `Editar producto: ${product.displayName}`, "info");
  };



  // Eliminar producto
  const handleDelete = (product) => {
    Swal.fire({
      title: "¿Eliminar producto?",
      text: `${product.displayName} - Esta acción no se puede deshacer`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
      }
    });
  };



  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Catálogo de Productos</h1>
        <Button variant="primary" onClick={() => Swal.fire("Nuevo Producto", "Redirigir a formulario de creación", "info")}>
          + Nuevo Producto
        </Button>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className={styles.filterBar}>
        {/* Búsqueda */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm !== debouncedSearchTerm && (
            <span className={styles.searchingIndicator}>Buscando...</span>
          )}
        </div>

        {/* Filtros */}
        <div className={styles.filters}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas las subcategorías</option>
            {subcategories.map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>


        </div>

        {/* Ordenamiento y Vista */}
        <div className={styles.controls}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="brand">Por marca</option>
            <option value="category">Por categoría</option>
          </select>

          <button
            onClick={handleClearFilters}
            className={styles.clearButton}
            title="Limpiar filtros"
          >
            🔄 Limpiar
          </button>

          <div className={styles.viewToggle}>
            <button
              onClick={() => setViewMode("grid")}
              className={`${styles.viewButton} ${viewMode === "grid" ? styles.active : ""
                }`}
              title="Vista en cuadrícula"
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`${styles.viewButton} ${viewMode === "list" ? styles.active : ""
                }`}
              title="Vista en lista"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className={styles.resultsCount}>
        {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.emptyState}>
          <p>Cargando productos...</p>
        </div>
      ) : (
        <>
          {/* Grid o Lista de Productos */}
          {filteredProducts.length > 0 ? (
            <div
              className={
                viewMode === "grid" ? styles.productsGrid : styles.productsList
              }
            >
              {filteredProducts.map((product) => (
                viewMode === "grid" ? (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ) : (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No se encontraron productos</p>
              <p className={styles.emptyHint}>
                Intenta ajustar los filtros o realizar una nueva búsqueda
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal de Detalles */}
      {selectedProduct && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Detalles del Producto"
          size="large"
        >
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <img
                src={selectedProduct.packages[0]?.imageUrl}
                alt={selectedProduct.displayName}
                className={styles.modalImage}
              />
              <div className={styles.modalInfo}>
                <h2>{selectedProduct.displayName}</h2>
                <div className={styles.modalBadges}>
                  <span className={`${styles.badge} ${styles.badgeCategory}`}>
                    {selectedProduct.categoryName}
                  </span>
                  <span className={`${styles.badge} ${styles.badgeBrand}`}>
                    {selectedProduct.brandName}
                  </span>
                  <span className={`${styles.badge} ${styles.badgeSubcategory}`}>
                    {selectedProduct.subcategoryName}
                  </span>
                </div>
              </div>
            </div>

            <h3 className={styles.packagesTitle}>
              Presentaciones ({selectedProduct.packages.length})
            </h3>
            <div className={styles.packagesTable}>
              <table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Código de Barras</th>
                    <th>Unidad</th>
                    <th>Empaque</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td><strong>{pkg.sku}</strong></td>
                      <td>{pkg.barcode}</td>
                      <td>{pkg.unitName}</td>
                      <td>{pkg.packageName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProductCatalog;