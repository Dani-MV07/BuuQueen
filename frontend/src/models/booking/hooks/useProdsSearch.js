import { useEffect, useState } from 'react';
import productService from '../services/productService';
import useFilters from './useFilters';

export default function useProdsSearch() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { filters, categories, locations, hosts, priceBounds, filteredProducts, updateFilter } = useFilters(products);

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

  return { products: filteredProducts, filters, categories, locations, hosts, priceBounds, updateFilter, loading, error };
}
