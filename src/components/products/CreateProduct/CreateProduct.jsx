import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';
import productApi from '../../../api/productApi';
import styles from './CreateProduct.module.css';

const CreateProduct = () => {

  const [brands, setBrands] = useState([]);
  //const [categories, setCategories] = useState([]);
  //const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    description: '',
    brandId: '',
    categoryId: '',
    subcategoryId: '',
    sku: '',
    barcode: '',
    activationDate: '',
    isActive: true
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try { 
        const brands = await productApi.getBrands();
        setBrands(brands);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setBrands([]);
      } 
    };

    fetchBrands();
  }, []);

  const categories = [
    { id: 1, name: 'DISCOS' },
    { id: 2, name: 'LUBRICANTES' },
    { id: 3, name: 'FILTROS' },
    { id: 4, name: 'OTROS' },
  ];

  // Subcategorías que cambian según la categoría seleccionada
  const getSubcategories = (categoryId) => {
    const subcategoriesMap = {
      1: [ // DISCOS
        { id: 1, name: 'FRENO DE DISCO XR' },
        { id: 2, name: 'FRENO DE DISCO PULSAR' },
      ],
      2: [ // LUBRICANTES
        { id: 3, name: 'ACEITE MOTOR 20W50' },
        { id: 4, name: 'ACEITE MOTOR 15W40' },
      ],
      3: [ // FILTROS
        { id: 5, name: 'FILTRO DE AIRE' },
        { id: 6, name: 'FILTRO DE ACEITE' },
      ],
      4: [ // OTROS
        { id: 7, name: 'ACCESORIOS VARIOS' },
      ]
    };
    return subcategoriesMap[categoryId] || [];
  };

  const subcategories = getSubcategories(parseInt(formData.categoryId));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Resetear subcategoría cuando cambie la categoría
      ...(name === 'categoryId' ? { subcategoryId: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.name.trim()) {
      Swal.fire('Error', 'El nombre del producto es requerido', 'error');
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('📦 Datos del producto a enviar:', formData);
      
      // TODO: Descomenta esto cuando el backend esté listo
      // await productApi.create(formData);
      
      // Por ahora simulamos una petición exitosa
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular loading
      
      Swal.fire({
        title: '¡Éxito!',
        text: 'Producto registrado correctamente',
        icon: 'success',
        confirmButtonText: 'Continuar'
      }).then(() => {
        // navigate('/products/list'); // Cuando tengas la ruta lista
      });

      // Reset form
      setFormData({
        name: '',
        alias: '',
        description: '',
        brandId: '',
        categoryId: '',
        subcategoryId: '',
        sku: '',
        barcode: '',
        activationDate: '',
        isActive: true
      });

    } catch (error) {
      console.error('Error creating product:', error);
      Swal.fire('Error', 'Error al registrar producto', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Se perderán todos los datos ingresados',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        // navigate('/products/list'); // Cuando tengas la ruta
        console.log('Formulario cancelado');
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Crear Producto</h1>
        <p className={styles.subtitle}>Complete la información del nuevo producto</p>
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
                  name="alias"
                  value={formData.alias}
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
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Categoría</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
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
                  {subcategories.map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
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
                  name="activationDate"
                  value={formData.activationDate}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
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
              'Guardar Producto'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;