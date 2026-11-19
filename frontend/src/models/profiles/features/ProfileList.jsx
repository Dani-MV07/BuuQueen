import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import { resolveAssetUrl } from '../../../services/apiService';
import { confirmAction } from '../../../utils/SweetAlert';
import profileService from '../services/profileService';

const dateLabel = value => value && !Number.isNaN(new Date(value).getTime())
  ? new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
  : '—';

function ProfileIdentity({ profile }) {
  const user = profile.user_id;
  const name = user?.name || user?.email || 'Usuario';
  return (
    <div className="profile-list-identity">
      <div className="profile-list-avatar">
        {profile.avatar
          ? <><img src={resolveAssetUrl(profile.avatar)} alt="" onError={event => { event.currentTarget.hidden = true; }} /><span>{name.charAt(0).toUpperCase()}</span></>
          : <span>{name.charAt(0).toUpperCase()}</span>}
      </div>
      <div className="accommodation-name"><strong>{name}</strong><span>{user?.email || 'Sin correo'}</span></div>
    </div>
  );
}

export default function ProfileList() {
  const { refreshMyProfile } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [deletedProfiles, setDeletedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedError, setDeletedError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pending, setPending] = useState({});

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    setDeletedError('');
    const [active, deleted] = await Promise.allSettled([profileService.list(), profileService.listDeleted()]);
    if (active.status === 'fulfilled') setProfiles(active.value);
    else setError(active.reason.message);
    if (deleted.status === 'fulfilled') setDeletedProfiles(deleted.value);
    else setDeletedError(deleted.reason.message);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  async function perform(profile, action, callback) {
    setActionError('');
    setPending(current => ({ ...current, [`${profile._id}:${action}`]: true }));
    try {
      await callback();
      await Promise.all([reload(), refreshMyProfile().catch(() => undefined)]);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setPending(current => ({ ...current, [`${profile._id}:${action}`]: false }));
    }
  }

  async function remove(profile) {
    const userName = profile.user_id?.name || profile.user_id?.email || 'este usuario';
    if (await confirmAction({ title: '¿Mover perfil a eliminados?', text: `El perfil de ${userName} podrá recuperarse más tarde.`, confirmButtonText: 'Eliminar' })) {
      await perform(profile, 'delete', () => profileService.remove(profile._id));
    }
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-card">
        <header className="dashboard-heading">
          <div><p className="eyebrow">GESTIÓN DE CUENTAS</p><h1>Perfiles</h1><p className="dashboard-subtitle">Administra la foto y los datos personales asociados a cada usuario.</p></div>
          <Link className="button create-button" to="/profiles/new"><span aria-hidden="true">＋</span> Crear perfil</Link>
        </header>
        {actionError && <div className="alert error" role="alert">{actionError}</div>}
        {error && <ErrorState message={error} onRetry={reload} />}
        {loading ? <Skeleton rows={4} /> : error ? null : profiles.length === 0 ? (
          <div className="empty-state"><span className="empty-icon" aria-hidden="true">♙</span><h2>Aún no hay perfiles</h2><p>Crea un perfil para completar los datos personales de un usuario.</p><Link className="button" to="/profiles/new">Crear perfil</Link></div>
        ) : (
          <div className="table-scroll">
            <table className="accommodations-table details-table profile-table">
              <thead><tr><th>Usuario</th><th>Teléfono</th><th>Biografía</th><th>Fecha de alta</th><th>Acciones</th></tr></thead>
              <tbody>{profiles.map(profile => (
                <tr key={profile._id}>
                  <td><ProfileIdentity profile={profile} /></td>
                  <td className="table-detail">{profile.phone || '—'}</td>
                  <td className="table-detail">{profile.bio || '—'}</td>
                  <td className="accommodation-date">{dateLabel(profile.createdAt)}</td>
                  <td><div className="row-actions">
                    <Link className="icon-button edit-action" to={`/profiles/${profile._id}/edit`} aria-label={`Editar perfil de ${profile.user_id?.name || 'usuario'}`}>✎</Link>
                    <button className="icon-button delete-action" type="button" onClick={() => remove(profile)} disabled={pending[`${profile._id}:delete`]} aria-label="Eliminar perfil">⌫</button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        <section className="deleted-section">
          <header className="deleted-heading"><div><h2>Perfiles eliminados</h2><p>Puedes recuperarlos para que vuelvan a estar disponibles.</p></div><span className="deleted-count">{deletedProfiles.length}</span></header>
          {deletedError && <div className="alert error" role="alert">{deletedError}</div>}
          {deletedProfiles.length > 0 && (
            <div className="table-scroll">
              <table className="accommodations-table deleted-table details-table profile-table">
                <thead><tr><th>Usuario</th><th>Eliminado</th><th>Acciones</th></tr></thead>
                <tbody>{deletedProfiles.map(profile => (
                  <tr key={profile._id}>
                    <td><ProfileIdentity profile={profile} /></td>
                    <td className="accommodation-date">{dateLabel(profile.deletedAt)}</td>
                    <td><button className="button restore-button" type="button" onClick={() => perform(profile, 'restore', () => profileService.restore(profile._id))} disabled={pending[`${profile._id}:restore`]}>{pending[`${profile._id}:restore`] ? 'Recuperando…' : 'Recuperar perfil'}</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
