import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import locationService from '../services/locationService';
import { confirmAction } from '../../../utils/SweetAlert';

const statuses = new Map([['active', 'Activo'], ['inactive', 'Inactivo'], ['draft', 'Borrador'], ['archived', 'Archivado']]);
const title = (location) => [location.city, location.country].filter(Boolean).join(', ') || 'Ubicación';
const dateLabel = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';

export default function LocationList() {
  const [locations, setLocations] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedError, setDeletedError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pending, setPending] = useState({});
  const reload = useCallback(async () => {
    setLoading(true); setError(''); setDeletedError('');
    const [active, removed] = await Promise.allSettled([locationService.list(), locationService.listDeleted()]);
    if (active.status === 'fulfilled') setLocations(active.value); else setError(active.reason.message);
    if (removed.status === 'fulfilled') setDeleted(removed.value); else setDeletedError(removed.reason.message);
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);
  function setAction(id, action, value) { setPending((current) => ({ ...current, [`${id}:${action}`]: value })); }
  async function perform(location, action, callback) {
    setActionError(''); setAction(location._id, action, true);
    try { await callback(); await reload(); } catch (err) { setActionError(err.message); }
    finally { setAction(location._id, action, false); }
  }
  async function changeStatus(location) {
    const options = Object.fromEntries(statuses);
    if (location.status && !Object.hasOwn(options, location.status)) options[location.status] = `Mantener estado actual: ${location.status}`;
    const result = await Swal.fire({ title: 'Cambiar estado de la ubicación', input: 'select', inputOptions: options, inputValue: location.status || 'active', showCancelButton: true, confirmButtonText: 'Guardar estado', cancelButtonText: 'Cancelar', confirmButtonColor: '#003b95' });
    if (result.isConfirmed && result.value !== location.status) await perform(location, 'status', () => locationService.setStatus(location._id, result.value));
  }
  async function remove(location) {
    if (await confirmAction({ title: '¿Mover ubicación a eliminados?', text: `"${title(location)}" podrá recuperarse más tarde.`, confirmButtonText: 'Eliminar' })) {
      await perform(location, 'delete', () => locationService.remove(location._id));
    }
  }
  return (
    <section className="dashboard-page"><div className="dashboard-card">
      <header className="dashboard-heading"><div><p className="eyebrow">GESTIÓN DEL CATÁLOGO</p><h1>Ubicaciones</h1><p className="dashboard-subtitle">Administra direcciones y coordenadas de alojamientos.</p></div><Link className="button create-button" to="/locations/new"><span aria-hidden="true">＋</span> Crear ubicación</Link></header>
      {actionError && <div className="alert error" role="alert">{actionError}</div>}{error && <ErrorState message={error} onRetry={reload} />}
      {loading ? <Skeleton rows={4} /> : error ? null : locations.length === 0 ? <div className="empty-state"><span className="empty-icon" aria-hidden="true">⌖</span><h2>Aún no hay ubicaciones</h2><p>Crea la primera ubicación del catálogo.</p><Link className="button" to="/locations/new">Crear ubicación</Link></div> : (
        <div className="table-scroll"><table className="accommodations-table management-table"><thead><tr><th>Ubicación</th><th>Fecha de alta</th><th>Estado</th><th>Disponibilidad</th><th>Acciones</th></tr></thead><tbody>{locations.map((location) => <tr key={location._id}>
          <td><div className="accommodation-name"><strong>{title(location)}</strong><span>{location.address}</span></div></td><td className="accommodation-date">{dateLabel(location.createdAt)}</td>
          <td><button className="status-badge" type="button" onClick={() => changeStatus(location)} disabled={pending[`${location._id}:status`]}>{pending[`${location._id}:status`] ? 'Guardando…' : statuses.get(location.status) || location.status || 'Sin estado'}</button></td>
          <td><button className={`active-badge ${location.isActive ? 'is-active' : 'is-inactive'}`} type="button" onClick={() => perform(location, 'active', () => locationService.setActive(location._id, !location.isActive))} disabled={pending[`${location._id}:active`]}>{pending[`${location._id}:active`] ? 'Guardando…' : location.isActive ? 'Disponible' : 'No disponible'}</button></td>
          <td><div className="row-actions"><Link className="icon-button edit-action" to={`/locations/${location._id}/edit`} aria-label={`Editar ${title(location)}`}>✎</Link><button className="icon-button delete-action" type="button" onClick={() => remove(location)} disabled={pending[`${location._id}:delete`]} aria-label={`Eliminar ${title(location)}`}>⌫</button></div></td>
        </tr>)}</tbody></table></div>
      )}
      <section className="deleted-section"><header className="deleted-heading"><div><h2>Ubicaciones eliminadas</h2><p>Puedes recuperar las ubicaciones eliminadas.</p></div><span className="deleted-count">{deleted.length}</span></header>
        {deletedError && <div className="alert error" role="alert">{deletedError}</div>}
        {deleted.length > 0 && <div className="table-scroll"><table className="accommodations-table deleted-table"><thead><tr><th>Ubicación</th><th>Eliminada</th><th>Acciones</th></tr></thead><tbody>{deleted.map((location) => <tr key={location._id}><td><strong>{title(location)}</strong></td><td className="accommodation-date">{dateLabel(location.deletedAt)}</td><td><button className="button restore-button" type="button" onClick={() => perform(location, 'restore', () => locationService.restore(location._id))} disabled={pending[`${location._id}:restore`]}>{pending[`${location._id}:restore`] ? 'Recuperando…' : 'Recuperar ubicación'}</button></td></tr>)}</tbody></table></div>}
      </section>
    </div></section>
  );
}
