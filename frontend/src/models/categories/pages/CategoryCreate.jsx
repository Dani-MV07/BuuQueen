import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryForm from '../features/CategoryForm';
import ErrorState from '../../../components/shared/ErrorState';
import categoryService from '../services/categoryService';
import { saveResourceWithImages } from '../../../utils/saveResourceWithImages';

export default function CategoryCreate() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function create(data) {
    setSubmitting(true);
    setError('');
    try {
      await saveResourceWithImages({
        data,
        entityType: 'Category',
        saveResource: categoryService.create
      });
      navigate('/categories');
    } catch (err) {
      if (err.resourceSaved?._id) {
        navigate(`/categories/${err.resourceSaved._id}/edit`, {
          state: { notice: err.message }
        });
        return;
      }
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
