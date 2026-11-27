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
  const legacyLocation = searchParams.get('location') || '';
  const [legacyCity, ...legacyCountry] = legacyLocation.split(',').map((part) => part.trim());

  return {
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    country: searchParams.get('country') || legacyCountry.join(', '),
    city: searchParams.get('city') || legacyCity || '',
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
    countries,
    cities,
    hosts,
    priceBounds,
    updateFilter,
    updateFilters,
    loading,
    error
  } = useProdsSearch(initialFilters);
  const [page, setPage] = useState(1);
  const [priceInputs, setPriceInputs] = useState({ min: '', max: '' });
  const syncingFromUrl = useRef(false);

  useEffect(() => {
    setPriceInputs({
      min: String(filters.priceMin ?? priceBounds.min),
      max: String(filters.priceMax ?? priceBounds.max)
    });
  }, [filters.priceMin, filters.priceMax, priceBounds.min, priceBounds.max]);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.category, filters.country, filters.city, filters.host, filters.priceMin, filters.priceMax, filters.sort]);

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
    ['q', 'category', 'location', 'country', 'city', 'host', 'priceMin', 'priceMax', 'sort']
      .forEach((key) => nextParams.delete(key));

    const filtersToParams = [
      ['q', filters.search],
      ['category', filters.category],
      ['country', filters.country],
      ['city', filters.city],
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
    filters.country || filters.city,
    filters.host,
    filters.priceMin !== null,
    filters.priceMax !== null,
    filters.sort !== 'recommended'
  ].filter(Boolean).length;
  const minPriceText = priceInputs.min || String(priceBounds.min);
  const maxPriceText = priceInputs.max || String(priceBounds.max);

  function commitPriceInput(bound) {
    const rawValue = priceInputs[bound];
    if (rawValue === '') {
      updateFilter(bound === 'min' ? 'priceMin' : 'priceMax', null);
      return;
    }

    const value = Number(rawValue);
    if (!Number.isFinite(value)) return;

    const boundedValue = Math.max(priceBounds.min, Math.min(value, priceBounds.max));
    if (bound === 'min') {
      updateFilter('priceMin', Math.min(boundedValue, filters.priceMax ?? priceBounds.max));
      return;
    }
    updateFilter('priceMax', Math.max(boundedValue, filters.priceMin ?? priceBounds.min));
  }

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
                updateFilter('country', '');
                updateFilter('city', '');
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
          <details className="booking-price-filter" open>
            <summary>Precio</summary>
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
            <div className="booking-price-values">
              <label className="booking-price-input">
                <span className="visually-hidden">Precio mínimo en euros</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={priceBounds.min}
                  max={filters.priceMax ?? priceBounds.max}
                  step="1"
                  value={priceInputs.min}
                  style={{ width: `${Math.max(minPriceText.length, 2)}ch` }}
                  onChange={(event) => setPriceInputs((current) => ({ ...current, min: event.target.value }))}
                  onBlur={() => commitPriceInput('min')}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') event.currentTarget.blur();
                  }}
                  aria-label="Precio mínimo"
                />
                <span aria-hidden="true">€</span>
              </label>
              <span className="booking-price-separator" aria-hidden="true">–</span>
              <label className="booking-price-input">
                <span className="visually-hidden">Precio máximo en euros</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={filters.priceMin ?? priceBounds.min}
                  max={priceBounds.max}
                  step="1"
                  value={priceInputs.max}
                  style={{ width: `${Math.max(maxPriceText.length, 2)}ch` }}
                  onChange={(event) => setPriceInputs((current) => ({ ...current, max: event.target.value }))}
                  onBlur={() => commitPriceInput('max')}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') event.currentTarget.blur();
                  }}
                  aria-label="Precio máximo"
                />
                <span aria-hidden="true">€</span>
              </label>
            </div>
          </details>
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
              <small>{filters.city || filters.country || 'Todas'}</small>
            </summary>
            <div className="booking-location-fields">
              <Select
                name="booking-country"
                label="País"
                value={filters.country}
                onChange={(value) => updateFilters({ country: value, city: '' })}
                options={[
                  { value: '', label: 'Todos los países' },
                  ...countries.map((country) => ({ value: country, label: country }))
                ]}
              />
              <Select
                name="booking-city"
                label="Ciudad"
                value={filters.city}
                disabled={!filters.country}
                onChange={(value) => updateFilter('city', value)}
                options={[
                  { value: '', label: filters.country ? 'Todas las ciudades' : 'Elige un país primero' },
                  ...cities.map((city) => ({ value: city, label: city }))
                ]}
              />
            </div>
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
