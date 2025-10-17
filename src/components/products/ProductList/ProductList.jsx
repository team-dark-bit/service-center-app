import React, { useState, useEffect } from "react";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos mock para desarrollo
  const mockProducts = [
    {
      id: 1,
      name: "Aceite de Motor Castrol 20W-50",
      price: 89.00,
      stock: 25,
      image: "https://bateriasaltoque.pe/wp-content/uploads/2021/05/YTX9-BSprueba-1.jpg"
    },
    {
      id: 2,
      name: "Filtro de Aceite Toyota",
      price: 45.50,
      stock: 150,
      image: "https://bateriasaltoque.pe/wp-content/uploads/2021/05/YTX9-BSprueba-1.jpg"
    },
    {
      id: 3,
      name: "Batería 12V 65Ah",
      price: 350.00,
      stock: 8,
      image: "https://bateriasaltoque.pe/wp-content/uploads/2021/05/YTX9-BSprueba-1.jpg"
    },
    {
      id: 4,
      name: "Llanta Bridgestone 205/55R16",
      price: 280.00,
      stock: 32,
      image: "https://bateriasaltoque.pe/wp-content/uploads/2021/05/YTX9-BSprueba-1.jpg"
    },
    {
      id: 5,
      name: "Pastillas de Freno Nissan",
      price: 120.00,
      stock: 45,
      image: "https://bateriasaltoque.pe/wp-content/uploads/2021/05/YTX9-BSprueba-1.jpg"
    },
    {
      id: 6,
      name: "Amortiguador Delantero",
      price: 195.00,
      stock: 12,
      image: "https://bateriasaltoque.pe/wp-content/uploads/2021/05/YTX9-BSprueba-1.jpg"
    },
    {
      id: 7,
      name: "Bujías NGK Platino",
      price: 65.00,
      stock: 200,
      image: "https://bateriasaltoque.pe/wp-content/uploads/2021/05/YTX9-BSprueba-1.jpg"
    },
    {
      id: 8,
      name: "Radiador Aluminio",
      price: 450.00,
      stock: 5,
      image: "https://bateriasaltoque.pe/wp-content/uploads/2021/05/YTX9-BSprueba-1.jpg"
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Descomenta esto cuando tengas la API lista
      // const data = await productApi.getAll();
      // setProducts(data);
      
      // Mock data para desarrollo
      setTimeout(() => {
        setProducts(mockProducts);
        setLoading(false);
      }, 800);
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
                <span className={styles.location}>Ayacucho, PE</span>
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