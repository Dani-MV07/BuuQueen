export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  return (
    <nav className="booking-pagination" aria-label="Paginación de alojamientos">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1}>
        Anterior
      </button>
      <span aria-live="polite">Página {page} de {pageCount}</span>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === pageCount}>
        Siguiente
      </button>
    </nav>
  );
}
