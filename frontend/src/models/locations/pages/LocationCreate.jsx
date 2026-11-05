import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LocationForm from '../features/LocationForm';
import locationService from '../services/locationService';
import { saveResourceWithImages } from '../../../utils/saveResourceWithImages';

export default function LocationCreate() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function create(data) {
    setSubmitting(true);
    setError('');
    try {
      await saveResourceWithImages({
        data,
        entityType: 'Location',
        saveResource: locationService.create
      });
      navigate('/locations');
    } catch (err) {
      if (err.resourceSaved?._id) {
        navigate(`/locations/${err.resourceSaved._id}/edit`, {
          state: { notice: err.message }
        });
        return;
      }
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/locations"><span aria-hidden="true">←</span> Volver a ubicaciones</Link>
      <header className="editor-header"><div className="editor-mark" aria-hidden="true">＋</div><div className="editor-heading-copy"><p className="eyebrow">NUEVA UBICACIÓN</p><h1>Crear ubicación</h1><p>Añade una dirección y coordenadas para los alojamientos.</p></div><span className="editor-mode">Nuevo registro</span></header>
      {error && <div className="alert error" role="alert">{error}</div>}
      <LocationForm onSubmit={create} submitting={submitting} />
    </section>
  );
}
