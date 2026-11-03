import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import UserForm from '../features/UserForm';
import roleService from '../../roles/services/roleService';
import userService from '../services/userService';

export default function UserCreate() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    let active = true;
    roleService.list().then((data) => { if (active) setRoles(data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function create(data) {
    setSubmitting(true);
    setSubmitError('');
    try {
      await userService.create(data);
      navigate('/users');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  if (loading) return <Skeleton />;
  if (error) return <ErrorState message={error} action={<Link to="/users">Volver a usuarios</Link>} />;
  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/users"><span aria-hidden="true">←</span> Volver a usuarios</Link>
      <header className="editor-header"><div className="editor-mark" aria-hidden="true">＋</div><div className="editor-heading-copy"><p className="eyebrow">NUEVO USUARIO</p><h1>Crear usuario</h1><p>Registra un usuario y asigna su rol.</p></div><span className="editor-mode">Nuevo registro</span></header>
      {submitError && <div className="alert error" role="alert">{submitError}</div>}
      <UserForm roles={roles} onSubmit={create} submitting={submitting} />
    </section>
  );
}
