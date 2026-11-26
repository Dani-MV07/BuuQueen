import { useState } from 'react';
import { resolveAssetUrl } from '../../../services/apiService';

export default function Carousel({ images = [], title }) {
  const usableImages = images.filter((image) => image?.url_image);
  const [index, setIndex] = useState(0);

  if (!usableImages.length) {
    return (
      <div className="booking-carousel booking-carousel-empty" role="img" aria-label={`Imagen de ${title}`}>
        <img src="/images/accommodation-fallback.jpg" alt="" />
      </div>
    );
  }

  const move = (offset) => {
    setIndex((current) => (current + offset + usableImages.length) % usableImages.length);
  };

  return (
    <div className="booking-carousel" aria-label={`Imágenes de ${title}`}>
      <img src={resolveAssetUrl(usableImages[index].url_image)} alt={`${title}, imagen ${index + 1}`} />
      {usableImages.length > 1 && (
        <>
          <button type="button" className="carousel-control carousel-previous" onClick={() => move(-1)} aria-label="Imagen anterior">
            ‹
          </button>
          <button type="button" className="carousel-control carousel-next" onClick={() => move(1)} aria-label="Imagen siguiente">
            ›
          </button>
          <span className="carousel-count" aria-live="polite">{index + 1} / {usableImages.length}</span>
        </>
      )}
    </div>
  );
}
