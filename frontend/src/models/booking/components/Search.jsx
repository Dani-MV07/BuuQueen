export default function Search({ value, onChange, onSubmit, placeholder = 'Destino, alojamiento o categoría' }) {
  return (
    <form className="booking-search" role="search" onSubmit={onSubmit}>
      <label className="visually-hidden" htmlFor="booking-search">Buscar alojamientos</label>
      <input
        id="booking-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      <button className="button" type="submit">Buscar</button>
    </form>
  );
}
