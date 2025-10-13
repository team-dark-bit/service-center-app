import React, { useState } from "react";
import Swal from "sweetalert2";
import supplierApi from "@/api/supplierApi";
import styles from "./CreateSupplier.module.css";

const CreateSupplier = () => {
  const documentTypes = [
    { id: "DNI", name: "DNI", maxLength: 8 },
    { id: "RUC", name: "RUC", maxLength: 11 },
    { id: "CEX", name: "CEX", maxLength: 20 },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    documentType: "",
    documentNumber: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    active: true,
  });

  // Validar email
  const validateEmail = (email) => {
    if (email === "") return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.name.trim()) {
      Swal.fire("Error", "El nombre del proveedor es requerido", "error");
      return;
    }

    if (!formData.documentType) {
      Swal.fire("Error", "El tipo de documento es requerido", "error");
      return;
    }

    if (!formData.documentNumber.trim()) {
      Swal.fire("Error", "El número de documento es requerido", "error");
      return;
    }

    // Validar longitud del documento
    if (formData.documentType === "DNI" && formData.documentNumber.length !== 8) {
      Swal.fire("Error", "El DNI debe tener exactamente 8 dígitos", "error");
      return;
    }

    if (formData.documentType === "RUC" && formData.documentNumber.length !== 11) {
      Swal.fire("Error", "El RUC debe tener exactamente 11 dígitos", "error");
      return;
    }

    if (formData.documentType === "CEX" && formData.documentNumber.length > 20) {
      Swal.fire("Error", "El CEX no puede tener más de 20 dígitos", "error");
      return;
    }

    // Validar email si se ingresó
    if (formData.email && !validateEmail(formData.email)) {
      Swal.fire("Error", "El formato del email no es válido", "error");
      return;
    }

    setIsLoading(true);

    try {
      const supplierData = {
        name: formData.name.trim(),
        documentType: formData.documentType,
        documentNumber: formData.documentNumber.trim(),
        description: formData.description.trim() || null,
        address: formData.address.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        active: formData.active,
      };

      console.log("📦 Datos del proveedor a enviar:", supplierData);

      // Enviar a la API
      await supplierApi.create(supplierData);

      // Mostrar éxito
      Swal.fire({
        title: "¡Éxito!",
        text: "Proveedor registrado correctamente",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        // navigate('/suppliers/list');
        resetForm();
      });
    } catch (error) {
      console.error("Error al registrar proveedor:", error);
      const errorMessage =
        error.response?.data?.message || "Error al registrar proveedor";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      documentType: "",
      documentNumber: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      active: true,
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Se perderán todos los datos ingresados",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        resetForm();
        // navigate('/suppliers/list');
      }
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Validación para número de documento
    if (name === "documentNumber") {
      // Solo permitir números
      if (value && !/^\d*$/.test(value)) {
        return;
      }

      // Validar longitud según tipo de documento
      if (formData.documentType) {
        const selectedType = documentTypes.find((t) => t.id === formData.documentType);
        if (selectedType && value.length > selectedType.maxLength) {
          return;
        }
      }
    }

    // Validación para teléfono (solo números)
    if (name === "phone" && value && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Obtener el maxLength dinámicamente
  const getDocumentMaxLength = () => {
    if (!formData.documentType) return undefined;
    const selectedType = documentTypes.find((t) => t.id === formData.documentType);
    return selectedType ? selectedType.maxLength : undefined;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Crear Proveedor</h1>
        <p className={styles.subtitle}>
          Complete la información del nuevo proveedor
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Información Básica */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información Básica</h3>

            {/* Nombre - Full width */}
            <div className={styles.formRowFull}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nombre <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ingrese el nombre del proveedor"
                  required
                />
              </div>
            </div>

            {/* Tipo Documento y Número - Same row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tipo Documento <span className={styles.required}>*</span>
                </label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
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

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Número de Documento <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder={
                    formData.documentType === "DNI"
                      ? "8 dígitos"
                      : formData.documentType === "RUC"
                      ? "11 dígitos"
                      : formData.documentType === "CEX"
                      ? "Máx. 20 dígitos"
                      : "Seleccione tipo primero"
                  }
                  maxLength={getDocumentMaxLength()}
                  disabled={!formData.documentType}
                  required
                />
              </div>
            </div>

            {/* Teléfono y Email - Same row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ingrese el teléfono"
                  maxLength={15}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            {/* Dirección - Full width */}
            <div className={styles.formRowFull}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ingrese la dirección"
                />
              </div>
            </div>

            {/* Descripción - Full width */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Descripción del proveedor (opcional)"
                  rows="3"
                />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Proveedor activo</span>
              </label>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.buttonSpinner}></span>
                Guardando...
              </>
            ) : (
              "Guardar Proveedor"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSupplier;