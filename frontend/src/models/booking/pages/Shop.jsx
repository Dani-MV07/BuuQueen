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
  const { products, filters, categories, locations, hosts, priceBounds, updateFilter, loading, error } = useProdsSearch();
  const [page, setPage] = useState(1);
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    updateFilter('search', searchQuery);
    setPage(1);
  }, [searchQuery, updateFilter]);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.category, filters.location, filters.host, filters.priceMin, filters.priceMax, filters.sort]);

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

      <div className="booking-shop-layout">
        <aside className="booking-toolbar" aria-label="Filtros de alojamientos">
          <div className="booking-filter-heading">
            <h2>Búsqueda de filtros</h2>
            <button
              type="button"
              className="booking-filter-reset"
              onClick={() => {
                updateFilter('search', '');
                updateFilter('category', '');
                updateFilter('location', '');
                updateFilter('host', '');
                updateFilter('priceMin', null);
                updateFilter('priceMax', null);
                updateFilter('sort', 'recommended');
              }}
            >
              Limpiar
            </button>
          </div>
          <label className="booking-inline-search">
            <span className="visually-hidden">Buscar filtros</span>
            <input
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Destino o alojamiento"
            />
          </label>
          <fieldset className="booking-price-filter">
            <legend>Precio</legend>
            <div className="booking-price-values">
              <span>{filters.priceMin ?? priceBounds.min} €</span>
              <span>{filters.priceMax ?? priceBounds.max} €</span>
            </div>
            <div className="booking-price-range">
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={filters.priceMin ?? priceBounds.min}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  const maximum = filters.priceMax ?? priceBounds.max;
                  updateFilter('priceMin', Math.min(value, maximum));
                }}
                aria-label="Precio mínimo"
              />
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={filters.priceMax ?? priceBounds.max}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  const minimum = filters.priceMin ?? priceBounds.min;
                  updateFilter('priceMax', Math.max(value, minimum));
                }}
                aria-label="Precio máximo"
              />
            </div>
          </fieldset>
          <details className="booking-filter-section" open>
            <summary>Categoría</summary>
            <Select
              name="booking-category"
              label="Seleccionar categoría"
              value={filters.category}
              onChange={(value) => updateFilter('category', value)}
              options={[
                { value: '', label: 'Todas las categorías' },
                ...categories.map((category) => ({ value: category, label: category }))
              ]}
            />
          </details>
          <details className="booking-filter-section" open>
            <summary>Ubicación</summary>
            <Select
              name="booking-location"
              label="Seleccionar ubicación"
              value={filters.location}
              onChange={(value) => updateFilter('location', value)}
              options={[
                { value: '', label: 'Todas las ubicaciones' },
                ...locations.map((location) => ({ value: location, label: location }))
              ]}
            />
          </details>
          <details className="booking-filter-section" open>
            <summary>Anfitrión</summary>
            <Select
              name="booking-host"
              label="Seleccionar anfitrión"
              value={filters.host}
              onChange={(value) => updateFilter('host', value)}
              options={[
                { value: '', label: 'Todos los anfitriones' },
                ...hosts.map((host) => ({ value: host, label: host }))
              ]}
            />
          </details>
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
        </aside>

        <div className="booking-catalog">
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
        </div>
      </div>
    </section>
  );
}
