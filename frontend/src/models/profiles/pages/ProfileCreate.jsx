import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import userService from '../../users/services/userService';
import ProfileForm from '../features/ProfileForm';
import profileService from '../services/profileService';

export default function ProfileCreate() {
  const { refreshMyProfile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([userService.list(), profileService.list(), profileService.listDeleted()])
      .then(([allUsers, profiles, deletedProfiles]) => {
        if (!active) return;
        const existingUserIds = new Set([...profiles, ...deletedProfiles].map(profile => profile.user_id?._id || profile.user_id));
        setUsers(allUsers.filter(user => !existingUserIds.has(user._id)));
      })
      .catch(loadError => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function create(data) {
    setSubmitting(true);
    setSubmitError('');
    try {
      await profileService.create(data);
      await refreshMyProfile().catch(() => undefined);
      navigate('/profiles');
    } catch (saveError) {
      setSubmitError(saveError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton />;
  if (error) return <ErrorState message={error} action={<Link to="/profiles">Volver a perfiles</Link>} />;
  if (!users.length) return <ErrorState message="Todos los usuarios tienen un perfil activo o eliminado. Recupera un perfil eliminado antes de crear otro para ese usuario." action={<Link to="/profiles">Volver a perfiles</Link>} />;

  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/profiles"><span aria-hidden="true">←</span> Volver a perfiles</Link>
      <header className="editor-header"><div className="editor-mark" aria-hidden="true">＋</div><div className="editor-heading-copy"><p className="eyebrow">NUEVO PERFIL</p><h1>Crear perfil</h1><p>Completa la información personal de un usuario.</p></div><span className="editor-mode">Nuevo registro</span></header>
      {submitError && <div className="alert error" role="alert">{submitError}</div>}
      <ProfileForm users={users} onSubmit={create} submitting={submitting} />
    </section>
  );
}
