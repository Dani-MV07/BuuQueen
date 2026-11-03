import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccommodationForm from '../features/AccommodationForm';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import { useAccommodations } from '../hooks/useAccommodations';
import { useCategories } from '../../categories/hooks/useCategories';
import { useHosts } from '../../hosts/hooks/useHosts';
import { useLocations } from '../../locations/hooks/useLocations';

export default function AccommodationCreate() {
  const navigate = useNavigate();
  const { createAccommodation } = useAccommodations();
  const { categories, loading: categoriesLoading, error: categoriesError, reload: reloadCategories } = useCategories();
  const { locations, loading: locationsLoading, error: locationsError, reload: reloadLocations } = useLocations();
  const { hosts, loading: hostsLoading, error: hostsError, reload: reloadHosts } = useHosts();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const loadingOptions = categoriesLoading || locationsLoading || hostsLoading;
  const optionsError = [categoriesError, locationsError, hostsError].filter(Boolean).join(' ');

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
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/accommodations">
        <span aria-hidden="true">←</span> Volver a alojamientos
      </Link>
      <header className="editor-header">
        <div className="editor-mark" aria-hidden="true">＋</div>
        <div className="editor-heading-copy">
          <p className="eyebrow">NUEVO ALOJAMIENTO</p>
          <h1>Crear alojamiento</h1>
          <p>Completa la información para añadir un nuevo alojamiento a tu catálogo.</p>
        </div>
        <span className="editor-mode">Nuevo registro</span>
      </header>
      {error && <div className="alert error" role="alert">{error}</div>}
      <AccommodationForm
        categories={categories}
        locations={locations}
        hosts={hosts}
        onSubmit={create}
        submitLabel="Crear alojamiento"
        submitting={submitting}
        loadingOptions={loadingOptions}
      />
    </section>
  );
}