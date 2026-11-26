import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';
import Select from '../components/Select';
import useProdsSearch from '../hooks/useProdsSearch';

const PAGE_SIZE = 6;

function getFiltersFromSearchParams(searchParams) {
  const getPrice = (key) => {
    const value = searchParams.get(key);
    if (value === null || value.trim() === '') return null;
    const price = Number(value);
    return Number.isFinite(price) ? price : null;
  };

  return {
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    host: searchParams.get('host') || '',
    priceMin: getPrice('priceMin'),
    priceMax: getPrice('priceMax'),
    sort: searchParams.get('sort') || 'recommended'
  };
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialFilters] = useState(() => getFiltersFromSearchParams(searchParams));
  const {
    products,
    filters,
    categories,
    locations,
    hosts,
    priceBounds,
    updateFilter,
    updateFilters,
    loading,
    error
  } = useProdsSearch(initialFilters);
  const [page, setPage] = useState(1);
  const syncingFromUrl = useRef(false);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.category, filters.location, filters.host, filters.priceMin, filters.priceMax, filters.sort]);

  useEffect(() => {
    syncingFromUrl.current = true;
    updateFilters(getFiltersFromSearchParams(searchParams));
  }, [searchParams, updateFilters]);

  useEffect(() => {
    if (syncingFromUrl.current) {
      syncingFromUrl.current = false;
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    ['q', 'category', 'location', 'host', 'priceMin', 'priceMax', 'sort']
      .forEach((key) => nextParams.delete(key));

    const filtersToParams = [
      ['q', filters.search],
      ['category', filters.category],
      ['location', filters.location],
      ['host', filters.host],
      ['priceMin', filters.priceMin],
      ['priceMax', filters.priceMax],
      ['sort', filters.sort === 'recommended' ? '' : filters.sort]
    ];
    filtersToParams.forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        nextParams.set(key, String(value));
      }
    });

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visibleProducts = useMemo(
    () => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page, products]
  );
  const activeFiltersCount = [
    filters.search,
    filters.category,
    filters.location,
    filters.host,
    filters.priceMin !== null,
    filters.priceMax !== null,
    filters.sort !== 'recommended'
  ].filter(Boolean).length;

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
            <div className="booking-filter-title">
              <span>PERSONALIZA TU ESTANCIA</span>
              <h2>Filtros</h2>
            </div>
            {activeFiltersCount > 0 && (
              <span className="booking-filter-count" aria-label={`${activeFiltersCount} filtros activos`}>
                {activeFiltersCount}
              </span>
            )}
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
            <span className="visually-hidden">Buscar destino o alojamiento</span>
            <input
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Destino, alojamiento..."
            />
            <svg className="booking-filter-search-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.5 4.5" />
            </svg>
          </label>
          <fieldset className="booking-price-filter">
            <legend>Precio por noche</legend>
            <div className="booking-price-values">
              <span><small>Desde</small><strong>{filters.priceMin ?? priceBounds.min} €</strong></span>
              <span><small>Hasta</small><strong>{filters.priceMax ?? priceBounds.max} €</strong></span>
            </div>
            <div className="booking-price-range">
              <div className="booking-price-rail" aria-hidden="true">
                <span
                  style={{
                    left: `${priceBounds.max > priceBounds.min
                      ? ((filters.priceMin ?? priceBounds.min) - priceBounds.min) / (priceBounds.max - priceBounds.min) * 100
                      : 0}%`,
                    right: `${priceBounds.max > priceBounds.min
                      ? 100 - ((filters.priceMax ?? priceBounds.max) - priceBounds.min) / (priceBounds.max - priceBounds.min) * 100
                      : 0}%`
                  }}
                />
              </div>
              <input
                className="booking-price-slider-min"
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
                className="booking-price-slider-max"
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
            <summary>
              <span>Categoría</span>
              <small>{filters.category || 'Todas'}</small>
            </summary>
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
          <details className="booking-filter-section">
            <summary>
              <span>Ubicación</span>
              <small>{filters.location || 'Todas'}</small>
            </summary>
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
          <details className="booking-filter-section">
            <summary>
              <span>Anfitrión</span>
              <small>{filters.host || 'Todos'}</small>
            </summary>
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
          <div className="booking-sort-section">
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
