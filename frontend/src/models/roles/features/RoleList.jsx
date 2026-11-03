import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import roleService from '../services/roleService';
import { confirmAction } from '../../../utils/SweetAlert';

const statuses = new Map([['active', 'Activo'], ['inactive', 'Inactivo'], ['draft', 'Borrador'], ['archived', 'Archivado']]);
const dateLabel = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedError, setDeletedError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pending, setPending] = useState({});
  const reload = useCallback(async () => {
    setLoading(true); setError(''); setDeletedError('');
    const [active, removed] = await Promise.allSettled([roleService.list(), roleService.listDeleted()]);
    if (active.status === 'fulfilled') setRoles(active.value); else setError(active.reason.message);
    if (removed.status === 'fulfilled') setDeleted(removed.value); else setDeletedError(removed.reason.message);
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);
  function setAction(id, action, value) { setPending((current) => ({ ...current, [`${id}:${action}`]: value })); }
  async function perform(role, action, callback) {
    setActionError(''); setAction(role._id, action, true);
    try { await callback(); await reload(); } catch (err) { setActionError(err.message); }
    finally { setAction(role._id, action, false); }
  }
  async function changeStatus(role) {
    const options = Object.fromEntries(statuses);
    if (role.status && !Object.hasOwn(options, role.status)) options[role.status] = `Mantener estado actual: ${role.status}`;
    const result = await Swal.fire({ title: 'Cambiar estado del rol', input: 'select', inputOptions: options, inputValue: role.status || 'active', showCancelButton: true, confirmButtonText: 'Guardar estado', cancelButtonText: 'Cancelar', confirmButtonColor: '#003b95' });
    if (result.isConfirmed && result.value !== role.status) await perform(role, 'status', () => roleService.setStatus(role._id, result.value));
  }
  async function remove(role) {
    if (await confirmAction({ title: '¿Mover rol a eliminados?', text: `"${role.name}" podrá recuperarse más tarde.`, confirmButtonText: 'Eliminar' })) {
      await perform(role, 'delete', () => roleService.remove(role._id));
    }
  }
  return (
    <section className="dashboard-page"><div className="dashboard-card">
      <header className="dashboard-heading"><div><p className="eyebrow">GESTIÓN DEL CATÁLOGO</p><h1>Roles</h1><p className="dashboard-subtitle">Administra roles y permisos disponibles para los usuarios.</p></div><Link className="button create-button" to="/roles/new"><span aria-hidden="true">＋</span> Crear rol</Link></header>
      {actionError && <div className="alert error" role="alert">{actionError}</div>}{error && <ErrorState message={error} onRetry={reload} />}
      {loading ? <Skeleton rows={4} /> : error ? null : roles.length === 0 ? <div className="empty-state"><span className="empty-icon" aria-hidden="true">♧</span><h2>Aún no hay roles</h2><p>Crea el primer rol para asignarlo a usuarios.</p><Link className="button" to="/roles/new">Crear rol</Link></div> : (
        <div className="table-scroll"><table className="accommodations-table management-table"><thead><tr><th>Rol</th><th>Fecha de alta</th><th>Estado</th><th>Disponibilidad</th><th>Acciones</th></tr></thead><tbody>{roles.map((role) => <tr key={role._id}>
          <td><div className="accommodation-name"><strong>{role.name}</strong><span>{role.description || 'Sin descripción'}</span></div></td><td className="accommodation-date">{dateLabel(role.createdAt)}</td>
          <td><button className="status-badge" type="button" onClick={() => changeStatus(role)} disabled={pending[`${role._id}:status`]}>{pending[`${role._id}:status`] ? 'Guardando…' : statuses.get(role.status) || role.status || 'Sin estado'}</button></td>
          <td><button className={`active-badge ${role.isActive ? 'is-active' : 'is-inactive'}`} type="button" onClick={() => perform(role, 'active', () => roleService.setActive(role._id, !role.isActive))} disabled={pending[`${role._id}:active`]}>{pending[`${role._id}:active`] ? 'Guardando…' : role.isActive ? 'Disponible' : 'No disponible'}</button></td>
          <td><div className="row-actions"><Link className="icon-button edit-action" to={`/roles/${role._id}/edit`} aria-label={`Editar ${role.name}`}>✎</Link><button className="icon-button delete-action" type="button" onClick={() => remove(role)} disabled={pending[`${role._id}:delete`]} aria-label={`Eliminar ${role.name}`}>⌫</button></div></td>
        </tr>)}</tbody></table></div>
      )}
      <section className="deleted-section"><header className="deleted-heading"><div><h2>Roles eliminados</h2><p>Puedes recuperar los roles eliminados.</p></div><span className="deleted-count">{deleted.length}</span></header>
        {deletedError && <div className="alert error" role="alert">{deletedError}</div>}
        {deleted.length > 0 && <div className="table-scroll"><table className="accommodations-table deleted-table"><thead><tr><th>Rol</th><th>Eliminado</th><th>Acciones</th></tr></thead><tbody>{deleted.map((role) => <tr key={role._id}><td><strong>{role.name}</strong></td><td className="accommodation-date">{dateLabel(role.deletedAt)}</td><td><button className="button restore-button" type="button" onClick={() => perform(role, 'restore', () => roleService.restore(role._id))} disabled={pending[`${role._id}:restore`]}>{pending[`${role._id}:restore`] ? 'Recuperando…' : 'Recuperar rol'}</button></td></tr>)}</tbody></table></div>}
      </section>
    </div></section>
  );
}
