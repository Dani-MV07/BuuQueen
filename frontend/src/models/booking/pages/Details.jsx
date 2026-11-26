import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import Carousel from '../components/Carousel';
import productService from '../services/productService';

function availableVariants(product) {
  return (product?.variants || []).filter(
    (variant) => variant.isActive !== false && variant.status === 'available' && variant.stock > 0
  );
}

const currency = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR'
});

export default function Details() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [reservationMessage, setReservationMessage] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setProduct(null);
    setSelectedVariantId('');
    setReservationMessage('');

    productService.getBySlug(slug)
      .then((result) => {
        if (active) setProduct(result);
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
  }, [slug]);

  const variants = availableVariants(product);
  const selectedVariant = useMemo(
    () => variants.find((variant) => variant._id === selectedVariantId) || null,
    [selectedVariantId, variants]
  );
  const startingPrice = variants.length
    ? Math.min(...variants.map((variant) => Number(variant.price)).filter(Number.isFinite))
    : null;

  if (loading) return <section className="booking-page"><Skeleton rows={3} /></section>;
  if (error || !product) {
    return (
      <section className="booking-page">
        <ErrorState
          message={error || 'No se encontró el alojamiento solicitado.'}
          action={<Link className="button" to="/booking/shop">Volver a alojamientos</Link>}
        />
      </section>
    );
  }

  function reserveVariant(variant) {
    setSelectedVariantId(variant._id);
    setReservationMessage(`Has seleccionado ${variant.description || 'esta opción'} para reservar.`);
  }

  return (
    <section className="booking-page booking-details-page">
      <Link className="booking-back-link" to="/booking/shop"><span aria-hidden="true">←</span> Volver a alojamientos</Link>
      <div className="booking-details-layout">
        <Carousel images={product.images} title={product.title} />
        <div className="booking-details-copy">
          <p className="eyebrow">{[product.location_id?.name, product.category_id?.name].filter(Boolean).join(' · ')}</p>
          <h1>{product.title}</h1>
          <p>{product.description || 'Contacta con nuestro equipo para conocer más sobre este alojamiento.'}</p>

          <dl className="booking-property-info">
            <div>
              <dt>Ubicación</dt>
              <dd>{product.location_id?.name || 'Ubicación por confirmar'}</dd>
              {product.location_id?.address && <dd>{product.location_id.address}</dd>}
            </div>
            <div>
              <dt>Categoría</dt>
              <dd>{product.category_id?.name || 'Alojamiento'}</dd>
            </div>
            <div>
              <dt>Anfitrión</dt>
              <dd>{product.host_id?.name || 'Anfitrión BuuQueen'}</dd>
            </div>
            {startingPrice !== null && (
              <div>
                <dt>Desde</dt>
                <dd>{currency.format(startingPrice)} / noche</dd>
              </div>
            )}
          </dl>

          {product.location_id?.description && (
            <section className="booking-detail-section">
              <h2>Sobre la ubicación</h2>
              <p>{product.location_id.description}</p>
            </section>
          )}

          {product.host_id?.bio && (
            <section className="booking-detail-section">
              <h2>Sobre el anfitrión</h2>
              <p>{product.host_id.description || product.host_id.bio}</p>
            </section>
          )}

          <section className="booking-availability" aria-labelledby="availability-heading">
            <h2 id="availability-heading">Opciones disponibles</h2>
            {variants.length === 0 ? (
              <p>Por el momento no hay opciones disponibles para este alojamiento.</p>
            ) : (
              <div className="booking-variant-list">
                {variants.map((variant) => (
                  <article
                    className={`booking-variant ${selectedVariantId === variant._id ? 'is-selected' : ''}`}
                    key={variant._id}
                  >
                    <div className="booking-variant-copy">
                      <h3>{variant.description || `Opción para ${variant.capacity} personas`}</h3>
                      <p>
                        <span>{variant.capacity} {variant.capacity === 1 ? 'persona' : 'personas'}</span>
                        <span>{variant.stock} {variant.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}</span>
                      </p>
                      {variant.sku && <small>Código: {variant.sku}</small>}
                    </div>
                    <div className="booking-variant-action">
                      <strong>{currency.format(variant.price)} <span>/ noche</span></strong>
                      <button
                        type="button"
                        className="button"
                        onClick={() => reserveVariant(variant)}
                      >
                        {selectedVariantId === variant._id ? 'Seleccionada' : 'Reservar'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {selectedVariant && (
              <div className="booking-reservation-selection" role="status">
                <p>{reservationMessage}</p>
                <strong>{currency.format(selectedVariant.price)} / noche</strong>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
