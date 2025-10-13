import { useState, useEffect, useCallback } from 'react';
import productApi from '@/api/productApi';

const useProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchProducts = useCallback(async (input) => {
    if (!input || input.trim().length < 2) {
      setFilteredProducts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await productApi.searchProducts(input.trim());
      
      // Mapear los datos del backend
      const mappedProducts = data.map(product => ({
        id: product.productId,
        name: product.productName,
        sku: product.sku,
        barcode: product.barcode
      }));
      
      setFilteredProducts(mappedProducts);
    } catch (err) {
      setError(err.message);
      setFilteredProducts([]);
      console.error('Error en búsqueda:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(searchTerm);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchProducts]);

  return {
    searchTerm,
    setSearchTerm,
    filteredProducts,
    loading,
    error
  };
};

export default useProductSearch;