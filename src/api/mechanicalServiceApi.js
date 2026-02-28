import axiosConfig from '../config/axiosConfig';

const mechanicalServiceApi = {
    // Crear Servicio Mecanico
    create: (mechanicalServiceData) =>
        axiosConfig.post('/services', mechanicalServiceData).then((res) => res.data),

    // Obtener todos los servicio Mecanicos
    getAll: () =>
        axiosConfig.get('/services').then((res) => res.data.data),
};

export default mechanicalServiceApi;