import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import CardCarousel from '../components/CardCarousel';
import CatalogCard from '../components/CatalogCard';
import ProductCard from '../components/ProductCard';
import Search from '../components/Search';
import useHomeCatalog from '../hooks/useHomeCatalog';
import useProdsSearch from '../hooks/useProdsSearch';

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { products, loading, error } = useProdsSearch();
  const {
    categories,
    hosts,
    locations,
    loading: sectionsLoading,
    error: sectionsError
  } = useHomeCatalog();

  function search(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    const queryString = params.toString();
    navigate(`/booking/shop${queryString ? `?${queryString}` : ''}`);
  }

  return (
    <section className="booking-page">
      <header className="booking-hero">
        <p className="eyebrow">BUUQUEEN · ESCAPADAS CON ENCANTO</p>
        <h1>Encuentra tu próxima <span>aventura</span></h1>
        <p>Estancias con personalidad, lugares memorables y todo lo que necesitas para desconectar.</p>
        <Search value={query} onChange={setQuery} onSubmit={search} />
      </header>

      {sectionsError ? <ErrorState message={sectionsError} /> : (
        <>
          <section className="booking-section" aria-labelledby="booking-featured-title">
            <div className="booking-section-heading">
              <div>
                <p className="eyebrow">INSPIRACIÓN PARA TU VIAJE</p>
                <h2 id="booking-featured-title">Alojamientos destacados</h2>
              </div>
              <Link className="booking-text-link" to="/booking/shop">
                Ver todos <span aria-hidden="true">→</span>
              </Link>
            </div>
            {error && <ErrorState message={error} />}
            {loading ? <Skeleton rows={3} /> : error ? null : products.length === 0 ? (
              <p className="booking-empty">Todavía no hay alojamientos publicados.</p>
            ) : (
              <CardCarousel label="Alojamientos">
                {products.slice(0, 10).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </CardCarousel>
            )}
          </section>

          <section className="booking-section" aria-labelledby="booking-categories-title">
            <div className="booking-section-heading">
              <div>
                <p className="eyebrow">ENCUENTRA TU ESTILO</p>
                <h2 id="booking-categories-title">Categorías</h2>
              </div>
              <Link className="booking-text-link" to="/booking/shop">
                Explorar alojamientos <span aria-hidden="true">→</span>
              </Link>
            </div>
            {sectionsLoading ? <Skeleton rows={2} /> : categories.length === 0 ? (
              <p className="booking-empty">Todavía no hay categorías disponibles.</p>
            ) : (
              <CardCarousel label="Categorías">
                {categories.map((category) => (
                  <CatalogCard
                    key={category._id}
                    item={category}
                    title={category.name}
                    description={category.description}
                    to={`/booking/shop?q=${encodeURIComponent(category.name)}`}
                  />
                ))}
              </CardCarousel>
            )}
          </section>

          <section className="booking-section" aria-labelledby="booking-hosts-title">
            <div className="booking-section-heading">
              <div>
                <p className="eyebrow">PERSONAS QUE TE RECIBEN</p>
                <h2 id="booking-hosts-title">Anfitriones</h2>
              </div>
            </div>
            {sectionsLoading ? <Skeleton rows={2} /> : hosts.length === 0 ? (
              <p className="booking-empty">Todavía no hay anfitriones disponibles.</p>
            ) : (
              <CardCarousel label="Anfitriones">
                {hosts.map((host) => (
                  <CatalogCard
                    key={host._id}
                    item={host}
                    title={host.name}
                    description={host.bio || host.description}
                  />
                ))}
              </CardCarousel>
            )}
          </section>

          <section className="booking-section" aria-labelledby="booking-locations-title">
            <div className="booking-section-heading">
              <div>
                <p className="eyebrow">LUGARES POR DESCUBRIR</p>
                <h2 id="booking-locations-title">Ubicaciones</h2>
              </div>
            </div>
            {sectionsLoading ? <Skeleton rows={2} /> : locations.length === 0 ? (
              <p className="booking-empty">Todavía no hay ubicaciones disponibles.</p>
            ) : (
              <CardCarousel label="Ubicaciones">
                {locations.map((location) => (
                  <CatalogCard
                    key={location._id}
                    item={location}
                    title={location.name}
                    description={location.description}
                    to={`/booking/shop?q=${encodeURIComponent(location.city)}`}
                  />
                ))}
              </CardCarousel>
            )}
          </section>
        </>
      )}
    </section>
  );
}
