import React, { useState, useEffect } from "react";
import { storage } from "@/firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import productApi from "@/api/productApi";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import SearchSelect from "@/components/common/SearchSelect";
import styles from "./CreateProduct.module.css";
import { getTodayDate } from "@/utils/date-utils";
import { useDateTimePicker } from "@/hooks/useDateTimePicker";

const CreateProduct = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    brandId: "",
    subcategoryId: "",
    serviceCenterId: "f80ac9d5-a6d3-4e45-b800-6eb102abba86",
    name: "",
    displayName: "",
    description: "",
    activeFrom: getTodayDate(),
    status: true,
    categoryId: "",
    packages: [
      {
        sku: "",
        barcode: "",
        unitId: "",
        packageId: "",
        imageUrl: "",
        activeFrom: getTodayDate(),
        status: true,
        quantity: 1,
        imageFile: null,
        imagePreviewUrl: null,
      },
    ],
  });

  const { dateInput, handleDateChange, fullDate } = useDateTimePicker(
    new Date()
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [brandsData, categoriesData, packagesData, unitsData] =
          await Promise.all([
            productApi.getBrands(),
            productApi.getCategories(),
            productApi.getPackages(),
            productApi.getUnits(),
          ]);

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

  const handlePackageChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedPackages = [...prev.packages];
      updatedPackages[index][field] = value;
      return { ...prev, packages: updatedPackages };
    });
  };

  const handlePackageImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedPackages = [...formData.packages];
      updatedPackages[index].imageFile = file;
      updatedPackages[index].imagePreviewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        packages: updatedPackages,
      }));
    }
  };

  const addPackage = () => {
    setFormData((prev) => ({
      ...prev,
      packages: [
        ...prev.packages,
        {
          sku: "",
          barcode: "",
          unitId: "",
          packageId: "",
          imageUrl: "",
          activeFrom: getTodayDate(),
          status: true,
          quantity: 1,
          imageFile: null,
          imagePreviewUrl: null,
        },
      ],
    }));
  };

  const removePackage = (index) => {
    if (formData.packages.length === 1) {
      Swal.fire("Advertencia", "Debe haber al menos un paquete", "warning");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index),
    }));
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
      const updatedPackages = [...formData.packages];
      for (let i = 0; i < updatedPackages.length; i++) {
        if (updatedPackages[i].imageFile) {
          const storageRef = ref(
            storage,
            `imagenes_productos/${updatedPackages[i].imageFile.name}`
          );
          await uploadBytes(storageRef, updatedPackages[i].imageFile);
          const imageUrl = await getDownloadURL(storageRef);
          updatedPackages[i].imageUrl = imageUrl;
          console.log(
            `URL de descarga de la imagen para paquete ${i + 1}:`,
            imageUrl
          );
        }
      }

      const productData = {
        ...formData,
        activeFrom: fullDate.toISOString(),
        packages: updatedPackages.map((pkg) => {
          const selectedPackage = packages.find((p) => p.id === pkg.packageId);
          const packageCode = selectedPackage ? selectedPackage.code : "";

          const selectedUnit = units.find((u) => u.id === pkg.unitId);
          const unitCode = selectedUnit ? selectedUnit.code : "";

          const codedName = `${packageCode}${pkg.quantity}${unitCode}`;

          return {
            ...pkg,
            codedName: codedName,
            activeFrom: new Date(pkg.activeFrom).toISOString(),
            quantity: parseInt(pkg.quantity) || 1,
            imageFile: undefined,
            imagePreviewUrl: undefined,
          };
        }),
      };

      console.log("📦 Datos del producto a enviar:", productData);

      await productApi.create(productData);

      Swal.fire({
        title: "¡Éxito!",
        text: "Producto registrado correctamente",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        // navigate('/products/list');
      });

      setFormData({
        brandId: "",
        subcategoryId: "",
        serviceCenterId: "f80ac9d5-a6d3-4e45-b800-6eb102abba86",
        name: "",
        displayName: "",
        description: "",
        activeFrom: getTodayDate(),
        status: true,
        categoryId: "",
        packages: [
          {
            sku: "",
            barcode: "",
            unitId: "",
            packageId: "",
            imageUrl: "",
            activeFrom: getTodayDate(),
            status: true,
            quantity: 1,
            imageFile: null,
            imagePreviewUrl: null,
          },
        ],
      });
    } catch (error) {
      console.error("Error al registrar producto:", error);
      Swal.fire("Error", "Error al registrar producto", "error");
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
              <Input
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ingrese el nombre del producto"
                required
              />

              <Input
                label="Alias"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Nombre alternativo del producto"
              />
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
              <SearchSelect
                label="Marca"
                name="brandId"
                options={brands}
                value={formData.brandId}
                onChange={handleChange}
                placeholder="Buscar marca..."
              />
            </div>

            <div className={styles.formRow}>
              <SearchSelect
                label="Categoría"
                name="categoryId"
                options={categories}
                value={formData.categoryId}
                onChange={handleChange}
                placeholder="Buscar categoría..."
              />

              <div className={styles.formGroup}>
                <label className={styles.label}>Subcategoría</label>
                <select
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={!formData.categoryId}
                >
                  <option value="">-- Seleccionar --</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Paquetes */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Paquetes</h3>

            {formData.packages.map((pkg, index) => (
              <div key={index} className={styles.packageSection}>
                <h4 className={styles.sectionTitle}>Paquete {index + 1}</h4>

                <div className={styles.formRow}>
                  <Input
                    label="SKU"
                    value={pkg.sku}
                    onChange={(e) =>
                      handlePackageChange(index, "sku", e.target.value)
                    }
                    placeholder="Código SKU del paquete"
                  />

                  <Input
                    label="Código de Barras"
                    value={pkg.barcode}
                    onChange={(e) =>
                      handlePackageChange(index, "barcode", e.target.value)
                    }
                    placeholder="Código de barras del paquete"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Presentación</label>
                    <select
                      value={pkg.packageId}
                      onChange={(e) =>
                        handlePackageChange(index, "packageId", e.target.value)
                      }
                      className={styles.select}
                    >
                      <option value="">-- Seleccionar --</option>
                      {packages.map((packageItem) => (
                        <option key={packageItem.id} value={packageItem.id}>
                          {packageItem.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Valor"
                    type="number"
                    value={pkg.quantity}
                    onChange={(e) =>
                      handlePackageChange(index, "quantity", e.target.value)
                    }
                    placeholder="Valor"
                  />

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Unidad de Medida</label>
                    <select
                      value={pkg.unitId}
                      onChange={(e) =>
                        handlePackageChange(index, "unitId", e.target.value)
                      }
                      className={styles.select}
                    >
                      <option value="">-- Seleccionar --</option>
                      {units.map((unitItem) => (
                        <option key={unitItem.id} value={unitItem.id}>
                          {unitItem.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={pkg.status}
                          onChange={(e) =>
                            handlePackageChange(
                              index,
                              "status",
                              e.target.checked
                            )
                          }
                          className={styles.checkbox}
                        />
                        <span className={styles.checkboxText}>
                          Paquete Activo
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Imagen por paquete */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Imagen del Paquete</label>
                  <input
                    type="file"
                    onChange={(e) => handlePackageImageChange(index, e)}
                  />
                  {pkg.imagePreviewUrl && (
                    <div className={styles.imagePreview}>
                      <img
                        src={pkg.imagePreviewUrl}
                        alt="Vista previa del paquete"
                        className={styles.previewImage}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    
                  </div>

                  <div className={styles.formGroup}>
                    <button
                      type="button"
                      onClick={() => removePackage(index)}
                      className={styles.cancelButton}
                      style={{ maxWidth: "fit-content" }}
                    >
                      Eliminar Paquete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={addPackage}
              variant="primary"
              size="medium"
            >
              + Agregar Paquete
            </Button>
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
                  value={dateInput}
                  onChange={handleDateChange}
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
            Guardar Producto
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
