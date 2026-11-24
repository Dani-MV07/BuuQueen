import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../../services/apiService';

export default function CatalogCard({ item, title, description, to }) {
  const image = item.images?.find((entry) => entry?.url_image)?.url_image;
  const content = (
    <>
      <div className="booking-catalog-image">
        {image
          ? <img src={resolveAssetUrl(image)} alt="" />
          : <span aria-hidden="true">✦</span>}
      </div>
      <div className="booking-catalog-copy">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
    </>
  );

  return to
    ? <Link className="booking-catalog-card" to={to}>{content}</Link>
    : <article className="booking-catalog-card">{content}</article>;
}
