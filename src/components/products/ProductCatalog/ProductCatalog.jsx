import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import ProductCard from "./ProductCard";
import ProductListItem from "./ProductListItem";
import styles from "./ProductCatalog.module.css";

const ProductCatalog = () => {
  // Mock de datos de productos
  const mockProducts = [
    {
      id: "1",
      brandId: "brand-1",
      brandName: "Castrol",
      subcategoryId: "subcat-1",
      subcategoryName: "Lubricantes",
      serviceCenterId: "f80ac9d5-a6d3-4e45-b800-6eb102abba86",
      name: "aceite-motor-castrol-20w50",
      displayName: "Aceite de Motor Castrol 20W-50",
      description: "Aceite sintético de alta calidad para motores de alto rendimiento",
      activeFrom: "2024-01-15",
      status: true,
      categoryId: "cat-1",
      categoryName: "Aceites",
      packages: [
        {
          id: "pkg-1",
          sku: "CAST-20W50-1L",
          barcode: "7891234567890",
          unitId: "unit-1",
          unitName: "Litro",
          packageId: "pack-1",
          packageName: "Botella 1L",
          imageUrl: "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
          activeFrom: "2024-01-15",
          status: true,
          quantity: 1,
        },
        {
          id: "pkg-2",
          sku: "CAST-20W50-4L",
          barcode: "7891234567891",
          unitId: "unit-1",
          unitName: "Litro",
          packageId: "pack-2",
          packageName: "Garrafa 4L",
          imageUrl: "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
          activeFrom: "2024-01-15",
          status: true,
          quantity: 4,
        },
      ],
    },
    {
      id: "2",
      brandId: "brand-2",
      brandName: "Bosch",
      subcategoryId: "subcat-2",
      subcategoryName: "Filtros de Aceite",
      serviceCenterId: "f80ac9d5-a6d3-4e45-b800-6eb102abba86",
      name: "filtro-aceite-bosch-toyota",
      displayName: "Filtro de Aceite Bosch Toyota",
      description: "Filtro de aceite original para vehículos Toyota",
      activeFrom: "2024-02-10",
      status: true,
      categoryId: "cat-2",
      categoryName: "Filtros",
      packages: [
        {
          id: "pkg-3",
          sku: "BOSCH-FO-TOY",
          barcode: "7891234567892",
          unitId: "unit-2",
          unitName: "Unidad",
          packageId: "pack-3",
          packageName: "Caja Individual",
          imageUrl: "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
          activeFrom: "2024-02-10",
          status: true,
          quantity: 1,
        },
      ],
    },
    {
      id: "3",
      brandId: "brand-3",
      brandName: "Varta",
      subcategoryId: "subcat-3",
      subcategoryName: "Baterías Automotrices",
      serviceCenterId: "f80ac9d5-a6d3-4e45-b800-6eb102abba86",
      name: "bateria-varta-12v-65ah",
      displayName: "Batería Varta 12V 65Ah",
      description: "Batería de alta durabilidad para vehículos livianos",
      activeFrom: "2024-03-05",
      status: false,
      categoryId: "cat-3",
      categoryName: "Baterías",
      packages: [
        {
          id: "pkg-4",
          sku: "VARTA-12V-65",
          barcode: "7891234567893",
          unitId: "unit-2",
          unitName: "Unidad",
          packageId: "pack-4",
          packageName: "Caja con garantía",
          imageUrl: "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
          activeFrom: "2024-03-05",
          status: false,
          quantity: 1,
        },
      ],
    },
    {
      id: "4",
      brandId: "brand-4",
      brandName: "Bridgestone",
      subcategoryId: "subcat-4",
      subcategoryName: "Llantas Aro 16",
      serviceCenterId: "f80ac9d5-a6d3-4e45-b800-6eb102abba86",
      name: "llanta-bridgestone-205-55-r16",
      displayName: "Llanta Bridgestone 205/55R16",
      description: "Llanta de alto rendimiento para sedanes",
      activeFrom: "2025-10-20",
      status: true,
      categoryId: "cat-4",
      categoryName: "Llantas",
      packages: [
        {
          id: "pkg-5",
          sku: "BRID-205-55-R16",
          barcode: "7891234567894",
          unitId: "unit-2",
          unitName: "Unidad",
          packageId: "pack-5",
          packageName: "Llanta Individual",
          imageUrl: "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
          activeFrom: "2025-10-20",
          status: true,
          quantity: 1,
        },
      ],
    },
  ];

  // Estados
  const [viewMode, setViewMode] = useState("grid"); // "grid" o "list"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all"); // "all", "active", "inactive"
  const [sortBy, setSortBy] = useState("recent"); // "recent", "name-asc", "name-desc", "brand", "category"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extraer opciones únicas para filtros
  const categories = useMemo(() => {
    const unique = [...new Set(mockProducts.map((p) => p.categoryName))];
    return unique.sort();
  }, []);

  const brands = useMemo(() => {
    const unique = [...new Set(mockProducts.map((p) => p.brandName))];
    return unique.sort();
  }, []);

  const subcategories = useMemo(() => {
    const unique = [...new Set(mockProducts.map((p) => p.subcategoryName))];
    return unique.sort();
  }, []);

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    // Búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.displayName.toLowerCase().includes(term) ||
          product.name.toLowerCase().includes(term) ||
          product.packages.some(
            (pkg) =>
              pkg.sku.toLowerCase().includes(term) ||
              pkg.barcode.includes(term)
          )
      );
    }

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
    if (selectedStatus !== "all") {
      filtered = filtered.filter((p) =>
        selectedStatus === "active" ? p.status : !p.status
      );
    }

    // Ordenamiento
    const sorted = [...filtered];
    switch (sortBy) {
      case "recent":
        sorted.sort((a, b) => new Date(b.activeFrom) - new Date(a.activeFrom));
        break;
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
    searchTerm,
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
    setSortBy("recent");
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

  // Cambiar estado
  const handleToggleStatus = (product) => {
    Swal.fire({
      title: product.status ? "¿Desactivar producto?" : "¿Activar producto?",
      text: product.displayName,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Éxito", "Estado actualizado", "success");
      }
    });
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

  // Verificar si es producto nuevo (< 30 días)
  const isNewProduct = (activeFrom) => {
    const now = new Date();
    const productDate = new Date(activeFrom);
    const diffTime = Math.abs(now - productDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
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

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>

        {/* Ordenamiento y Vista */}
        <div className={styles.controls}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="recent">Más recientes</option>
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
              className={`${styles.viewButton} ${
                viewMode === "grid" ? styles.active : ""
              }`}
              title="Vista en cuadrícula"
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`${styles.viewButton} ${
                viewMode === "list" ? styles.active : ""
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
                isNew={isNewProduct(product.activeFrom)}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ) : (
              <ProductListItem
                key={product.id}
                product={product}
                isNew={isNewProduct(product.activeFrom)}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
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
                <p className={styles.modalSubtitle}>{selectedProduct.name}</p>
                <div className={styles.modalBadges}>
                  <span className={`${styles.badge} ${styles.badgeStatus} ${selectedProduct.status ? styles.badgeActive : styles.badgeInactive}`}>
                    {selectedProduct.status ? "Activo" : "Inactivo"}
                  </span>
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
                <p className={styles.modalDescription}>
                  {selectedProduct.description}
                </p>
                <p className={styles.modalDate}>
                  Activo desde: {new Date(selectedProduct.activeFrom).toLocaleDateString()}
                </p>
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
                    <th>Cantidad</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td><strong>{pkg.sku}</strong></td>
                      <td>{pkg.barcode}</td>
                      <td>{pkg.unitName}</td>
                      <td>{pkg.packageName}</td>
                      <td>{pkg.quantity}</td>
                      <td>
                        <span className={`${styles.badge} ${pkg.status ? styles.badgeActive : styles.badgeInactive}`}>
                          {pkg.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
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