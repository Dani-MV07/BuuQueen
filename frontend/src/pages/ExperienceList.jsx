import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ErrorState from '../components/shared/ErrorState';
import Skeleton from '../components/shared/Skeleton';
import { useExperiences } from '../hooks/useExperiences';
import { confirmAction } from '../utils/SweetAlert';

const statusOptions = new Map([
  ['scheduled', 'Programado'],
  ['active', 'En curso'],
  ['completed', 'Completado'],
  ['cancelled', 'Cancelado']
]);

function getStatusLabel(status) {
  return statusOptions.get(status) || status || 'Sin estado';
}

function formatCreatedDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
}

export default function ExperienceList() {
  const {
    experiences,
    deletedExperiences,
    loading,
    error,
    deletedError,
    loadExperiences,
    setExperienceActive,
    setExperienceStatus,
    removeExperience,
    restoreExperience
  } = useExperiences();
  const [actionError, setActionError] = useState('');
  const [pendingActions, setPendingActions] = useState({});

  function setPending(id, action, pending) {
    setPendingActions((current) => ({ ...current, [`${id}:${action}`]: pending }));
  }

  async function toggleActive(experience) {
    setActionError('');
    setPending(experience._id, 'active', true);
    try {
      await setExperienceActive(experience._id, !experience.isActive);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(experience._id, 'active', false);
    }
  }

  async function changeStatus(experience) {
    const options = new Map(statusOptions);
    if (experience.status && !options.has(experience.status)) {
      options.set(experience.status, `Mantener estado actual: ${experience.status}`);
    }

    const result = await Swal.fire({
      title: 'Cambiar estado del viaje',
      input: 'select',
      inputOptions: Object.fromEntries(options),
      inputValue: experience.status || 'scheduled',
      inputPlaceholder: 'Selecciona un estado',
      showCancelButton: true,
      confirmButtonText: 'Guardar estado',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#003b95',
      inputValidator: (value) => value ? undefined : 'Selecciona un estado.'
    });

    if (!result.isConfirmed || result.value === experience.status) return;

    setActionError('');
    setPending(experience._id, 'status', true);
    try {
      await setExperienceStatus(experience._id, result.value);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(experience._id, 'status', false);
    }
  }

  async function remove(experience) {
    const confirmed = await confirmAction({
      title: '¿Mover este viaje a eliminados?',
      text: `"${experience.title}" dejará de aparecer en la lista principal. Podrás recuperarlo más tarde.`,
      confirmButtonText: 'Eliminar'
    });
    if (!confirmed) return;

    setActionError('');
    setPending(experience._id, 'delete', true);
    try {
      await removeExperience(experience._id);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(experience._id, 'delete', false);
    }
  }

  async function restore(experience) {
    setActionError('');
    setPending(experience._id, 'restore', true);
    try {
      await restoreExperience(experience._id);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(experience._id, 'restore', false);
    }
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-card">
        <header className="dashboard-heading">
          <div>
            <p className="eyebrow">GESTIÓN DE VIAJES</p>
            <h1>Viajes</h1>
            <p className="dashboard-subtitle">Administra la disponibilidad y el estado de tus viajes.</p>
          </div>
          <Link className="button create-button" to="/experiences/new">
            <span aria-hidden="true">＋</span> Crear viaje
          </Link>
        </header>

        {actionError && <div className="alert error" role="alert">{actionError}</div>}
        {error && <ErrorState message={error} onRetry={() => loadExperiences()} />}

        {loading ? (
          <Skeleton rows={4} />
        ) : error ? null : experiences.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">✦</span>
            <h2>Aún no hay viajes</h2>
            <p>Crea el primer viaje para empezar a administrar tu catálogo.</p>
            <Link className="button" to="/experiences/new">Crear viaje</Link>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="trips-table">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Fecha de alta</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Disponibilidad</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((experience) => (
                  <tr key={experience._id}>
                    <td>
                      <div className="trip-name">
                        <strong>{experience.title}</strong>
                        <span>{experience.city}</span>
                      </div>
                    </td>
                    <td className="trip-date">{formatCreatedDate(experience.createdAt)}</td>
                    <td>
                      <button
                        className="status-badge"
                        type="button"
                        onClick={() => changeStatus(experience)}
                        disabled={Boolean(pendingActions[`${experience._id}:status`])}
                        title="Cambiar estado"
                      >
                        {pendingActions[`${experience._id}:status`] ? 'Guardando…' : getStatusLabel(experience.status)}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`active-badge ${experience.isActive ? 'is-active' : 'is-inactive'}`}
                        type="button"
                        onClick={() => toggleActive(experience)}
                        disabled={Boolean(pendingActions[`${experience._id}:active`])}
                        aria-label={`${experience.isActive ? 'Desactivar' : 'Activar'} ${experience.title}`}
                        aria-pressed={Boolean(experience.isActive)}
                        title="Cambiar disponibilidad"
                      >
                        {pendingActions[`${experience._id}:active`]
                          ? 'Guardando…'
                          : experience.isActive ? 'Disponible' : 'No disponible'}
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          className="icon-button edit-action"
                          to={`/experiences/${experience._id}/edit`}
                          aria-label={`Editar ${experience.title}`}
                          title="Editar viaje"
                        >
                          <span aria-hidden="true">✎</span>
                        </Link>
                        <button
                          className="icon-button delete-action"
                          type="button"
                          onClick={() => remove(experience)}
                          aria-label={`Eliminar ${experience.title}`}
                          title="Eliminar viaje"
                          disabled={Boolean(pendingActions[`${experience._id}:delete`])}
                        >
                          <span aria-hidden="true">⌫</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <section className="deleted-section" aria-labelledby="deleted-heading">
          <header className="deleted-heading">
            <div>
              <h2 id="deleted-heading">Viajes eliminados</h2>
              <p>Los viajes eliminados se conservan y puedes recuperarlos cuando quieras.</p>
            </div>
            <span className="deleted-count">{deletedExperiences.length}</span>
          </header>

          {deletedError && <div className="alert error" role="alert">{deletedError}</div>}
          {deletedExperiences.length > 0 && (
            <div className="table-scroll">
              <table className="trips-table deleted-table">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Fecha de eliminación</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedExperiences.map((experience) => (
                    <tr key={experience._id}>
                      <td>
                        <div className="trip-name">
                          <strong>{experience.title}</strong>
                          <span>{experience.city}</span>
                        </div>
                      </td>
                      <td className="trip-date">{formatCreatedDate(experience.deletedAt)}</td>
                      <td>
                        <button
                          className="button restore-button"
                          type="button"
                          onClick={() => restore(experience)}
                          disabled={Boolean(pendingActions[`${experience._id}:restore`])}
                        >
                          {pendingActions[`${experience._id}:restore`] ? 'Recuperando…' : 'Recuperar viaje'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
