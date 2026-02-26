import axiosConfig from '../config/axiosConfig';

const salesApi = {
    // Crear una nueva venta
    create: (saleData) => axiosConfig.post('/sales', saleData),

    // Obtener todas las ventas
    getAll: (params = {}) => axiosConfig.get('/sales', { params }),

    // Obtener una venta por ID
    getById: (id) => axiosConfig.get(`/sales/${id}`),
};

export default salesApi;
