import { useEffect, useState } from 'react';
import { Link, useLocation as useRouteLocation, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import HostForm from '../features/HostForm';
import hostService from '../services/hostService';
import userService from '../../users/services/userService';
import { saveResourceWithImages } from '../../../utils/saveResourceWithImages';

export default function HostEdit() {
  const { id } = useParams();
  const routeLocation = useRouteLocation();
  const navigate = useNavigate();
  const [host, setHost] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState(routeLocation.state?.notice ?? '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([hostService.get(id), userService.list()]).then(([loadedHost, loadedUsers]) => {
      if (active) {
        setHost(loadedHost);
        setUsers(loadedUsers);
      }
    }).catch((err) => {
      if (active) setError(err.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [id]);

  async function update(data) {
    setSubmitting(true);
    setSubmitError('');
    try {
      await saveResourceWithImages({
        data,
        entityType: 'Host',
        saveResource: payload => hostService.update(id, payload)
      });
      navigate('/hosts');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton />;
  if (!host) return <ErrorState message={error || 'No se encontró el anfitrión.'} action={<Link to="/hosts">Volver a anfitriones</Link>} />;

  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/hosts"><span aria-hidden="true">←</span> Volver a anfitriones</Link>
      <header className="editor-header"><div className="editor-mark editor-mark-edit" aria-hidden="true">✎</div><div className="editor-heading-copy"><p className="eyebrow">EDICIÓN DE ANFITRIÓN</p><h1>Editar anfitrión</h1><p>Actualiza el perfil y la disponibilidad del anfitrión.</p></div><span className="editor-mode">Editando</span></header>
      {submitError && <div className="alert error" role="alert">{submitError}</div>}
      <HostForm initialValues={host} users={users} onSubmit={update} submitting={submitting} />
    </section>
  );
}
