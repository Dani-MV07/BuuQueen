import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import userService from '../services/userService';
import { confirmAction } from '../../../utils/SweetAlert';

const statuses = new Map([['active', 'Activo'], ['inactive', 'Inactivo'], ['draft', 'Borrador'], ['archived', 'Archivado']]);
const dateLabel = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedError, setDeletedError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pending, setPending] = useState({});
  const reload = useCallback(async () => {
    setLoading(true); setError(''); setDeletedError('');
    const [active, removed] = await Promise.allSettled([userService.list(), userService.listDeleted()]);
    if (active.status === 'fulfilled') setUsers(active.value); else setError(active.reason.message);
    if (removed.status === 'fulfilled') setDeleted(removed.value); else setDeletedError(removed.reason.message);
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);
  function setAction(id, action, value) { setPending((current) => ({ ...current, [`${id}:${action}`]: value })); }
  async function perform(user, action, callback) {
    setActionError(''); setAction(user._id, action, true);
    try { await callback(); await reload(); } catch (err) { setActionError(err.message); }
    finally { setAction(user._id, action, false); }
  }
  async function changeStatus(user) {
    const options = Object.fromEntries(statuses);
    if (user.status && !Object.hasOwn(options, user.status)) options[user.status] = `Mantener estado actual: ${user.status}`;
    const result = await Swal.fire({ title: 'Cambiar estado del usuario', input: 'select', inputOptions: options, inputValue: user.status || 'active', showCancelButton: true, confirmButtonText: 'Guardar estado', cancelButtonText: 'Cancelar', confirmButtonColor: '#003b95' });
    if (result.isConfirmed && result.value !== user.status) await perform(user, 'status', () => userService.setStatus(user._id, result.value));
  }
  async function remove(user) {
    if (await confirmAction({ title: '¿Mover usuario a eliminados?', text: `"${user.name}" podrá recuperarse más tarde.`, confirmButtonText: 'Eliminar' })) {
      await perform(user, 'delete', () => userService.remove(user._id));
    }
  }
  return (
    <section className="dashboard-page"><div className="dashboard-card">
      <header className="dashboard-heading"><div><p className="eyebrow">GESTIÓN DE CUENTAS</p><h1>Usuarios</h1><p className="dashboard-subtitle">Administra usuarios, roles y disponibilidad de las cuentas.</p></div><Link className="button create-button" to="/users/new"><span aria-hidden="true">＋</span> Crear usuario</Link></header>
      {actionError && <div className="alert error" role="alert">{actionError}</div>}{error && <ErrorState message={error} onRetry={reload} />}
      {loading ? <Skeleton rows={4} /> : error ? null : users.length === 0 ? <div className="empty-state"><span className="empty-icon" aria-hidden="true">♧</span><h2>Aún no hay usuarios</h2><p>Crea el primer usuario de la plataforma.</p><Link className="button" to="/users/new">Crear usuario</Link></div> : (
        <div className="table-scroll"><table className="accommodations-table management-table"><thead><tr><th>Usuario</th><th>Fecha de alta</th><th>Estado</th><th>Disponibilidad</th><th>Acciones</th></tr></thead><tbody>{users.map((user) => <tr key={user._id}>
          <td><div className="accommodation-name"><strong>{user.name}</strong><span>{[user.email, user.role_id?.name].filter(Boolean).join(' · ')}</span></div></td><td className="accommodation-date">{dateLabel(user.createdAt)}</td>
          <td><button className="status-badge" type="button" onClick={() => changeStatus(user)} disabled={pending[`${user._id}:status`]}>{pending[`${user._id}:status`] ? 'Guardando…' : statuses.get(user.status) || user.status || 'Sin estado'}</button></td>
          <td><button className={`active-badge ${user.isActive ? 'is-active' : 'is-inactive'}`} type="button" onClick={() => perform(user, 'active', () => userService.setActive(user._id, !user.isActive))} disabled={pending[`${user._id}:active`]}>{pending[`${user._id}:active`] ? 'Guardando…' : user.isActive ? 'Disponible' : 'No disponible'}</button></td>
          <td><div className="row-actions"><Link className="icon-button edit-action" to={`/users/${user._id}/edit`} aria-label={`Editar ${user.name}`}>✎</Link><button className="icon-button delete-action" type="button" onClick={() => remove(user)} disabled={pending[`${user._id}:delete`]} aria-label={`Eliminar ${user.name}`}>⌫</button></div></td>
        </tr>)}</tbody></table></div>
      )}
      <section className="deleted-section"><header className="deleted-heading"><div><h2>Usuarios eliminados</h2><p>Puedes recuperar las cuentas eliminadas.</p></div><span className="deleted-count">{deleted.length}</span></header>
        {deletedError && <div className="alert error" role="alert">{deletedError}</div>}
        {deleted.length > 0 && <div className="table-scroll"><table className="accommodations-table deleted-table"><thead><tr><th>Usuario</th><th>Eliminado</th><th>Acciones</th></tr></thead><tbody>{deleted.map((user) => <tr key={user._id}><td><strong>{user.name}</strong></td><td className="accommodation-date">{dateLabel(user.deletedAt)}</td><td><button className="button restore-button" type="button" onClick={() => perform(user, 'restore', () => userService.restore(user._id))} disabled={pending[`${user._id}:restore`]}>{pending[`${user._id}:restore`] ? 'Recuperando…' : 'Recuperar usuario'}</button></td></tr>)}</tbody></table></div>}
      </section>
    </div></section>
  );
}
