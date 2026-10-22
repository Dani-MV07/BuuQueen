import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ExperienceForm from '../features/experiences/ExperienceForm';
import { useExperiences } from '../hooks/useExperiences';

export default function ExperienceCreate() {
  const navigate = useNavigate();
  const { createExperience } = useExperiences();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function create(data) {
    setSubmitting(true);
    setError('');
    try {
      await createExperience(data);
      navigate('/experiences');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <Link className="back-link" to="/experiences">← Volver a viajes</Link>
      <div className="page-header compact">
        <div>
          <p className="eyebrow">NUEVO VIAJE</p>
          <h1>Crear viaje</h1>
          <p className="muted">Completa los datos del viaje y añádelo al panel de administración.</p>
        </div>
      </div>
      {error && <div className="alert error" role="alert">{error}</div>}
      <ExperienceForm onSubmit={create} submitLabel="Crear viaje" submitting={submitting} />
    </section>
  );
}