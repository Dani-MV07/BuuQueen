export default function Skeleton({ rows = 3 }) {
  return (
    <div className="skeleton-state" role="status" aria-label="Cargando contenido">
      {Array.from({ length: rows }, (_, index) => (
        <div className="skeleton-row" key={index}>
          <span className="skeleton-block skeleton-icon" />
          <span className="skeleton-block skeleton-content" />
          <span className="skeleton-block skeleton-action" />
        </div>
      ))}
      <span className="visually-hidden">Cargando...</span>
    </div>
  );
}
