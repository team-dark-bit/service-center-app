// src/components/purchases/CreatePurchase.jsx

import React, { useState } from "react";
import Swal from "sweetalert2";
import styles from "./CreatePurchase.module.css";
import { getTodayDate } from "@/utils/date-utils";

const CreatePurchase = () => {
  // Datos estáticos para proveedores
  const mockProviders = [
    { id: "1", name: "Proveedor ABC" },
    { id: "2", name: "Distribuidora XYZ" },
    { id: "3", name: "Importadora Global" },
  ];

  // Datos estáticos para tipos de comprobante
  const mockDocumentTypes = [
    { id: "1", name: "Factura" },
    { id: "2", name: "Boleta" },
    { id: "3", name: "Ticket" },
  ];

  // Datos estáticos para productos (simula la respuesta del backend)
  const mockProducts = [
    { id: "1", name: "Laptop Dell XPS" },
    { id: "2", name: "Mouse Logitech G502" },
    { id: "3", name: "Teclado Mecánico Razer" },
    { id: "4", name: "Monitor Samsung 24\"" },
    { id: "5", name: "SSD Kingston 500GB" },
    { id: "6", name: "Impresora HP Deskjet" },
  ];

  const [providers] = useState(mockProviders);
  const [documentTypes] = useState(mockDocumentTypes);
  const [allProducts] = useState(mockProducts); // Todos los productos
  const [filteredProducts, setFilteredProducts] = useState([]); // Resultados de búsqueda
  const [searchTerm, setSearchTerm] = useState(""); // Valor del input de búsqueda

  const [purchaseItems, setPurchaseItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    purchaseNumber: "",
    providerId: "",
    date: getTodayDate(),
    documentTypeId: "",
    documentNumber: "",
  });

  // Simula búsqueda de productos en el backend
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    // Simula búsqueda en el backend
    const results = allProducts.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProducts(results);
  };

  // Selecciona un producto de la lista de búsqueda y lo agrega a la tabla
  const handleSelectProduct = (product) => {
    const newItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      purchasePrice: 0,
      salePrice: 0,
      importe: 0,
    };

    setPurchaseItems((prev) => [...prev, newItem]);

    // Resetear input de búsqueda
    setSearchTerm("");
    setFilteredProducts([]);
  };

  // Actualiza campos editables en la tabla
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...purchaseItems];
    updatedItems[index][field] = parseFloat(value) || 0;

    // Recalcular importe
    updatedItems[index].importe =
      updatedItems[index].quantity * updatedItems[index].purchasePrice;

    setPurchaseItems(updatedItems);
  };

  const handleRemoveProduct = (index) => {
    setPurchaseItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return purchaseItems.reduce((sum, item) => sum + item.importe, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (purchaseItems.length === 0) {
      Swal.fire("Error", "Debe agregar al menos un producto", "error");
      return;
    }

    setIsLoading(true);

    // Simulamos una API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);

    Swal.fire({
      title: "¡Éxito!",
      text: "Compra registrada correctamente",
      icon: "success",
      confirmButtonText: "Continuar",
    }).then(() => {
      resetForm();
    });
  };

  const resetForm = () => {
    setFormData({
      purchaseNumber: "",
      providerId: "",
      date: getTodayDate(),
      documentTypeId: "",
      documentNumber: "",
    });
    setPurchaseItems([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>REGISTRAR COMPRA</h1>
        <p className={styles.subtitle}>
          Complete la información de la nueva compra
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Información de la compra */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información de la Compra</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>N° Compra:</label>
                <input
                  type="text"
                  name="purchaseNumber"
                  value={formData.purchaseNumber}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Ingrese número de compra"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Proveedor:</label>
                <select
                  name="providerId"
                  value={formData.providerId}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="">Seleccione un proveedor</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fecha:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo Comprobante:</label>
                <select
                  name="documentTypeId"
                  value={formData.documentTypeId}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="">Seleccione tipo</option>
                  {documentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>N° Comprobante:</label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Número del comprobante"
                />
              </div>
            </div>
          </div>

          {/* Sección de productos */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Productos</h3>

            {/* Input de búsqueda de producto */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Producto:</label>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={styles.input}
                  placeholder="Buscar producto..."
                />
                {filteredProducts.length > 0 && (
                  <ul className={styles.dropdown}>
                    {filteredProducts.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className={styles.dropdownItem}
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Tabla de productos agregados */}
            {purchaseItems.length > 0 && (
              <>
                <table className={styles.productsTable}>
                  <thead>
                    <tr>
                      <th className={styles.nameCol}>Nombre</th>
                      <th className={styles.quantityCol}>Cantidad</th>
                      <th className={styles.priceCol}>P. Compra</th>
                      <th className={styles.priceCol}>P. Venta</th>
                      <th className={styles.totalCol}>Importe</th>
                      <th className={styles.deleteCol}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span style={{ color: "#007bff" }}>{item.name}</span>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(index, "quantity", e.target.value)
                            }
                            className={styles.tableInput}
                            min="1"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={item.purchasePrice}
                            onChange={(e) =>
                              handleItemChange(index, "purchasePrice", e.target.value)
                            }
                            className={styles.tableInput}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={item.salePrice}
                            onChange={(e) =>
                              handleItemChange(index, "salePrice", e.target.value)
                            }
                            className={styles.tableInput}
                          />
                        </td>
                        <td>{item.importe.toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(index)}
                            className={styles.deleteButton}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.totalContainer}>
                  <span className={styles.totalLabel}>TOTAL COMPRA:</span>
                  <span className={styles.totalAmount}>{calculateTotal()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Botón de registro */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.registerButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.loadingSpinner}></span>
                Registrando...
              </>
            ) : (
              "REGISTRAR"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchase;