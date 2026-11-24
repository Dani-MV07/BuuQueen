export default function Select({ label, value, options, onChange, name }) {
  return (
    <label className="booking-select" htmlFor={name}>
      <span>{label}</span>
      <select id={name} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
