import { useCallback, useMemo, useState } from 'react';

function getStartingPrice(product) {
  const prices = (product.variants || [])
    .filter((variant) => variant.isActive !== false && variant.status === 'available' && variant.stock > 0)
    .map((variant) => Number(variant.price))
    .filter(Number.isFinite);
  return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
}

export default function useFilters(products, initialFilters = {}) {
  const [filters, setFilters] = useState(() => ({
    search: '',
    category: '',
    location: '',
    host: '',
    priceMin: null,
    priceMax: null,
    sort: 'recommended',
    ...initialFilters
  }));

  const priceBounds = useMemo(() => {
    const prices = products
      .map(getStartingPrice)
      .filter(Number.isFinite);
    if (!prices.length) return { min: 0, max: 0 };
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  const categories = useMemo(() => {
    const names = products
      .map((product) => product.category_id?.name)
      .filter(Boolean);
    return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'es'));
  }, [products]);

  const locations = useMemo(() => {
    const names = products
      .map((product) => product.location_id?.name
        || [product.location_id?.city, product.location_id?.country].filter(Boolean).join(', '))
      .filter(Boolean);
    return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'es'));
  }, [products]);

  const hosts = useMemo(() => {
    const names = products
      .map((product) => product.host_id?.name)
      .filter(Boolean);
    return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'es'));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase('es');
    const results = products.filter((product) => {
      if (product.isActive === false || product.status !== 'published') return false;
      if (filters.category && product.category_id?.name !== filters.category) return false;
      const locationName = product.location_id?.name
        || [product.location_id?.city, product.location_id?.country].filter(Boolean).join(', ');
      if (filters.location && locationName !== filters.location) return false;
      const hostName = product.host_id?.name;
      if (filters.host && hostName !== filters.host) return false;
      const startingPrice = getStartingPrice(product);
      if (filters.priceMin !== null && startingPrice < filters.priceMin) return false;
      if (filters.priceMax !== null && startingPrice > filters.priceMax) return false;

      const searchableText = [
        product.title,
        product.description,
        product.category_id?.name,
        product.location_id?.name,
        product.location_id?.city,
        product.location_id?.country,
        product.host_id?.name,
        product.host_id?.bio
      ].filter(Boolean).join(' ').toLocaleLowerCase('es');
      return !query || searchableText.includes(query);
    });

    if (filters.sort === 'price-asc') {
      return results.sort((a, b) => getStartingPrice(a) - getStartingPrice(b));
    }
    if (filters.sort === 'price-desc') {
      return results.sort((a, b) => getStartingPrice(b) - getStartingPrice(a));
    }
    if (filters.sort === 'title') {
      return results.sort((a, b) => a.title.localeCompare(b.title, 'es'));
    }
    return results;
  }, [filters, products]);

  const updateFilter = useCallback((name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  }, []);

  const updateFilters = useCallback((nextFilters) => {
    setFilters((current) => {
      const hasChanges = Object.keys(nextFilters).some((key) => current[key] !== nextFilters[key]);
      return hasChanges ? { ...current, ...nextFilters } : current;
    });
  }, []);

  return { filters, categories, locations, hosts, priceBounds, filteredProducts, updateFilter, updateFilters };
}
