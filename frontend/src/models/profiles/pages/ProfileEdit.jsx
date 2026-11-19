import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import ProfileForm from '../features/ProfileForm';
import profileService from '../services/profileService';

export default function ProfileEdit() {
  const { refreshMyProfile } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    profileService.get(id)
      .then(result => { if (active) setProfile(result); })
      .catch(loadError => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  async function update(data) {
    setSubmitting(true);
    setSubmitError('');
    const { user_id, ...profileData } = data;
    try {
      await profileService.update(id, profileData);
      await refreshMyProfile().catch(() => undefined);
      navigate('/profiles');
    } catch (saveError) {
      setSubmitError(saveError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton />;
  if (!profile) return <ErrorState message={error || 'No se encontró el perfil.'} action={<Link to="/profiles">Volver a perfiles</Link>} />;

  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/profiles"><span aria-hidden="true">←</span> Volver a perfiles</Link>
      <header className="editor-header"><div className="editor-mark editor-mark-edit" aria-hidden="true">✎</div><div className="editor-heading-copy"><p className="eyebrow">EDICIÓN DE PERFIL</p><h1>Editar perfil</h1><p>Actualiza la foto y los datos personales del usuario.</p></div><span className="editor-mode">Editando</span></header>
      {submitError && <div className="alert error" role="alert">{submitError}</div>}
      <ProfileForm initialValues={profile} onSubmit={update} submitting={submitting} />
    </section>
  );
}
