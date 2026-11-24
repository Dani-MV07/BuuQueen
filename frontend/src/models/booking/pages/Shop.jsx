import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';
import Select from '../components/Select';
import useProdsSearch from '../hooks/useProdsSearch';

const PAGE_SIZE = 6;

export default function Shop() {
  const [searchParams] = useSearchParams();
  const { products, filters, categories, updateFilter, loading, error } = useProdsSearch();
  const [page, setPage] = useState(1);
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    updateFilter('search', searchQuery);
    setPage(1);
  }, [searchQuery, updateFilter]);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.category, filters.sort]);

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visibleProducts = useMemo(
    () => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page, products]
  );

  return (
    <section className="booking-page">
      <header className="booking-page-heading">
        <p className="eyebrow">DESCUBRE TU PRÓXIMA ESTANCIA</p>
        <h1>Explora alojamientos</h1>
        <p>Filtra el catálogo y encuentra el lugar perfecto para tu viaje.</p>
      </header>

      <div className="booking-toolbar">
        <label className="booking-inline-search">
          <span className="visually-hidden">Buscar en alojamientos</span>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Buscar destino o alojamiento"
          />
        </label>
        <Select
          name="booking-category"
          label="Categoría"
          value={filters.category}
          onChange={(value) => updateFilter('category', value)}
          options={[
            { value: '', label: 'Todas las categorías' },
            ...categories.map((category) => ({ value: category, label: category }))
          ]}
        />
        <Select
          name="booking-sort"
          label="Ordenar por"
          value={filters.sort}
          onChange={(value) => updateFilter('sort', value)}
          options={[
            { value: 'recommended', label: 'Recomendados' },
            { value: 'price-asc', label: 'Precio: menor a mayor' },
            { value: 'price-desc', label: 'Precio: mayor a menor' },
            { value: 'title', label: 'Nombre' }
          ]}
        />
      </div>

      {error && <ErrorState message={error} />}
      {loading ? <Skeleton rows={4} /> : error ? null : products.length === 0 ? (
        <p className="booking-empty">No encontramos alojamientos con esos filtros. Prueba otra búsqueda.</p>
      ) : (
        <>
          <p className="booking-results-count">{products.length} {products.length === 1 ? 'alojamiento' : 'alojamientos'}</p>
          <div className="booking-product-grid">
            {visibleProducts.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </section>
  );
}
