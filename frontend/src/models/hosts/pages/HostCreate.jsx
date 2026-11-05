import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import HostForm from '../features/HostForm';
import hostService from '../services/hostService';
import userService from '../../users/services/userService';
import { saveResourceWithImages } from '../../../utils/saveResourceWithImages';

export default function HostCreate() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    userService.list().then((data) => {
      if (active) setUsers(data);
    }).catch((err) => {
      if (active) setError(err.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function create(data) {
    setSubmitting(true);
    setSubmitError('');
    try {
      await saveResourceWithImages({
        data,
        entityType: 'Host',
        saveResource: hostService.create
      });
      navigate('/hosts');
    } catch (err) {
      if (err.resourceSaved?._id) {
        navigate(`/hosts/${err.resourceSaved._id}/edit`, {
          state: { notice: err.message }
        });
        return;
      }
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton />;
  if (error) return <ErrorState message={error} action={<Link to="/hosts">Volver a anfitriones</Link>} />;

  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/hosts"><span aria-hidden="true">←</span> Volver a anfitriones</Link>
      <header className="editor-header"><div className="editor-mark" aria-hidden="true">＋</div><div className="editor-heading-copy"><p className="eyebrow">NUEVO ANFITRIÓN</p><h1>Crear anfitrión</h1><p>Asocia un usuario y completa los datos de su perfil.</p></div><span className="editor-mode">Nuevo registro</span></header>
      {submitError && <div className="alert error" role="alert">{submitError}</div>}
      <HostForm users={users} onSubmit={create} submitting={submitting} />
    </section>
  );
}
