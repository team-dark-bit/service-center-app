import React, { useState, useEffect } from "react";
import { storage } from "@/firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Swal from "sweetalert2";
import productApi from "@/api/productApi";
import styles from "./CreateProduct.module.css";
import { getTodayDate } from "@/utils/date-utils";
import { useDateTimePicker } from '@/hooks/useDateTimePicker';

const CreateProduct = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [units, setUnits] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    brandId: "",
    categoryId: "",
    subcategoryId: "",
    serviceCenterId: "",
    sku: "",
    barcode: "",
    unitId: "",
    packageId: "",
    imageUrl: "",
    activeFrom: getTodayDate(),
    status: true,
    quantity: 0,
  });

  const { 
    dateInput, 
    handleDateChange, 
    fullDate 
  } = useDateTimePicker(new Date());

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Ejecutar todas las peticiones en paralelo para mayor eficiencia
        const [brandsData, categoriesData, packagesData, unitsData] =
          await Promise.all([
            productApi.getBrands(),
            productApi.getCategories(),
            productApi.getPackages(),
            productApi.getUnits(), 
          ]);

        // Actualizar los estados con los datos recibidos
        setBrands(brandsData);
        setCategories(categoriesData);
        setPackages(packagesData); 
        setUnits(unitsData); 
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setBrands([]);
        setCategories([]);
        setPackages([]);
        setUnits([]);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!formData.categoryId) {
        setSubcategories([]);
        return;
      }
      try {
        const subs = await productApi.getSubcategories(formData.categoryId);
        setSubcategories(subs);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [formData.categoryId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // Create a local URL for the preview
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "categoryId" ? { subcategoryId: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Swal.fire("Error", "El nombre del producto es requerido", "error");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = "";

      // Step 1: Upload the image to Firebase Storage
      if (imageFile) {
        const storageRef = ref(storage, `imagenes_productos/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
        console.log("URL de descarga de la imagen:", imageUrl);
      }

      // Step 2: Prepare the final data object, including the image URL
      const productData = {
        ...formData,
        imageUrl: imageUrl, // Add the image URL to the data
        activeFrom: fullDate.toISOString(),
      };

      console.log("📦 Datos del producto a enviar:", productData);

      // Step 3: Send the full data to your backend API
      await productApi.create(productData);

      // Show success message
      Swal.fire({
        title: "¡Éxito!",
        text: "Producto registrado correctamente",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        // navigate('/products/list');
      });

      // Step 4: Reset the form and image states
      setFormData({
        name: "",
        alias: "",
        description: "",
        brandId: "",
        categoryId: "",
        subcategoryId: "",
        sku: "",
        barcode: "",
        activeFrom: "",
        status: true,
      });
      setImageFile(null); // Reset image file state
      setImagePreviewUrl(null); // Clear the image preview
    } catch (error) {
      console.error("Error al registrar producto:", error);
      Swal.fire("Error", "Error al registrar producto", "error");
    } finally {
      setIsLoading(false); // Stop the loading state
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
        // navigate('/products/list'); // Cuando tengas la ruta
        console.log("Formulario cancelado");
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Crear Producto</h1>
        <p className={styles.subtitle}>
          Complete la información del nuevo producto
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Información Básica */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información Básica</h3>

            <div className={styles.formRow}>
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
                  placeholder="Ingrese el nombre del producto"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Alias</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Nombre alternativo del producto"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Descripción detallada del producto"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Clasificación */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Clasificación</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Marca</label>
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Seleccione una marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Unidad de Medida</label>
                <select
                  name="unitId"
                  value={formData.unitId}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Seleccione unidad de medida</option>
                  {units.map((unitItem) => (
                    <option key={unitItem.id} value={unitItem.id}>
                      {unitItem.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Categoría</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Subcategoría</label>
                <select
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={!formData.categoryId}
                >
                  <option value="">Seleccione una subcategoría</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Paquete</label>
                <select
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Seleccione un paquete</option>
                  {packages.map((packageItem) => (
                    <option key={packageItem.id} value={packageItem.id}>
                      {packageItem.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Códigos e Identificación */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Códigos e Identificación</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Código SKU del producto"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Código de Barras</label>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Código de barras del producto"
                />
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Configuración</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fecha de Activación</label>
                <input
                  type="date"
                  name="activeFrom"
                  value={dateInput} // Usa el valor del hook
                  onChange={handleDateChange} // Usa el manejador del hook
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>Producto Activo</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Opcion para subir imagen */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Imagen del Producto</label>
            <input type="file" onChange={handleFileChange} />
            {imagePreviewUrl && (
              <div className={styles.imagePreview}>
                <img
                  src={imagePreviewUrl}
                  alt="Vista previa del producto"
                  className={styles.previewImage}
                />
              </div>
            )}
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
              "Guardar Producto"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
