import { useCallback, useMemo, useState } from 'react';

function getStartingPrice(product) {
  const prices = (product.variants || [])
    .filter((variant) => variant.isActive !== false && variant.status === 'available' && variant.stock > 0)
    .map((variant) => Number(variant.price))
    .filter(Number.isFinite);
  return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
}

export default function useFilters(products) {
  const [filters, setFilters] = useState({ search: '', category: '', sort: 'recommended' });

  const categories = useMemo(() => {
    const names = products
      .map((product) => product.category_id?.name)
      .filter(Boolean);
    return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'es'));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase('es');
    const results = products.filter((product) => {
      if (product.isActive === false || product.status !== 'published') return false;
      if (filters.category && product.category_id?.name !== filters.category) return false;

      const searchableText = [
        product.title,
        product.description,
        product.category_id?.name,
        product.location_id?.name,
        product.location_id?.city,
        product.location_id?.country
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

  return { filters, categories, filteredProducts, updateFilter };
}
