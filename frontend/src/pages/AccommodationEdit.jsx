import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AccommodationForm from '../features/accommodations/AccommodationForm';
import ErrorState from '../components/shared/ErrorState';
import Skeleton from '../components/shared/Skeleton';
import { useAccommodation, useAccommodations } from '../hooks';

export default function AccommodationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accommodation, loading, error: loadError } = useAccommodation(id);
  const { updateAccommodation } = useAccommodations();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function update(data) {
    setSubmitting(true);
    setError('');
    try {
      await updateAccommodation(id, data);
      navigate('/accommodations');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton />;
  if (!accommodation) {
    return (
      <ErrorState
        message={loadError || 'Alojamiento no encontrada.'}
        action={<Link to="/accommodations">Volver a alojamientos</Link>}
      />
    );
  }

  return (
    <section>
      <Link className="back-link" to="/accommodations">← Volver a alojamientos</Link>
      <div className="page-header compact">
        <div>
          <p className="eyebrow">EDICIÓN DE ALOJAMIENTO</p>
          <h1>Editar alojamiento</h1>
          <p className="muted">Actualiza los datos del alojamiento y guarda los cambios.</p>
        </div>
      </div>
      {error && <div className="alert error" role="alert">{error}</div>}
      <AccommodationForm initialValues={accommodation} onSubmit={update} submitLabel="Guardar cambios" submitting={submitting} />
    </section>
  );
}