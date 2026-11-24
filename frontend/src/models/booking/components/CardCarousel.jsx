import { Children, useCallback, useEffect, useRef, useState } from 'react';

export default function CardCarousel({ label, children }) {
  const trackRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScroll: false,
    canScrollPrevious: false,
    canScrollNext: false
  });

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const canScroll = maxScroll > 1;
    setScrollState({
      canScroll,
      canScrollPrevious: canScroll && track.scrollLeft > 1,
      canScrollNext: canScroll && track.scrollLeft < maxScroll - 1
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateScrollState);
    observer?.observe(track);
    Array.from(track.children).forEach((item) => observer?.observe(item));
    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    updateScrollState();

    return () => {
      observer?.disconnect();
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [children, updateScrollState]);

  function scroll(direction) {
    trackRef.current?.scrollBy({
      left: direction * Math.max(1, trackRef.current.clientWidth * 0.8),
      behavior: 'smooth'
    });
  }

  return (
    <div className="booking-card-carousel" role="region" aria-label={`${label} destacados`}>
      <button
        className={`card-carousel-control${scrollState.canScrollPrevious ? '' : ' is-hidden'}`}
        type="button"
        onClick={() => scroll(-1)}
        disabled={!scrollState.canScrollPrevious}
        tabIndex={scrollState.canScrollPrevious ? 0 : -1}
        aria-hidden={!scrollState.canScrollPrevious}
        aria-label={`Anterior: ${label}`}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <div ref={trackRef} className="booking-card-carousel-track">{children}</div>
      <button
        className={`card-carousel-control${scrollState.canScrollNext ? '' : ' is-hidden'}`}
        type="button"
        onClick={() => scroll(1)}
        disabled={!scrollState.canScrollNext}
        tabIndex={scrollState.canScrollNext ? 0 : -1}
        aria-hidden={!scrollState.canScrollNext}
        aria-label={`Siguiente: ${label}`}
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  );
}
