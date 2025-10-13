import axiosConfig from '../config/axiosConfig';

const productApi = {
  // Crear producto
  create: (productData) => axiosConfig.post('/products', productData),

  // Obtener todos los productos
  getAll: (params = {}) => axiosConfig.get('/products', { params }),

  // Obtener producto por ID
  getById: (id) => axiosConfig.get(`/products/${id}`),

  // Actualizar producto
  update: (id, productData) => axiosConfig.put(`/products/${id}`, productData),

  // Eliminar producto
  delete: (id) => axiosConfig.delete(`/products/${id}`),

  // Obtener marcas (para los selects)
  getBrands: () => axiosConfig.get('/brands').then((res) => res.data.data),

  // Obtener categorías (para los selects)
  getCategories: () => axiosConfig.get('/categories').then((res) => res.data.data),

  // Obtener subcategorías por categoría
  getSubcategories: (categoryId) => axiosConfig.get(`/categories/${categoryId}/subcategories`).then((res) => res.data.data),

  // Obtener Packages (para los selects)
  getPackages: () => axiosConfig.get('/packages').then((res) => res.data.data),

  // Obtener Units (para los selects)
  getUnits: () => axiosConfig.get('/units').then((res) => res.data.data),


  //nuevos endpoints
   // Obtener Units (para los selects)
  purchaseApi: () => axiosConfig.get('/units').then((res) => res.data.data),

   // Obtener Units (para los selects)
  productApi: () => axiosConfig.get('/units').then((res) => res.data.data),

  searchProducts: (searchTerm, pageNumber = 0, pageSize = 10) => 
    axiosConfig.get('/products', {
      params: {
        input: searchTerm,
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    }).then((res) => res.data.data),

};

export default productApi;

