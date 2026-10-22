export default function ErrorState({ message, onRetry, action }) {
  return (
    <div className="error-state card" role="alert">
      <h2>No se pudo mostrar el contenido</h2>
      <p>{message}</p>
      <div className="error-state-actions">
        {onRetry && <button className="button button-secondary" onClick={onRetry}>Reintentar</button>}
        {action}
      </div>
    </div>
  );
}
