import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AccommodationForm from '../features/accommodations/AccommodationForm';
import ErrorState from '../components/shared/ErrorState';
import Skeleton from '../components/shared/Skeleton';
import { useAccommodation, useAccommodations, useCategories, useHosts, useLocations } from '../hooks';

export default function AccommodationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accommodation, loading, error: loadError } = useAccommodation(id);
  const { updateAccommodation } = useAccommodations();
  const { categories, loading: categoriesLoading, error: categoriesError, reload: reloadCategories } = useCategories();
  const { locations, loading: locationsLoading, error: locationsError, reload: reloadLocations } = useLocations();
  const { hosts, loading: hostsLoading, error: hostsError, reload: reloadHosts } = useHosts();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const loadingOptions = categoriesLoading || locationsLoading || hostsLoading;
  const optionsError = [categoriesError, locationsError, hostsError].filter(Boolean).join(' ');

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
  if (loadingOptions) return <Skeleton />;
  if (optionsError) {
    return (
      <ErrorState
        message={optionsError}
        onRetry={() => Promise.all([reloadCategories(), reloadLocations(), reloadHosts()])}
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
      <AccommodationForm
        initialValues={accommodation}
        categories={categories}
        locations={locations}
        hosts={hosts}
        onSubmit={update}
        submitLabel="Guardar cambios"
        submitting={submitting}
        loadingOptions={loadingOptions}
      />
    </section>
  );
}