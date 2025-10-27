// src/api/customerApi.js
import axiosConfig from '../config/axiosConfig';

const customerApi = {
  
  // Crear cliente
  create: (customerData) => 
    axiosConfig.post('/customers', customerData).then((res) => res.data),

  // Obtener todos los clientees
  getAll: () => 
    axiosConfig.get('/customers').then((res) => res.data.data),

  // Obtener cliente por ID
  getById: (id) => 
    axiosConfig.get(`/customers/${id}`).then((res) => res.data.data),

  // Actualizar cliente
  update: (id, customerData) => 
    axiosConfig.put(`/customers/${id}`, customerData).then((res) => res.data),

  // Eliminar cliente
  delete: (id) => 
    axiosConfig.delete(`/customers/${id}`).then((res) => res.data),

  // Buscar clientees
  search: (searchTerm, pageNumber = 0, pageSize = 10) => 
    axiosConfig.get('/customers', {
      params: {
        input: searchTerm,
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    }).then((res) => res.data.data),

};

export default customerApi;