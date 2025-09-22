import axios from 'axios';

// Configuración base de Axios
const axiosConfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8585',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests (peticiones salientes)
axiosConfig.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses (respuestas entrantes)
axiosConfig.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(` Response: ${response.status} - ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Log de errores
    console.error(' Response Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;