// src/api/supplierApi.js
import axiosConfig from '../config/axiosConfig';

const supplierApi = {
  
  // Crear proveedor
  create: (supplierData) => 
    axiosConfig.post('/suppliers', supplierData).then((res) => res.data),

  // Obtener todos los proveedores
  getAll: () => 
    axiosConfig.get('/suppliers').then((res) => res.data.data),

  // Obtener proveedor por ID
  getById: (id) => 
    axiosConfig.get(`/suppliers/${id}`).then((res) => res.data.data),

  // Actualizar proveedor
  update: (id, supplierData) => 
    axiosConfig.put(`/suppliers/${id}`, supplierData).then((res) => res.data),

  // Eliminar proveedor
  delete: (id) => 
    axiosConfig.delete(`/suppliers/${id}`).then((res) => res.data),

  // Buscar proveedores
  search: (searchTerm, pageNumber = 0, pageSize = 10) => 
    axiosConfig.get('/suppliers', {
      params: {
        input: searchTerm,
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    }).then((res) => res.data.data),

};

export default supplierApi;