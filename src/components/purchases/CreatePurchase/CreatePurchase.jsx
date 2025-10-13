// src/components/purchases/CreatePurchase.jsx

import React, { useState } from "react";
import Swal from "sweetalert2";
import styles from "./CreatePurchase.module.css";
import { getTodayDate } from "@/utils/date-utils";
import useProductSearch from "@/hooks/useProductSearch";

const CreatePurchase = () => {
  // Datos estáticos para proveedores
  const mockProviders = [
    { id: "1", name: "Proveedor ABC" },
    { id: "2", name: "Distribuidora XYZ" },
    { id: "3", name: "Importadora Global" },
    { id: "4", name: "Comercial Los Andes" },
    { id: "5", name: "Distribuidora Nacional" },
  ];

  // Datos estáticos para tipos de comprobante
  const mockDocumentTypes = [
    { id: "1", name: "Factura" },
    { id: "2", name: "Boleta" },
    { id: "3", name: "Ticket" },
  ];

  const [documentTypes] = useState(mockDocumentTypes);
  const [allProviders] = useState(mockProviders);
  
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [providerSearchTerm, setProviderSearchTerm] = useState("");

  // Hook personalizado para búsqueda de productos
  const { searchTerm, setSearchTerm, filteredProducts, loading } = useProductSearch();

  const [purchaseItems, setPurchaseItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    purchaseNumber: "",
    providerId: "",
    date: getTodayDate(),
    documentTypeId: "",
    documentNumber: "",
  });

  // Búsqueda de proveedores
  const handleProviderSearchChange = (e) => {
    const value = e.target.value;
    setProviderSearchTerm(value);
    setFormData((prev) => ({ ...prev, providerId: "" }));

    if (value.trim() === "") {
      setFilteredProviders([]);
      return;
    }

    const results = allProviders.filter((provider) =>
      provider.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProviders(results);
  };

  // Seleccionar proveedor
  const handleSelectProvider = (provider) => {
    setProviderSearchTerm(provider.name);
    setFormData((prev) => ({ ...prev, providerId: provider.id }));
    setFilteredProviders([]);
  };

  // Seleccionar producto
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
    setSearchTerm("");
  };

  // Actualizar items con validación de negativos
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...purchaseItems];
    const numValue = parseFloat(value) || 0;
    
    // Validar que no sea negativo
    if (numValue < 0) return;
    
    updatedItems[index][field] = numValue;

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

    if (!formData.providerId) {
      Swal.fire("Error", "Debe seleccionar un proveedor", "error");
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
    setProviderSearchTerm("");
    setSearchTerm("");
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
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    value={providerSearchTerm}
                    onChange={handleProviderSearchChange}
                    className={styles.input}
                    placeholder="Buscar proveedor..."
                  />
                  {filteredProviders.length > 0 && (
                    <ul className={styles.dropdown}>
                      {filteredProviders.map((provider) => (
                        <li
                          key={provider.id}
                          onClick={() => handleSelectProvider(provider)}
                          className={styles.dropdownItem}
                        >
                          {provider.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.input}
                  placeholder="Buscar producto..."
                />
                {loading && <span className={styles.loadingSpinner}></span>}
                {filteredProducts.length > 0 && (
                  <ul className={styles.dropdown}>
                    {filteredProducts.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className={styles.dropdownItem}
                      >
                        {product.name}
                        {product.sku && <span> - SKU: {product.sku}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Tabla de productos agregados */}
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
                {purchaseItems.length > 0 ? (
                  purchaseItems.map((item, index) => (
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
                          step="0.1"
                          value={item.purchasePrice}
                          onChange={(e) =>
                            handleItemChange(index, "purchasePrice", e.target.value)
                          }
                          className={styles.tableInput}
                          min="0"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          value={item.salePrice}
                          onChange={(e) =>
                            handleItemChange(index, "salePrice", e.target.value)
                          }
                          className={styles.tableInput}
                          min="0"
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#6c757d" }}>
                      No hay productos agregados. Busque y seleccione productos arriba.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className={styles.totalContainer}>
              <span className={styles.totalLabel}>TOTAL COMPRA:</span>
              <span className={styles.totalAmount}>{calculateTotal()}</span>
            </div>
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