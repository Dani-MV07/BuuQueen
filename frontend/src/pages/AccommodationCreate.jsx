import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccommodationForm from '../features/accommodations/AccommodationForm';
import { useAccommodations } from '../hooks/useAccommodations';

export default function AccommodationCreate() {
  const navigate = useNavigate();
  const { createAccommodation } = useAccommodations();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function create(data) {
    setSubmitting(true);
    setError('');
    try {
      await createAccommodation(data);
      navigate('/accommodations');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <Link className="back-link" to="/accommodations">← Volver a alojamientos</Link>
      <div className="page-header compact">
        <div>
          <p className="eyebrow">NUEVO ALOJAMIENTO</p>
          <h1>Crear alojamiento</h1>
          <p className="muted">Completa los datos del alojamiento y añádelo al panel de administración.</p>
        </div>
      </div>
      {error && <div className="alert error" role="alert">{error}</div>}
      <AccommodationForm onSubmit={create} submitLabel="Crear alojamiento" submitting={submitting} />
    </section>
  );
}