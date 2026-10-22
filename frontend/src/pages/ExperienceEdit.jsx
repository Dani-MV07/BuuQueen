import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ExperienceForm from '../features/experiences/ExperienceForm';
import ErrorState from '../components/shared/ErrorState';
import Skeleton from '../components/shared/Skeleton';
import { useExperience, useExperiences } from '../hooks';

export default function ExperienceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { experience, loading, error: loadError } = useExperience(id);
  const { updateExperience } = useExperiences();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function update(data) {
    setSubmitting(true);
    setError('');
    try {
      await updateExperience(id, data);
      navigate('/experiences');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton />;
  if (!experience) {
    return (
      <ErrorState
        message={loadError || 'Experiencia no encontrada.'}
        action={<Link to="/experiences">Volver a experiencias</Link>}
      />
    );
  }

  return (
    <section>
      <Link className="back-link" to="/experiences">← Volver a viajes</Link>
      <div className="page-header compact">
        <div>
          <p className="eyebrow">EDICIÓN DE VIAJE</p>
          <h1>Editar viaje</h1>
          <p className="muted">Actualiza los datos del viaje y guarda los cambios.</p>
        </div>
      </div>
      {error && <div className="alert error" role="alert">{error}</div>}
      <ExperienceForm initialValues={experience} onSubmit={update} submitLabel="Guardar cambios" submitting={submitting} />
    </section>
  );
}