// src/api/purchaseApi.js
import axiosConfig from '../config/axiosConfig';

const purchaseApi = {

  // Crear compra
  create: (purchaseData) =>
    axiosConfig.post('/purchases', purchaseData).then((res) => res.data),

  // Obtener todas las compras
  getAll: () =>
    axiosConfig.get('/purchases').then((res) => res.data.data),

  // Obtener compra por ID
  getById: (id) =>
    axiosConfig.get(`/purchases/${id}`).then((res) => res.data.data),

  // Actualizar compra
  update: (id, purchaseData) =>
    axiosConfig.put(`/purchases/${id}`, purchaseData).then((res) => res.data),

  // Eliminar compra
  delete: (id) =>
    axiosConfig.delete(`/purchases/${id}`).then((res) => res.data),

  // Buscar compras
  search: (searchTerm, pageNumber = 0, pageSize = 10) =>
    axiosConfig.get('/purchases', {
      params: {
        input: searchTerm,
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    }).then((res) => res.data.data),

};

export default purchaseApi;
