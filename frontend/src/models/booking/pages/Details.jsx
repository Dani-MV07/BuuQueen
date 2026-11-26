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

function dateInputValue(daysFromToday = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftDate(value, days) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function getNightCount(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  const nights = Math.round((end - start) / 86400000);
  return Number.isFinite(nights) && nights > 0 ? nights : 0;
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
  const [checkInDate, setCheckInDate] = useState(() => dateInputValue(1));
  const [checkOutDate, setCheckOutDate] = useState(() => dateInputValue(2));

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
  const nightCount = getNightCount(checkInDate, checkOutDate);

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
    setReservationMessage(`Has seleccionado ${variant.description || 'esta opción'}.`);
  }

  return (
    <section className="booking-page booking-details-page">
      <Link className="booking-back-link" to="/booking/shop"><span aria-hidden="true">←</span> Volver a alojamientos</Link>
      <div className="booking-details-layout">
        <Carousel images={product.images} title={product.title} />
        <div className="booking-details-copy">
          <p className="eyebrow">{product.location_id?.name}</p>
          <h1>{product.title}</h1>
          <p>{product.description || 'Contacta con nuestro equipo para conocer más sobre este alojamiento.'}</p>

          <dl className="booking-property-info">
            <div>
              <dt>Ubicación</dt>
              <dd>{product.location_id?.name || 'Ubicación por confirmar'}</dd>
              {product.location_id?.address && <dd>{product.location_id.address}</dd>}
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

          {product.host_id && (
            <details className="booking-host-profile">
              <summary>Conoce al anfitrión{product.host_id.name ? ` · ${product.host_id.name}` : ''}</summary>
              <div>
                <h2>{product.host_id.name || 'Anfitrión BuuQueen'}</h2>
                <p>{product.host_id.bio || 'Este anfitrión forma parte de la comunidad BuuQueen.'}</p>
                {product.host_id.description && product.host_id.description !== product.host_id.bio && (
                  <p>{product.host_id.description}</p>
                )}
              </div>
            </details>
          )}

          <section className="booking-availability" aria-labelledby="availability-heading">
            <h2 id="availability-heading">Opciones disponibles</h2>
            {variants.length === 0 ? (
              <p>Por el momento no hay opciones disponibles para este alojamiento.</p>
            ) : (
              <>
                <div className="booking-date-picker">
                  <label>
                    <span>Entrada</span>
                    <input
                      type="date"
                      min={dateInputValue()}
                      value={checkInDate}
                      onChange={(event) => {
                        const nextCheckIn = event.target.value;
                        setCheckInDate(nextCheckIn);
                        if (getNightCount(nextCheckIn, checkOutDate) === 0) {
                          setCheckOutDate(shiftDate(nextCheckIn, 1));
                        }
                      }}
                    />
                  </label>
                  <label>
                    <span>Salida</span>
                    <input
                      type="date"
                      min={shiftDate(checkInDate, 1)}
                      value={checkOutDate}
                      onChange={(event) => setCheckOutDate(event.target.value)}
                    />
                  </label>
                  {nightCount > 0 && (
                    <p className="booking-night-count">
                      {nightCount} {nightCount === 1 ? 'noche seleccionada' : 'noches seleccionadas'}
                    </p>
                  )}
                </div>
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
                        {nightCount > 0 && (
                          <span className="booking-variant-total">
                            Total: {currency.format(Number(variant.price) * nightCount)}
                          </span>
                        )}
                        <button
                          type="button"
                          className="button"
                          onClick={() => reserveVariant(variant)}
                        >
                          {selectedVariantId === variant._id ? 'Seleccionada' : 'Elegir opción'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <p className="booking-price-note">El total es orientativo y se calcula según el precio por noche y las fechas elegidas.</p>
              </>
            )}
            {selectedVariant && nightCount > 0 && (
              <div className="booking-reservation-selection" role="status">
                <p>
                  {reservationMessage} {nightCount} {nightCount === 1 ? 'noche' : 'noches'}
                </p>
                <strong>{currency.format(Number(selectedVariant.price) * nightCount)} total</strong>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
