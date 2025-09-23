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
  //getCategories: () => axiosConfig.get('/categories'),

  // Obtener subcategorías por categoría
  getSubcategories: (categoryId) => axiosConfig.get(`/categories/${categoryId}/subcategories`)
};

export default productApi;

