import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import UserForm from '../features/UserForm';
import roleService from '../../roles/services/roleService';
import userService from '../services/userService';

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([userService.get(id), roleService.list()]).then(([loadedUser, loadedRoles]) => {
      if (active) {
        setUser(loadedUser);
        setRoles(loadedRoles);
      }
    }).catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  async function update(data) {
    setSubmitting(true);
    setSubmitError('');
    try {
      await userService.update(id, data);
      navigate('/users');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  if (loading) return <Skeleton />;
  if (!user) return <ErrorState message={error || 'No se encontró el usuario.'} action={<Link to="/users">Volver a usuarios</Link>} />;
  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/users"><span aria-hidden="true">←</span> Volver a usuarios</Link>
      <header className="editor-header"><div className="editor-mark editor-mark-edit" aria-hidden="true">✎</div><div className="editor-heading-copy"><p className="eyebrow">EDICIÓN DE USUARIO</p><h1>Editar usuario</h1><p>Actualiza los datos y permisos del usuario.</p></div><span className="editor-mode">Editando</span></header>
      {submitError && <div className="alert error" role="alert">{submitError}</div>}
      <UserForm initialValues={user} roles={roles} onSubmit={update} submitting={submitting} />
    </section>
  );
}
