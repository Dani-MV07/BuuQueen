import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../../services/apiService';

function getStartingPrice(product) {
  const prices = (product.variants || [])
    .filter((variant) => variant.isActive !== false && variant.status === 'available' && variant.stock > 0)
    .map((variant) => Number(variant.price))
    .filter(Number.isFinite);
  return prices.length ? Math.min(...prices) : null;
}

export default function ProductCard({ product }) {
  const image = product.images?.find((item) => item?.url_image)?.url_image;
  const imageSource = image ? resolveAssetUrl(image) : '/images/accommodation-fallback.jpg';
  const price = getStartingPrice(product);
  const locationName = product.location_id?.name
    || [product.location_id?.city, product.location_id?.country].filter(Boolean).join(', ');

  return (
    <article className="booking-product-card">
      <Link to={`/booking/${product.slug}`} className="booking-product-image">
        <img src={imageSource} alt="" loading="lazy" />
      </Link>
      <div className="booking-product-copy">
        <p className="booking-product-meta">
          {[locationName, product.category_id?.name].filter(Boolean).join(' · ') || 'Alojamiento'}
        </p>
        <h2><Link to={`/booking/${product.slug}`}>{product.title}</Link></h2>
        <p className="booking-product-description">{product.description || 'Descubre este alojamiento y consulta sus opciones disponibles.'}</p>
        <div className="booking-product-footer">
          <span>{price === null ? 'Consultar disponibilidad' : `Desde ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price)}`}</span>
          <Link className="booking-product-link" to={`/booking/${product.slug}`}>Ver detalles <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}
