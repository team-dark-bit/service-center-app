import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Select from "@/components/common/Select";
import styles from "./CreateSale.module.css";
import { getTodayDate } from "@/utils/date-utils";
import customerApi from "@/api/customerApi";
import productApi from "@/api/productApi";
import salesApi from "@/api/salesApi";
import SearchSelect from "@/components/common/SearchSelect";

const CreateSale = () => {
  const documentTypes = [
    { id: "1", name: "NOTA DE VENTA" },
    { id: "2", name: "BOLETA" },
    { id: "3", name: "FACTURA" },
  ];

  const paymentMethods = [
    { id: "1", name: "EFECTIVO" },
    { id: "2", name: "YAPE" },
    { id: "3", name: "PLIN" },
  ];

  const identityDocumentTypes = [
    { id: "DNI", name: "DNI", maxLength: 8 },
    { id: "RUC", name: "RUC", maxLength: 11 },
    { id: "CEX", name: "CEX", maxLength: 20 },
  ];

  // Mock de productos (deprecated)
  const mockProducts = [];

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [allClients, setAllClients] = useState([]);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    documentType: "1",
    clientId: "",
    saleNumber: "",
    clientName: "",
    clientDni: "",
    clientPhone: "",
    userName: "ADMINISTRADOR",
    paymentMethod: "1",
    saleDate: getTodayDate(),
  });

  const [clientModalData, setClientModalData] = useState({
    documentType: "DNI",
    documentNumber: "",
    fullName: "",
    companyName: "",
    phoneNumber: "",
  });

  const [clientModalErrors, setClientModalErrors] = useState({});

  const [saleItems, setSaleItems] = useState([]);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedItemForBatch, setSelectedItemForBatch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await customerApi.getAll();
        const clientsWithDisplay = clients.map((client) => ({
          ...client,
          displayName: client.fullName || client.companyName || "Sin nombre",
        }));
        setAllClients(clientsWithDisplay);
      } catch (error) {
        console.error("Error fetching clients:", error);
        Swal.fire("Error", "No se pudieron cargar los clientes", "error");
        setAllClients([]);
      }
    };

    fetchClients();
  }, []);

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

  // Debounce para búsqueda de productos
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Efecto para buscar productos cuando cambia el término debounced
  useEffect(() => {
    if (debouncedSearchTerm.trim() === "" || debouncedSearchTerm.length < 2) {
      setFilteredProducts([]);
      setShowDropdown(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setIsSearchingProducts(true);
        const data = await productApi.getInventory(debouncedSearchTerm);

        const mappedResults = [];
        data.forEach(product => {
          if (product.packages && product.packages.length > 0) {
            product.packages.forEach(pkg => {
              // Calcular stock total de los lotes
              const totalStock = pkg.batches ? pkg.batches.reduce((sum, batch) => sum + batch.quantityAvailable, 0) : 0;

              // Obtener precios del PRIMER lote (preferiblemente el más antiguo o según lógica de negocio)
              const firstBatch = pkg.batches && pkg.batches.length > 0 ? pkg.batches[0] : null;
              const salePrice = firstBatch ? firstBatch.saleUnitPrice : 0;
              const purchasePrice = firstBatch ? firstBatch.purchaseUnitPrice : 0;

              mappedResults.push({
                id: pkg.productPackageId,
                name: `${product.productName} (${pkg.packageCodedName})`,
                imageUrl: pkg.imageUrl || "https://bateriasaltoque.pe/wp-content/uploads/2021/05/YTX9-BSprueba-1.jpg",
                stock: totalStock,
                purchasePrice: purchasePrice,
                salePrice: salePrice,
                batches: pkg.batches || [],
              });
            });
          }
        });

        setFilteredProducts(mappedResults);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsSearchingProducts(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchTerm]);

  // Búsqueda de productos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
      batches: product.batches,
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

  const handleViewBatches = (item) => {
    setSelectedItemForBatch(item);
    setIsBatchModalOpen(true);
  };

  const handleSelectBatch = (batch) => {
    if (!selectedItemForBatch) return;

    setSaleItems((prev) =>
      prev.map((item) =>
        item.id === selectedItemForBatch.id
          ? {
            ...item,
            salePrice: batch.saleUnitPrice,
            purchasePrice: batch.purchaseUnitPrice,
            total: item.quantity * batch.saleUnitPrice,
          }
          : item
      )
    );
    setIsBatchModalOpen(false);
    setSelectedItemForBatch(null);
  };

  const calculateTotal = () => {
    return saleItems.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const handleOpenClientModal = () => {
    setIsClientModalOpen(true);
  };

  const getMaxLength = () => {
    const docType = identityDocumentTypes.find(
      (dt) => dt.id === clientModalData.documentType
    );
    return docType ? docType.maxLength : 20;
  };

  const validateDocumentNumber = (type, number) => {
    const numericOnly = /^\d+$/;

    if (!number) return "El número de documento es requerido";
    if (!numericOnly.test(number)) return "Solo se permiten números";

    switch (type) {
      case "DNI":
        if (number.length !== 8) return "El DNI debe tener 8 dígitos";
        break;
      case "RUC":
        if (number.length !== 11) return "El RUC debe tener 11 dígitos";
        break;
      case "CEX":
        if (number.length > 20) return "El CEX debe tener máximo 20 dígitos";
        if (number.length < 1) return "El CEX debe tener al menos 1 dígito";
        break;
      default:
        break;
    }
    return "";
  };

  const handleClientDocumentTypeChange = (e) => {
    const newDocType = e.target.value;

    setClientModalData((prev) => ({
      ...prev,
      documentType: newDocType,
      documentNumber: "",
      fullName: newDocType === "RUC" ? "" : prev.fullName,
      companyName: newDocType !== "RUC" ? "" : prev.companyName,
    }));

    setClientModalErrors({});
  };

  const handleClientModalInputChange = (e) => {
    const { name, value } = e.target;

    // Validación especial para documentNumber
    if (name === "documentNumber") {
      const numericOnly = /^\d*$/;
      if (!numericOnly.test(value)) return;

      const maxLength = getMaxLength();
      if (value.length > maxLength) return;
    }

    if (name === "phoneNumber") {
      const numericOnly = /^\d*$/;
      if (!numericOnly.test(value)) return;
      if (value.length > 9) return;
    }

    setClientModalData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo
    if (clientModalErrors[name]) {
      setClientModalErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateClientModal = () => {
    const newErrors = {};

    // Validar documento
    const docError = validateDocumentNumber(
      clientModalData.documentType,
      clientModalData.documentNumber
    );
    if (docError) newErrors.documentNumber = docError;

    // Validar según tipo de documento
    if (clientModalData.documentType === "RUC") {
      if (!clientModalData.companyName.trim()) {
        newErrors.companyName = "La razón social es requerida para RUC";
      }
    } else {
      // DNI o CEX
      if (!clientModalData.fullName.trim()) {
        newErrors.fullName = "El nombre completo es requerido";
      }
    }

    setClientModalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareClientDataForBackend = () => {
    const data = {
      documentType: clientModalData.documentType,
      documentNumber: clientModalData.documentNumber,
      phoneNumber: clientModalData.phoneNumber,
      active: true,
    };

    if (clientModalData.documentType === "RUC") {
      data.companyName = clientModalData.companyName.trim();
      data.fullName = "";
    } else {
      data.fullName = clientModalData.fullName.trim();
      data.companyName = "";
    }

    return data;
  };

  const handleSaveClient = async () => {
    if (!validateClientModal()) {
      return;
    }

    try {
      const dataToSend = prepareClientDataForBackend();
      const response = await customerApi.create(dataToSend);

      const clients = await customerApi.getAll();
      const clientsWithDisplay = clients.map((client) => ({
        ...client,
        displayName: client.fullName || client.companyName || "Sin nombre",
      }));
      setAllClients(clientsWithDisplay);

      setFormData((prev) => ({
        ...prev,
        clientId: response.id,
      }));

      // Cerrar modal y resetear
      setIsClientModalOpen(false);
      setClientModalData({
        documentType: "DNI",
        documentNumber: "",
        fullName: "",
        companyName: "",
        phoneNumber: "",
      });
      setClientModalErrors({});

      Swal.fire("Éxito", "Cliente agregado correctamente", "success");
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      Swal.fire(
        "Error",
        "No se pudo registrar el cliente. Intente nuevamente.",
        "error"
      );
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clientId) {
      Swal.fire("Error", "Debe seleccionar un cliente", "error");
      return;
    }

    if (saleItems.length === 0) {
      Swal.fire("Error", "Debe agregar al menos un producto", "error");
      return;
    }

    setIsLoading(true);

    try {
      const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
      const igvRate = 18.0;
      const total = subtotal;

      const payload = {
        customerId: formData.clientId,
        userId: "20c8c4e5-d051-45c0-a3b7-109408885d44", // ID fijo según requerimiento
        igv: igvRate,
        subtotal: parseFloat(subtotal.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        discount: 0.0,
        details: saleItems.map((item) => ({
          itemType: "product",
          productPackageId: item.id,
          serviceId: null,
          quantity: item.quantity,
          unitPrice: item.salePrice,
          subtotal: item.total,
          discount: 0.0,
          description: null,
        })),
      };

      await salesApi.create(payload);

      Swal.fire({
        title: "¡Venta Realizada!",
        text: `Total: S/ ${total.toFixed(2)}`,
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        // Reset form
        setSaleItems([]);
        setFormData({
          ...formData,
          clientId: "", // Clear client too
          saleNumber: "",
          clientName: "",
          clientDni: "",
          clientPhone: "",
          userName: "ADMINISTRADOR",
          paymentMethod: "1",
          saleDate: getTodayDate(),
          documentType: "1",
        });
      });
    } catch (error) {
      console.error("Error al realizar la venta:", error);
      Swal.fire(
        "Error",
        "No se pudo registrar la venta. Intente nuevamente.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
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
          {isSearchingProducts && (
            <div className={styles.searchingIndicator}>Buscando...</div>
          )}

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
                  <div className={styles.imageContainer}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className={styles.selectedCardImage}
                    />
                    {item.batches && item.batches.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleViewBatches(item)}
                        className={styles.viewBatchesCardButton}
                        title="Ver y seleccionar lotes"
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className={styles.removeCardButton}
                    >
                      ×
                    </button>
                    <div className={styles.stockBadge}>
                      <span className={styles.stockText}>
                        Stock: {item.stock} unid.
                      </span>
                    </div>
                  </div>

                  <div className={styles.selectedCardContent}>
                    <h3 className={styles.selectedCardName}>{item.name}</h3>

                    <div className={styles.selectedCardFooter}>
                      <div className={styles.priceRow}>
                        <span className={styles.priceLabel}>P. Venta:</span>
                        <span className={styles.priceValue}>S/ {item.salePrice.toFixed(2)}</span>
                      </div>

                      <div className={styles.purchasePriceRow}>
                        <span className={styles.purchasePriceLabel}>P. Compra:</span>
                        <span className={styles.purchasePriceValue}>S/ {item.purchasePrice.toFixed(2)}</span>
                      </div>
                    </div>
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

            <div className={styles.clientInputGroup}>
              <div className={styles.searchSelectWrapper}>
                <SearchSelect
                  label="Cliente:"
                  name="clientId"
                  options={allClients}
                  value={formData.clientId}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      clientId: e.target.value,
                    }));
                  }}
                  placeholder="Buscar cliente..."
                  displayKey="fullName"
                  fallbackDisplayKey="companyName"
                  valueKey="id"
                  searchKeys={["fullName", "companyName"]}
                />
              </div>
              <Button
                type="button"
                onClick={handleOpenClientModal}
                variant="primary"
                size="small"
                className={styles.addButton}
              >
                +
              </Button>
            </div>
            <div className={styles.formGroup}>
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
                  <th></th>
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
                      <td>
                        {item.batches && item.batches.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleViewBatches(item)}
                            className={styles.tableBatchButton}
                            title="Cambiar lote"
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                        )}
                      </td>
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
                    <td colSpan="6" className={styles.emptyState}>
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
        onClose={() => {
          setIsClientModalOpen(false);
          setClientModalData({
            documentType: "DNI",
            documentNumber: "",
            fullName: "",
            companyName: "",
            phoneNumber: "",
          });
          setClientModalErrors({});
        }}
        title="Nuevo Cliente"
        size="small"
      >
        <div className={styles.modalContent}>
          {/* Tipo de Documento */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Tipo de Documento <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="documentType"
              value={clientModalData.documentType}
              onChange={handleClientDocumentTypeChange}
              className={styles.input}
            >
              {identityDocumentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Número de Documento */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Número de Documento <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="documentNumber"
              value={clientModalData.documentNumber}
              onChange={handleClientModalInputChange}
              className={styles.input}
              placeholder={`Ingrese ${clientModalData.documentType
                } (${getMaxLength()} dígitos${clientModalData.documentType === "CEX" ? " máx." : ""
                })`}
              maxLength={getMaxLength()}
            />
            {clientModalErrors.documentNumber && (
              <span style={{ color: "red", fontSize: "0.85rem" }}>
                {clientModalErrors.documentNumber}
              </span>
            )}
          </div>

          {/* Campo condicional: Razón Social (solo para RUC) */}
          {clientModalData.documentType === "RUC" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Razón Social <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={clientModalData.companyName}
                onChange={handleClientModalInputChange}
                className={styles.input}
                placeholder="Ingrese la razón social"
              />
              {clientModalErrors.companyName && (
                <span style={{ color: "red", fontSize: "0.85rem" }}>
                  {clientModalErrors.companyName}
                </span>
              )}
            </div>
          )}

          {/* Campo condicional: Nombre Completo (solo para DNI y CEX) */}
          {(clientModalData.documentType === "DNI" ||
            clientModalData.documentType === "CEX") && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nombre Completo <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={clientModalData.fullName}
                  onChange={handleClientModalInputChange}
                  className={styles.input}
                  placeholder="Ingrese el nombre completo"
                />
                {clientModalErrors.fullName && (
                  <span style={{ color: "red", fontSize: "0.85rem" }}>
                    {clientModalErrors.fullName}
                  </span>
                )}
              </div>
            )}
        </div>

        {/* Teléfono */}
        <Input
          label="Teléfono"
          name="phoneNumber"
          value={clientModalData.phoneNumber}
          onChange={handleClientModalInputChange}
          placeholder="Ingrese el teléfono"
          maxLength={15}
        />

        {/* Botones */}
        <div className={styles.modalActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setIsClientModalOpen(false);
              setClientModalData({
                documentType: "DNI",
                documentNumber: "",
                fullName: "",
                companyName: "",
                phoneNumber: "",
              });
              setClientModalErrors({});
            }}
          >
            Cancelar
          </Button>
          <div className={styles.modalFooter}>
            <Button onClick={handleSaveClient} variant="primary">
              Guardar Cliente
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Selección de Lotes */}
      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => {
          setIsBatchModalOpen(false);
          setSelectedItemForBatch(null);
        }}
        title={
          <div className={styles.modalTitleContainer}>
            <span>Seleccionar Lote: {selectedItemForBatch?.name}</span>
            {selectedItemForBatch?.imageUrl && (
              <img
                src={selectedItemForBatch.imageUrl}
                alt={selectedItemForBatch.name}
                className={styles.modalHeaderImage}
              />
            )}
          </div>
        }
        size="large"
      >
        <div className={styles.modalContent}>
          <div className={styles.modalTableContainer}>
            <table className={styles.batchesTable}>
              <thead>
                <tr>
                  <th>Fecha Compra</th>
                  <th>Stock</th>
                  <th>P. Compra</th>
                  <th>P. Venta</th>
                  <th>Lote #</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {selectedItemForBatch?.batches?.map((batch, idx) => (
                  <tr key={idx}>
                    <td>{new Date(batch.purchaseDate).toLocaleDateString()}</td>
                    <td>{batch.quantityAvailable}</td>
                    <td className={styles.tablePurchasePrice}>S/ {batch.purchaseUnitPrice.toFixed(2)}</td>
                    <td className={styles.tableSalePrice}>S/ {batch.saleUnitPrice.toFixed(2)}</td>
                    <td>{batch.batchNumber || idx + 1}</td>
                    <td>
                      <button
                        className={styles.selectBatchBtn}
                        onClick={() => handleSelectBatch(batch)}
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateSale;
