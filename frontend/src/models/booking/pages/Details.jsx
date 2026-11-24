import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import Carousel from '../components/Carousel';
import productService from '../services/productService';

function availableVariants(product) {
  return (product.variants || []).filter(
    (variant) => variant.isActive !== false && variant.status === 'available' && variant.stock > 0
  );
}

export default function Details() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

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

  const variants = availableVariants(product);

  return (
    <section className="booking-page booking-details-page">
      <Link className="booking-back-link" to="/booking/shop"><span aria-hidden="true">←</span> Volver a alojamientos</Link>
      <div className="booking-details-layout">
        <Carousel images={product.images} title={product.title} />
        <div className="booking-details-copy">
          <p className="eyebrow">{[product.location_id?.name, product.category_id?.name].filter(Boolean).join(' · ')}</p>
          <h1>{product.title}</h1>
          <p>{product.description || 'Contacta con nuestro equipo para conocer más sobre este alojamiento.'}</p>

          <section className="booking-availability" aria-labelledby="availability-heading">
            <h2 id="availability-heading">Opciones disponibles</h2>
            {variants.length === 0 ? (
              <p>Por el momento no hay opciones disponibles para este alojamiento.</p>
            ) : (
              <ul>
                {variants.map((variant) => (
                  <li key={variant._id}>
                    <span>{variant.description || `${variant.capacity} ${variant.capacity === 1 ? 'persona' : 'personas'}`}</span>
                    <strong>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(variant.price)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
