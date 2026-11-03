import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import LocationForm from '../features/LocationForm';
import locationService from '../services/locationService';

export default function LocationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    locationService.get(id).then((data) => {
      if (active) setLocation(data);
    }).catch((err) => {
      if (active) setError(err.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [id]);

  async function update(data) {
    setSubmitting(true);
    setSubmitError('');
    try {
      await locationService.update(id, data);
      navigate('/locations');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton />;
  if (!location) return <ErrorState message={error || 'No se encontró la ubicación.'} action={<Link to="/locations">Volver a ubicaciones</Link>} />;

  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/locations"><span aria-hidden="true">←</span> Volver a ubicaciones</Link>
      <header className="editor-header"><div className="editor-mark editor-mark-edit" aria-hidden="true">✎</div><div className="editor-heading-copy"><p className="eyebrow">EDICIÓN DE UBICACIÓN</p><h1>Editar ubicación</h1><p>Actualiza la dirección, coordenadas y disponibilidad.</p></div><span className="editor-mode">Editando</span></header>
      {submitError && <div className="alert error" role="alert">{submitError}</div>}
      <LocationForm initialValues={location} onSubmit={update} submitting={submitting} />
    </section>
  );
}
