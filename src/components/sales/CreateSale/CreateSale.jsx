import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Select from "@/components/common/Select";
import styles from "./CreateSale.module.css";
import { getTodayDate } from "@/utils/date-utils";

const CreateSale = () => {
  const documentTypes = [
    { id: "1", name: "NOTA DE VENTA" },
    { id: "2", name: "BOLETA" },
    { id: "3", name: "FACTURA" },
  ];

  const paymentMethods = [
    { id: "1", name: "PAGO EFECTIVO" },
    { id: "2", name: "YAPE" },
    { id: "3", name: "PLIN" },
  ];

  // Mock de productos
  const mockProducts = [
    {
      id: 1,
      name: "Aceite de Motor Castrol 20W-50",
      imageUrl:
        "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
      stock: 25,
      purchasePrice: 65.0,
      salePrice: 89.0,
    },
    {
      id: 2,
      name: "Filtro de Aceite Toyota",
      imageUrl:
        "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
      stock: 150,
      purchasePrice: 30.0,
      salePrice: 45.5,
    },
    {
      id: 3,
      name: "Batería 12V 65Ah",
      imageUrl:
        "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
      stock: 8,
      purchasePrice: 280.0,
      salePrice: 350.0,
    },
    {
      id: 4,
      name: "Llanta Bridgestone 205/55R16",
      imageUrl:
        "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
      stock: 32,
      purchasePrice: 220.0,
      salePrice: 280.0,
    },
    {
      id: 5,
      name: "Pastillas de Freno Nissan",
      imageUrl:
        "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
      stock: 45,
      purchasePrice: 85.0,
      salePrice: 120.0,
    },
    {
      id: 6,
      name: "Amortiguador Delantero",
      imageUrl:
        "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
      stock: 12,
      purchasePrice: 145.0,
      salePrice: 195.0,
    },
    {
      id: 7,
      name: "Bujías NGK Platino Set x4",
      imageUrl:
        "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
      stock: 200,
      purchasePrice: 45.0,
      salePrice: 65.0,
    },
    {
      id: 8,
      name: "Radiador Aluminio Universal",
      imageUrl:
        "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
      stock: 5,
      purchasePrice: 320.0,
      salePrice: 450.0,
    },
    {
      id: 9,
      name: "Kit de Embrague Completo",
      imageUrl:
        "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
      stock: 15,
      purchasePrice: 380.0,
      salePrice: 520.0,
    },
    {
      id: 10,
      name: "Espejo Retrovisor Derecho",
      imageUrl:
        "https://plazavea.vteximg.com.br/arquivos/ids/30489250-450-450/141848.jpg?v=638740742006030000",
      stock: 18,
      purchasePrice: 95.0,
      salePrice: 135.0,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    documentType: "1",
    saleNumber: "",
    clientName: "",
    clientDni: "",
    clientPhone: "",
    userName: "ADMINISTRADOR",
    paymentMethod: "1",
    saleDate: getTodayDate(),
  });

  const [saleItems, setSaleItems] = useState([]);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Búsqueda de productos
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "" || value.length < 2) {
      setFilteredProducts([]);
      setShowDropdown(false);
      return;
    }

    const results = mockProducts.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(results);
    setShowDropdown(true);
  };

  const handleSelectProduct = (product) => {
    // Verificar si el producto ya está en la lista
    const existingItem = saleItems.find((item) => item.id === product.id);

    if (existingItem) {
      Swal.fire("Aviso", "El producto ya está agregado", "info");
      setSearchTerm("");
      setShowDropdown(false);
      return;
    }

    const newItem = {
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      stock: product.stock,
      purchasePrice: product.purchasePrice,
      quantity: 1,
      salePrice: product.salePrice,
      total: product.salePrice,
    };

    setSaleItems((prev) => [...prev, newItem]);
    setSearchTerm("");
    setShowDropdown(false);
    setFilteredProducts([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (index, value) => {
    const numValue = parseInt(value) || 1;
    if (numValue < 1) return;

    setSaleItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = numValue;
      updated[index].total = numValue * updated[index].salePrice;
      return updated;
    });
  };

  const handleRemoveItem = (id) => {
    setSaleItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return saleItems.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const handleOpenClientModal = () => {
    setIsClientModalOpen(true);
  };

  const handleSaveClient = () => {
    if (!formData.clientDni.trim() || !formData.clientName.trim()) {
      Swal.fire("Error", "Complete DNI y Nombre del cliente", "error");
      return;
    }
    setIsClientModalOpen(false);
    Swal.fire("Éxito", "Cliente agregado correctamente", "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saleItems.length === 0) {
      Swal.fire("Error", "Debe agregar al menos un producto", "error");
      return;
    }

    setIsLoading(true);

    // Simulación de envío
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);

    Swal.fire({
      title: "¡Venta Realizada!",
      text: `Total: S/ ${calculateTotal()}`,
      icon: "success",
      confirmButtonText: "Continuar",
    }).then(() => {
      // Reset form
      setSaleItems([]);
      setFormData({
        ...formData,
        saleNumber: "",
        clientName: "",
        clientDni: "",
        clientPhone: "",
      });
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Registrar Venta</h1>
      </div>

      {/* Barra de Búsqueda Global */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer} ref={dropdownRef}>
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />

          {showDropdown && filteredProducts.length > 0 && (
            <ul className={styles.searchDropdown}>
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className={styles.dropdownItem}
                  onClick={() => handleSelectProduct(product)}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className={styles.dropdownItemContent}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className={styles.dropdownItemImage}
                    />
                    <div className={styles.dropdownItemInfo}>
                      <p className={styles.dropdownItemName}>{product.name}</p>
                      <p className={styles.dropdownItemPrice}>
                        S/ {product.salePrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {hoveredProduct === product.id && (
                    <div className={styles.imageTooltip}>
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {showDropdown && filteredProducts.length === 0 && (
            <ul className={styles.searchDropdown}>
              <li className={styles.emptyDropdown}>
                No se encontraron productos
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Columna Izquierda - Productos SELECCIONADOS (70%) */}
        <div className={styles.leftColumn}>
          <h3 className={styles.sectionTitle}>
            Productos Seleccionados ({saleItems.length})
          </h3>

          <div className={styles.selectedProductsGrid}>
            {saleItems.length > 0 ? (
              saleItems.map((item) => (
                <div key={item.id} className={styles.selectedCard}>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className={styles.removeCardButton}
                  >
                    ×
                  </button>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={styles.selectedCardImage}
                  />
                  <div className={styles.selectedCardInfo}>
                    <p className={styles.selectedCardName}>{item.name}</p>

                    <p className={styles.selectedCardPricePurchase}>
                      <span>P. Compra:</span>
                      <span>S/ {item.purchasePrice.toFixed(2)}</span>
                    </p>

                    <p className={styles.selectedCardPriceSale}>
                      <span>P. Venta:</span>
                      <span>S/ {item.salePrice.toFixed(2)}</span>
                    </p>

                    <p className={styles.selectedCardStock}>
                      <span>Stock:</span>
                      <span>{item.stock} unid.</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptySelectedMessage}>
                <p>No hay productos seleccionados</p>
                <p className={styles.emptyHint}>
                  Busca y selecciona productos arriba
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha - Detalle de Venta (30%) */}
        <div className={styles.rightColumn}>
          <form onSubmit={handleSubmit} className={styles.saleForm}>
            <h2 className={styles.formTitle}>Detalle de Venta</h2>

            {/* Información de la venta */}
            <div className={styles.formRow}>

                <Select
                label="Tipo de Comprobante:"
                name="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                options={documentTypes}
                valueKey="id"
                labelKey="name"
                placeholder="Seleccionar Tipo de documento..."
                required
              />

              <Input
                label="Serie y Número:"
                name="saleNumber"
                value={formData.saleNumber}
                onChange={handleInputChange}
                placeholder="NV001-3"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cliente:</label>
                <div className={styles.clientInputGroup}>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="Buscar o seleccionar cliente..."
                    className={styles.input}
                  />
                  <Button
                    type="button"
                    onClick={handleOpenClientModal}
                    variant="primary"
                    size="small"
                  >
                    + Nuevo
                  </Button>
                </div>
              </div>

              <Input
                label="Usuario:"
                name="userName"
                value={formData.userName}
                disabled
              />
            </div>

            <div className={styles.formRow}>
              <Select
                label="Método de Pago:"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                options={paymentMethods}
                valueKey="id"
                labelKey="name"
                placeholder="Seleccionar método de pago..."
                required
              />


                <Input
                  label="Fecha de Venta:"
                  name="saleDate"
                  type="date"
                  value={formData.saleDate}
                  onChange={handleInputChange}
                />

            </div>

            {/* Tabla de productos */}
            <h3 className={styles.sectionTitle}>Detalle de Productos</h3>
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cant.</th>
                  <th>P.V.(S/.)</th>
                  <th>Importe</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {saleItems.length > 0 ? (
                  saleItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          className={styles.tableInput}
                          min="1"
                        />
                      </td>
                      <td>{item.salePrice.toFixed(2)}</td>
                      <td>{item.total.toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className={styles.deleteButton}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.emptyState}>
                      No hay productos en la venta
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Total */}
            <div className={styles.totalContainer}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalAmount}>S/ {calculateTotal()}</span>
            </div>

            {/* Botón de venta */}
            <Button
              type="submit"
              variant="success"
              fullWidth
              loading={isLoading}
            >
              Realizar Venta
            </Button>
          </form>
        </div>
      </div>

      {/* Modal de Nuevo Cliente */}
      <Modal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        title="Nuevo Cliente"
        size="small"
      >
        <div className={styles.modalContent}>
          <Input
            label="DNI"
            name="clientDni"
            value={formData.clientDni}
            onChange={handleInputChange}
            placeholder="Ingrese DNI"
            maxLength={8}
            required
          />

          <Input
            label="Nombre"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            placeholder="Ingrese nombre completo"
            required
          />

          <Input
            label="Teléfono"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleInputChange}
            placeholder="Ingrese teléfono"
            maxLength={15}
          />

          <div className={styles.modalActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsClientModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" variant="primary" onClick={handleSaveClient}>
              Guardar Cliente
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateSale;
