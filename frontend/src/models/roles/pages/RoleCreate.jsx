import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoleForm from '../features/RoleForm';
import roleService from '../services/roleService';

export default function RoleCreate() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  async function create(data) {
    setSubmitting(true);
    setError('');
    try {
      await roleService.create(data);
      navigate('/roles');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/roles"><span aria-hidden="true">←</span> Volver a roles</Link>
      <header className="editor-header"><div className="editor-mark" aria-hidden="true">＋</div><div className="editor-heading-copy"><p className="eyebrow">NUEVO ROL</p><h1>Crear rol</h1><p>Define un nuevo rol y sus responsabilidades.</p></div><span className="editor-mode">Nuevo registro</span></header>
      {error && <div className="alert error" role="alert">{error}</div>}
      <RoleForm onSubmit={create} submitting={submitting} />
    </section>
  );
}
