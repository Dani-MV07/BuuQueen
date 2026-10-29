import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ErrorState from '../components/shared/ErrorState';
import Skeleton from '../components/shared/Skeleton';
import { useAccommodations } from '../hooks/useAccommodations';
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

export default function AccommodationList() {
  const {
    accommodations,
    deletedAccommodations,
    loading,
    error,
    deletedError,
    loadAccommodations,
    setAccommodationActive,
    setAccommodationStatus,
    removeAccommodation,
    restoreAccommodation
  } = useAccommodations();
  const [actionError, setActionError] = useState('');
  const [pendingActions, setPendingActions] = useState({});

  function setPending(id, action, pending) {
    setPendingActions((current) => ({ ...current, [`${id}:${action}`]: pending }));
  }

  async function toggleActive(accommodation) {
    setActionError('');
    setPending(accommodation._id, 'active', true);
    try {
      await setAccommodationActive(accommodation._id, !accommodation.isActive);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(accommodation._id, 'active', false);
    }
  }

  async function changeStatus(accommodation) {
    const options = new Map(statusOptions);
    if (accommodation.status && !options.has(accommodation.status)) {
      options.set(accommodation.status, `Mantener estado actual: ${accommodation.status}`);
    }

    const result = await Swal.fire({
      title: 'Cambiar estado del alojamiento',
      input: 'select',
      inputOptions: Object.fromEntries(options),
      inputValue: accommodation.status || 'scheduled',
      inputPlaceholder: 'Selecciona un estado',
      showCancelButton: true,
      confirmButtonText: 'Guardar estado',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#003b95',
      inputValidator: (value) => value ? undefined : 'Selecciona un estado.'
    });

    if (!result.isConfirmed || result.value === accommodation.status) return;

    setActionError('');
    setPending(accommodation._id, 'status', true);
    try {
      await setAccommodationStatus(accommodation._id, result.value);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(accommodation._id, 'status', false);
    }
  }

  async function remove(accommodation) {
    const confirmed = await confirmAction({
      title: '¿Mover este alojamiento a eliminados?',
      text: `"${accommodation.title}" dejará de aparecer en la lista principal. Podrás recuperarlo más tarde.`,
      confirmButtonText: 'Eliminar'
    });
    if (!confirmed) return;

    setActionError('');
    setPending(accommodation._id, 'delete', true);
    try {
      await removeAccommodation(accommodation._id);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(accommodation._id, 'delete', false);
    }
  }

  async function restore(accommodation) {
    setActionError('');
    setPending(accommodation._id, 'restore', true);
    try {
      await restoreAccommodation(accommodation._id);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(accommodation._id, 'restore', false);
    }
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-card">
        <header className="dashboard-heading">
          <div>
            <p className="eyebrow">GESTIÓN DE ALOJAMIENTOS</p>
            <h1>Alojamientos</h1>
            <p className="dashboard-subtitle">Administra la disponibilidad y el estado de tus alojamientos.</p>
          </div>
          <Link className="button create-button" to="/accommodations/new">
            <span aria-hidden="true">＋</span> Crear alojamiento
          </Link>
        </header>

        {actionError && <div className="alert error" role="alert">{actionError}</div>}
        {error && <ErrorState message={error} onRetry={() => loadAccommodations()} />}

        {loading ? (
          <Skeleton rows={4} />
        ) : error ? null : accommodations.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">✦</span>
            <h2>Aún no hay alojamientos</h2>
            <p>Crea el primer alojamiento para empezar a administrar tu catálogo.</p>
            <Link className="button" to="/accommodations/new">Crear alojamiento</Link>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="accommodations-table">
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
                {accommodations.map((accommodation) => (
                  <tr key={accommodation._id}>
                    <td>
                      <div className="accommodation-name">
                        <strong>{accommodation.title}</strong>
                        <span>{accommodation.city}</span>
                      </div>
                    </td>
                    <td className="accommodation-date">{formatCreatedDate(accommodation.createdAt)}</td>
                    <td>
                      <button
                        className="status-badge"
                        type="button"
                        onClick={() => changeStatus(accommodation)}
                        disabled={Boolean(pendingActions[`${accommodation._id}:status`])}
                        title="Cambiar estado"
                      >
                        {pendingActions[`${accommodation._id}:status`] ? 'Guardando…' : getStatusLabel(accommodation.status)}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`active-badge ${accommodation.isActive ? 'is-active' : 'is-inactive'}`}
                        type="button"
                        onClick={() => toggleActive(accommodation)}
                        disabled={Boolean(pendingActions[`${accommodation._id}:active`])}
                        aria-label={`${accommodation.isActive ? 'Desactivar' : 'Activar'} ${accommodation.title}`}
                        aria-pressed={Boolean(accommodation.isActive)}
                        title="Cambiar disponibilidad"
                      >
                        {pendingActions[`${accommodation._id}:active`]
                          ? 'Guardando…'
                          : accommodation.isActive ? 'Disponible' : 'No disponible'}
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          className="icon-button edit-action"
                          to={`/accommodations/${accommodation._id}/edit`}
                          aria-label={`Editar ${accommodation.title}`}
                          title="Editar alojamiento"
                        >
                          <span aria-hidden="true">✎</span>
                        </Link>
                        <button
                          className="icon-button delete-action"
                          type="button"
                          onClick={() => remove(accommodation)}
                          aria-label={`Eliminar ${accommodation.title}`}
                          title="Eliminar alojamiento"
                          disabled={Boolean(pendingActions[`${accommodation._id}:delete`])}
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
              <h2 id="deleted-heading">Alojamientos eliminados</h2>
              <p>Los alojamientos eliminados se conservan y puedes recuperarlos cuando quieras.</p>
            </div>
            <span className="deleted-count">{deletedAccommodations.length}</span>
          </header>

          {deletedError && <div className="alert error" role="alert">{deletedError}</div>}
          {deletedAccommodations.length > 0 && (
            <div className="table-scroll">
              <table className="accommodations-table deleted-table">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Fecha de eliminación</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedAccommodations.map((accommodation) => (
                    <tr key={accommodation._id}>
                      <td>
                        <div className="accommodation-name">
                          <strong>{accommodation.title}</strong>
                          <span>{accommodation.city}</span>
                        </div>
                      </td>
                      <td className="accommodation-date">{formatCreatedDate(accommodation.deletedAt)}</td>
                      <td>
                        <button
                          className="button restore-button"
                          type="button"
                          onClick={() => restore(accommodation)}
                          disabled={Boolean(pendingActions[`${accommodation._id}:restore`])}
                        >
                          {pendingActions[`${accommodation._id}:restore`] ? 'Recuperando…' : 'Recuperar alojamiento'}
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
