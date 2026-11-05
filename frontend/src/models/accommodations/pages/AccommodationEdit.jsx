import { useState } from 'react';
import { Link, useLocation as useRouteLocation, useNavigate, useParams } from 'react-router-dom';
import AccommodationForm from '../features/AccommodationForm';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import { useAccommodation } from '../hooks/useAccommodation';
import { useAccommodations } from '../hooks/useAccommodations';
import { useCategories } from '../../categories/hooks/useCategories';
import { useHosts } from '../../hosts/hooks/useHosts';
import { useLocations } from '../../locations/hooks/useLocations';
import { saveResourceWithImages } from '../../../utils/saveResourceWithImages';

export default function AccommodationEdit() {
  const { id } = useParams();
  const routeLocation = useRouteLocation();
  const navigate = useNavigate();
  const { accommodation, loading, error: loadError } = useAccommodation(id);
  const { updateAccommodation } = useAccommodations();
  const { categories, loading: categoriesLoading, error: categoriesError, reload: reloadCategories } = useCategories();
  const { locations, loading: locationsLoading, error: locationsError, reload: reloadLocations } = useLocations();
  const { hosts, loading: hostsLoading, error: hostsError, reload: reloadHosts } = useHosts();
  const [error, setError] = useState(routeLocation.state?.notice ?? '');
  const [submitting, setSubmitting] = useState(false);
  const loadingOptions = categoriesLoading || locationsLoading || hostsLoading;
  const optionsError = [categoriesError, locationsError, hostsError].filter(Boolean).join(' ');

  async function update(data) {
    setSubmitting(true);
    setError('');
    try {
      await saveResourceWithImages({
        data,
        entityType: 'Accommodation',
        saveResource: payload => updateAccommodation(id, payload)
      });
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
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/accommodations">
        <span aria-hidden="true">←</span> Volver a alojamientos
      </Link>
      <header className="editor-header">
        <div className="editor-mark editor-mark-edit" aria-hidden="true">✎</div>
        <div className="editor-heading-copy">
          <p className="eyebrow">EDICIÓN DE ALOJAMIENTO</p>
          <h1>Editar alojamiento</h1>
          <p>Actualiza la información y los ajustes de publicación de este alojamiento.</p>
        </div>
        <span className="editor-mode">Editando</span>
      </header>
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
