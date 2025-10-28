import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import customerApi from "@/api/customerApi";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import styles from "./CreateCustomer.module.css";

const CreateCustomer = () => {
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
    fullName: "",
    companyName: "",
    documentType: "",
    documentNumber: "",
    phoneNumber: "",
    active: true,
  });

  useEffect(() => {
    if (isEditMode) {
      loadCustomerData();
    }
  }, [id]);

  const loadCustomerData = async () => {
    try {
      setIsLoading(true);
      const data = await customerApi.getById(id);
      setFormData({
        fullName: data.fullName || "",
        companyName: data.companyName || "",
        documentType: data.documentType || "",
        documentNumber: data.documentNumber || "",
        phoneNumber: data.phoneNumber || "",
        active: data.active ?? true,
      });
    } catch (error) {
      console.error("Error loading customer:", error);
      Swal.fire("Error", "No se pudo cargar el cliente", "error");
      navigate("/customers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar según tipo de documento
    if (formData.documentType === "RUC") {
      if (!formData.companyName.trim()) {
        Swal.fire("Error", "La razón social es requerida para RUC", "error");
        return;
      }
    } else if (
      formData.documentType === "DNI" ||
      formData.documentType === "CEX"
    ) {
      if (!formData.fullName.trim()) {
        Swal.fire("Error", "El nombre completo es requerido", "error");
        return;
      }
    }

    if (!formData.documentType) {
      Swal.fire("Error", "El tipo de documento es requerido", "error");
      return;
    }

    if (!formData.documentNumber.trim()) {
      Swal.fire("Error", "El número de documento es requerido", "error");
      return;
    }

    if (
      formData.documentType === "DNI" &&
      formData.documentNumber.length !== 8
    ) {
      Swal.fire("Error", "El DNI debe tener exactamente 8 dígitos", "error");
      return;
    }

    if (
      formData.documentType === "RUC" &&
      formData.documentNumber.length !== 11
    ) {
      Swal.fire("Error", "El RUC debe tener exactamente 11 dígitos", "error");
      return;
    }

    if (
      formData.documentType === "CEX" &&
      formData.documentNumber.length > 20
    ) {
      Swal.fire("Error", "El CEX no puede tener más de 20 dígitos", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos según el tipo de documento
      const customerData = {
        documentType: formData.documentType,
        documentNumber: formData.documentNumber.trim(),
        phoneNumber: formData.phoneNumber.trim() || null,
        active: formData.active,
      };

      if (formData.documentType === "RUC") {
        customerData.companyName = formData.companyName.trim();
        customerData.fullName = "";
      } else {
        customerData.fullName = formData.fullName.trim();
        customerData.companyName = "";
      }

      console.log("📦 Datos del cliente a enviar:", customerData);

      if (isEditMode) {
        await customerApi.update(id, customerData);
      } else {
        await customerApi.create(customerData);
      }

      Swal.fire({
        title: "¡Éxito!",
        text: isEditMode
          ? "Cliente actualizado correctamente"
          : "Cliente registrado correctamente",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        navigate("/customers");
      });
    } catch (error) {
      console.error("Error al registrar/actualizar cliente:", error);
      const errorMessage =
        error.response?.data?.message ||
        (isEditMode
          ? "Error al actualizar cliente"
          : "Error al registrar cliente");
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
        navigate("/customers");
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
        const selectedType = documentTypes.find(
          (t) => t.id === formData.documentType
        );
        if (selectedType && value.length > selectedType.maxLength) {
          return;
        }
      }
    }

    if (name === "phoneNumber" && value && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getDocumentMaxLength = () => {
    if (!formData.documentType) return undefined;
    const selectedType = documentTypes.find(
      (t) => t.id === formData.documentType
    );
    return selectedType ? selectedType.maxLength : undefined;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isEditMode ? "Editar Cliente" : "Crear Cliente"}
        </h1>
        <p className={styles.subtitle}>
          {isEditMode
            ? "Modifique la información del cliente"
            : "Complete la información del nuevo cliente"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información Básica</h3>

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

            {/* Campo condicional: Razón Social (solo para RUC) */}
            {formData.documentType === "RUC" && (
              <div className={styles.formRowFull}>
                <Input
                  label="Razón Social"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Ingrese la razón social"
                  required
                />
              </div>
            )}

            {/* Campo condicional: Nombre Completo (solo para DNI y CEX) */}
            {(formData.documentType === "DNI" ||
              formData.documentType === "CEX") && (
              <div className={styles.formRowFull}>
                <Input
                  label="Nombre Completo"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre completo"
                  required
                />
              </div>
            )}

            {/* Teléfono */}
            <div className={styles.formRow}>
              <Input
                label="Teléfono"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Ingrese el teléfono"
                maxLength={9}
              />
              {/* Estado - Checkbox */}
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Cliente activo</span>
                </label>
              </div>
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

          <Button type="submit" variant="primary" loading={isLoading}>
            {isEditMode ? "Actualizar Cliente" : "Guardar Cliente"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;
