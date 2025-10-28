// src/components/purchases/CreatePurchase.jsx

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styles from "./CreatePurchase.module.css";
import { getTodayDate } from "@/utils/date-utils";
import useProductSearch from "@/hooks/useProductSearch";
import supplierApi from "@/api/supplierApi";
import purchaseApi from "@/api/purchaseApi";
import SearchSelect from "@/components/common/SearchSelect";

const CreatePurchase = () => {
  // Datos estáticos para tipos de comprobante
  const mockDocumentTypes = [
    { id: "1", name: "Factura" },
    { id: "2", name: "Boleta" },
    { id: "3", name: "Ticket" },
  ];

  const [documentTypes] = useState(mockDocumentTypes);
  const [allSuppliers, setAllSuppliers] = useState([]);

  const { searchTerm, setSearchTerm, filteredProducts, loading } =
    useProductSearch();

  const [purchaseItems, setPurchaseItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    purchaseNumber: "",
    providerId: "",
    date: getTodayDate(),
    documentTypeId: "",
    documentNumber: "",
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliers = await supplierApi.getAll();
        setAllSuppliers(suppliers);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
        setAllSuppliers([]);
      }
    };

    fetchSuppliers();
  }, []);

  // ⭐ Modificar para usar los nombres correctos del backend
  const handleSelectProduct = (product) => {

    const newItem = {
      id: product.productId,
      name: product.productName,
      productPackageId: product.productPackageId,
      quantity: 1,
      purchasePrice: 0,
      salePrice: 0,
      importe: 0,
    };


    setPurchaseItems((prev) => [...prev, newItem]);
    setSearchTerm("");
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...purchaseItems];
    const numValue = parseFloat(value) || 0;

    if (numValue < 0) return;

    updatedItems[index][field] = numValue;

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
    return purchaseItems
      .reduce((sum, item) => sum + item.importe, 0)
      .toFixed(2);
  };


  const prepareDataForBackend = () => {

    const selectedDocType = documentTypes.find(
      (type) => type.id === formData.documentTypeId
    );

    return {
      purchaseNumber: formData.purchaseNumber,
      supplierId: formData.providerId, 
      purchaseDate: new Date(formData.date).toISOString(), 
      receiptType: selectedDocType ? selectedDocType.name : "", 
      receiptNumber: formData.documentNumber,
      totalAmount: parseFloat(calculateTotal()), 
      products: purchaseItems.map((item) => ({
        productId: item.id,
        productPackageId: item.productPackageId, 
        quantity: item.quantity.toString(), 
        purchaseUnitPrice: item.purchasePrice.toFixed(2), 
        saleUnitPrice: item.salePrice.toFixed(2), 
        subtotal: item.importe.toFixed(2), 
      })),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (purchaseItems.length === 0) {
      Swal.fire("Error", "Debe agregar al menos un producto", "error");
      return;
    }

    if (!formData.providerId) {
      Swal.fire("Error", "Debe seleccionar un proveedor", "error");
      return;
    }

    if (!formData.documentTypeId) {
      Swal.fire("Error", "Debe seleccionar un tipo de comprobante", "error");
      return;
    }


    console.log("Productos en la tabla:", purchaseItems); 

    const hasInvalidProducts = purchaseItems.some(
      (item) => !item.productPackageId
    );

    console.log("¿Hay productos inválidos?", hasInvalidProducts); 

    if (hasInvalidProducts) {
      Swal.fire(
        "Error",
        "Todos los productos deben tener un paquete asignado",
        "error"
      );
      return;
    }

    setIsLoading(true);

    try {

      const purchaseData = prepareDataForBackend();


      console.log("Datos a enviar:", JSON.stringify(purchaseData, null, 2));


      await purchaseApi.create(purchaseData);

      // Éxito - Limpiar formulario
      Swal.fire({
        title: "¡Éxito!",
        text: "Compra registrada correctamente",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        resetForm();
      });
    } catch (error) {
      console.error("Error al registrar compra:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo registrar la compra",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
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
                  required
                />
              </div>

              <SearchSelect
                label="Proveedor"
                name="providerId"
                options={allSuppliers}
                value={formData.providerId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    providerId: e.target.value,
                  }))
                }
                placeholder="Buscar proveedor..."
                required
              />
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
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo Comprobante:</label>
                <select
                  name="documentTypeId"
                  value={formData.documentTypeId}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">-- Seleccionar --</option>
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
                  required
                />
              </div>
            </div>
          </div>

          {/* Sección de productos */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Productos</h3>

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
                        key={product.productId} 
                        onClick={() => handleSelectProduct(product)}
                        className={styles.dropdownItem}
                      >
                        {product.productName}
                        {product.codedName && (
                          <span> - {product.codedName}</span>
                        )}{" "}
                        {product.sku && <span> - SKU: {product.sku}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

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
                          step="0.01"
                          value={item.purchasePrice}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "purchasePrice",
                              e.target.value
                            )
                          }
                          className={styles.tableInput}
                          min="0"
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
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#6c757d",
                      }}
                    >
                      No hay productos agregados. Busque y seleccione productos
                      arriba.
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
