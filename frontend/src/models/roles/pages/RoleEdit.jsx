import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import RoleForm from '../features/RoleForm';
import roleService from '../services/roleService';

export default function RoleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    roleService.get(id).then((data) => { if (active) setRole(data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  async function update(data) {
    setSubmitting(true);
    setSubmitError('');
    try {
      await roleService.update(id, data);
      navigate('/roles');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  if (loading) return <Skeleton />;
  if (!role) return <ErrorState message={error || 'No se encontró el rol.'} action={<Link to="/roles">Volver a roles</Link>} />;
  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/roles"><span aria-hidden="true">←</span> Volver a roles</Link>
      <header className="editor-header"><div className="editor-mark editor-mark-edit" aria-hidden="true">✎</div><div className="editor-heading-copy"><p className="eyebrow">EDICIÓN DE ROL</p><h1>Editar rol</h1><p>Actualiza el nombre, responsabilidades y publicación.</p></div><span className="editor-mode">Editando</span></header>
      {submitError && <div className="alert error" role="alert">{submitError}</div>}
      <RoleForm initialValues={role} onSubmit={update} submitting={submitting} />
    </section>
  );
}
