import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryForm from '../features/categories/CategoryForm';
import ErrorState from '../components/shared/ErrorState';
import categoryService from '../services/categoryService';

export default function CategoryCreate() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function create(data) {
    setSubmitting(true);
    setError('');
    try {
      await categoryService.create(data);
      navigate('/categories');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/categories">
        <span aria-hidden="true">←</span> Volver a categorías
      </Link>
      <header className="editor-header">
        <div className="editor-mark" aria-hidden="true">＋</div>
        <div className="editor-heading-copy">
          <p className="eyebrow">NUEVA CATEGORÍA</p>
          <h1>Crear categoría</h1>
          <p>Añade una nueva categoría para organizar los alojamientos.</p>
        </div>
        <span className="editor-mode">Nuevo registro</span>
      </header>
      {error && <div className="alert error" role="alert">{error}</div>}
      <CategoryForm
        onSubmit={create}
        submitLabel="Crear categoría"
        submitting={submitting}
      />
    </section>
  );
}
