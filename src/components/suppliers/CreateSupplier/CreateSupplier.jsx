import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import supplierApi from "@/api/supplierApi";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import styles from "./CreateSupplier.module.css";

const CreateSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

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

  useEffect(() => {
    if (isEditMode) {
      loadSupplierData();
    }
  }, [id]);

  const loadSupplierData = async () => {
    try {
      setIsLoading(true);
      const data = await supplierApi.getById(id);
      setFormData({
        name: data.name || "",
        documentType: data.documentType || "",
        documentNumber: data.documentNumber || "",
        description: data.description || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        active: data.active ?? true,
      });
    } catch (error) {
      console.error("Error loading supplier:", error);
      Swal.fire("Error", "No se pudo cargar el proveedor", "error");
      navigate("/suppliers");
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    if (email === "") return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      if (isEditMode) {
        await supplierApi.update(id, supplierData);
      } else {
        await supplierApi.create(supplierData);
      }

      Swal.fire({
        title: "¡Éxito!",
        text: isEditMode
          ? "Proveedor actualizado correctamente"
          : "Proveedor registrado correctamente",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        navigate("/suppliers");
      });
    } catch (error) {
      console.error("Error al registrar/actualizar proveedor:", error);
      const errorMessage =
        error.response?.data?.message ||
        (isEditMode ? "Error al actualizar proveedor" : "Error al registrar proveedor");
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
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
        navigate("/suppliers");
      }
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "documentNumber") {
      if (value && !/^\d*$/.test(value)) {
        return;
      }

      if (formData.documentType) {
        const selectedType = documentTypes.find((t) => t.id === formData.documentType);
        if (selectedType && value.length > selectedType.maxLength) {
          return;
        }
      }
    }

    if (name === "phone" && value && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getDocumentMaxLength = () => {
    if (!formData.documentType) return undefined;
    const selectedType = documentTypes.find((t) => t.id === formData.documentType);
    return selectedType ? selectedType.maxLength : undefined;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isEditMode ? "Editar Proveedor" : "Crear Proveedor"}
        </h1>
        <p className={styles.subtitle}>
          {isEditMode
            ? "Modifique la información del proveedor"
            : "Complete la información del nuevo proveedor"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información Básica</h3>

            {/* Nombre - Full width */}
            <div className={styles.formRowFull}>
              <Input
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ingrese el nombre del proveedor"
                required
              />
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

              <Input
                label="Número de Documento"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
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

            {/* Teléfono y Email - Same row */}
            <div className={styles.formRow}>
              <Input
                label="Teléfono"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ingrese el teléfono"
                maxLength={15}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
              />
            </div>

            {/* Dirección - Full width */}
            <div className={styles.formRowFull}>
              <Input
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ingrese la dirección"
              />
            </div>

            {/* Descripción - Full width */}
            <div className={styles.formRowFull}>
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
          <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
            disabled={isLoading}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
          >
            {isEditMode ? "Actualizar Proveedor" : "Guardar Proveedor"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSupplier;