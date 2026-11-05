import { useEffect, useState } from 'react';
import { Link, useLocation as useRouteLocation, useNavigate, useParams } from 'react-router-dom';
import CategoryForm from '../features/CategoryForm';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import categoryService from '../services/categoryService';
import { saveResourceWithImages } from '../../../utils/saveResourceWithImages';

export default function CategoryEdit() {
  const { id } = useParams();
  const routeLocation = useRouteLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState(routeLocation.state?.notice ?? '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setCategory(null);
    setLoadError('');
    categoryService.get(id).then((data) => {
      if (active) setCategory(data);
    }).catch((err) => {
      if (active) setLoadError(err.message);
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [id]);

  async function update(data) {
    setSubmitting(true);
    setError('');
    try {
      await saveResourceWithImages({
        data,
        entityType: 'Category',
        saveResource: payload => categoryService.update(id, payload)
      });
      navigate('/categories');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton />;
  if (!category) {
    return (
      <ErrorState
        message={loadError || 'No se encontró la categoría.'}
        action={<Link to="/categories">Volver a categorías</Link>}
      />
    );
  }

  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/categories">
        <span aria-hidden="true">←</span> Volver a categorías
      </Link>
      <header className="editor-header">
        <div className="editor-mark editor-mark-edit" aria-hidden="true">✎</div>
        <div className="editor-heading-copy">
          <p className="eyebrow">EDICIÓN DE CATEGORÍA</p>
          <h1>Editar categoría</h1>
          <p>Actualiza la información y la publicación de esta categoría.</p>
        </div>
        <span className="editor-mode">Editando</span>
      </header>
      {error && <div className="alert error" role="alert">{error}</div>}
      <CategoryForm
        initialValues={category}
        onSubmit={update}
        submitLabel="Guardar cambios"
        submitting={submitting}
      />
    </section>
  );
}
