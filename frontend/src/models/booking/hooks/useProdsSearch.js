import { useEffect, useState } from 'react';
import productService from '../services/productService';
import useFilters from './useFilters';

export default function useProdsSearch(initialFilters) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {
    filters,
    categories,
    countries,
    cities,
    hosts,
    priceBounds,
    filteredProducts,
    updateFilter,
    updateFilters
  } = useFilters(products, initialFilters);

  useEffect(() => {
    let active = true;

    productService.list()
      .then((catalog) => {
        if (active) setProducts(catalog);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    products: filteredProducts,
    filters,
    categories,
    countries,
    cities,
    hosts,
    priceBounds,
    updateFilter,
    updateFilters,
    loading,
    error
  };
}
