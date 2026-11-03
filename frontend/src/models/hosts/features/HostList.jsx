import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import hostService from '../services/hostService';
import { confirmAction } from '../../../utils/SweetAlert';

const statuses = new Map([['active', 'Activo'], ['inactive', 'Inactivo'], ['draft', 'Borrador'], ['archived', 'Archivado']]);
const title = (host) => host.user_id?.name || 'Anfitrión';
const dateLabel = (value) => value && !Number.isNaN(new Date(value).getTime())
  ? new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
  : '—';

export default function HostList() {
  const [hosts, setHosts] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedError, setDeletedError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pending, setPending] = useState({});
  const reload = useCallback(async () => {
    setLoading(true); setError(''); setDeletedError('');
    const [active, removed] = await Promise.allSettled([hostService.list(), hostService.listDeleted()]);
    if (active.status === 'fulfilled') setHosts(active.value); else setError(active.reason.message);
    if (removed.status === 'fulfilled') setDeleted(removed.value); else setDeletedError(removed.reason.message);
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);
  function setAction(id, name, value) { setPending((current) => ({ ...current, [`${id}:${name}`]: value })); }
  async function perform(host, action, callback) {
    setActionError(''); setAction(host._id, action, true);
    try { await callback(); await reload(); } catch (err) { setActionError(err.message); }
    finally { setAction(host._id, action, false); }
  }
  async function changeStatus(host) {
    const options = Object.fromEntries(statuses);
    if (host.status && !Object.hasOwn(options, host.status)) options[host.status] = `Mantener estado actual: ${host.status}`;
    const result = await Swal.fire({ title: 'Cambiar estado del anfitrión', input: 'select', inputOptions: options, inputValue: host.status || 'active', showCancelButton: true, confirmButtonText: 'Guardar estado', cancelButtonText: 'Cancelar', confirmButtonColor: '#003b95' });
    if (result.isConfirmed && result.value !== host.status) await perform(host, 'status', () => hostService.setStatus(host._id, result.value));
  }
  async function remove(host) {
    if (await confirmAction({ title: '¿Mover anfitrión a eliminados?', text: `"${title(host)}" podrá recuperarse más tarde.`, confirmButtonText: 'Eliminar' })) {
      await perform(host, 'delete', () => hostService.remove(host._id));
    }
  }

  return (
    <section className="dashboard-page"><div className="dashboard-card">
      <header className="dashboard-heading"><div><p className="eyebrow">GESTIÓN DEL CATÁLOGO</p><h1>Anfitriones</h1><p className="dashboard-subtitle">Administra perfiles, estados y disponibilidad de anfitriones.</p></div><Link className="button create-button" to="/hosts/new"><span aria-hidden="true">＋</span> Crear anfitrión</Link></header>
      {actionError && <div className="alert error" role="alert">{actionError}</div>}
      {error && <ErrorState message={error} onRetry={reload} />}
      {loading ? <Skeleton rows={4} /> : error ? null : hosts.length === 0 ? <div className="empty-state"><span className="empty-icon" aria-hidden="true">♙</span><h2>Aún no hay anfitriones</h2><p>Crea el primer perfil de anfitrión.</p><Link className="button" to="/hosts/new">Crear anfitrión</Link></div> : (
        <div className="table-scroll"><table className="accommodations-table management-table"><thead><tr><th>Anfitrión</th><th>Fecha de alta</th><th>Estado</th><th>Disponibilidad</th><th>Acciones</th></tr></thead><tbody>
          {hosts.map((host) => <tr key={host._id}><td><div className="accommodation-name"><strong>{title(host)}</strong><span>{host.user_id?.email || host.bio || 'Sin información adicional'}</span></div></td><td className="accommodation-date">{dateLabel(host.createdAt)}</td>
            <td><button className="status-badge" type="button" onClick={() => changeStatus(host)} disabled={pending[`${host._id}:status`]}>{pending[`${host._id}:status`] ? 'Guardando…' : statuses.get(host.status) || host.status || 'Sin estado'}</button></td>
            <td><button className={`active-badge ${host.isActive ? 'is-active' : 'is-inactive'}`} type="button" onClick={() => perform(host, 'active', () => hostService.setActive(host._id, !host.isActive))} disabled={pending[`${host._id}:active`]}>{pending[`${host._id}:active`] ? 'Guardando…' : host.isActive ? 'Disponible' : 'No disponible'}</button></td>
            <td><div className="row-actions"><Link className="icon-button edit-action" to={`/hosts/${host._id}/edit`} aria-label={`Editar ${title(host)}`}>✎</Link><button className="icon-button delete-action" type="button" onClick={() => remove(host)} disabled={pending[`${host._id}:delete`]} aria-label={`Eliminar ${title(host)}`}>⌫</button></div></td>
          </tr>)}
        </tbody></table></div>
      )}
      <section className="deleted-section"><header className="deleted-heading"><div><h2>Anfitriones eliminados</h2><p>Puedes recuperar los perfiles eliminados.</p></div><span className="deleted-count">{deleted.length}</span></header>
        {deletedError && <div className="alert error" role="alert">{deletedError}</div>}
        {deleted.length > 0 && <div className="table-scroll"><table className="accommodations-table deleted-table"><thead><tr><th>Anfitrión</th><th>Eliminado</th><th>Acciones</th></tr></thead><tbody>{deleted.map((host) => <tr key={host._id}><td><strong>{title(host)}</strong></td><td className="accommodation-date">{dateLabel(host.deletedAt)}</td><td><button className="button restore-button" type="button" onClick={() => perform(host, 'restore', () => hostService.restore(host._id))} disabled={pending[`${host._id}:restore`]}>{pending[`${host._id}:restore`] ? 'Recuperando…' : 'Recuperar anfitrión'}</button></td></tr>)}</tbody></table></div>}
      </section>
    </div></section>
  );
}
