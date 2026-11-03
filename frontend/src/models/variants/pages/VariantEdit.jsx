import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import VariantForm from '../features/VariantForm';
import accommodationService from '../../accommodations/services/accommodationService';
import variantService from '../services/variantService';

export default function VariantEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [variant, setVariant] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([variantService.get(id), accommodationService.list()]).then(([loadedVariant, loadedAccommodations]) => {
      if (active) {
        setVariant(loadedVariant);
        setAccommodations(loadedAccommodations);
      }
    }).catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  async function update(data) {
    setSubmitting(true);
    setSubmitError('');
    try {
      await variantService.update(id, data);
      navigate('/variants');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  if (loading) return <Skeleton />;
  if (!variant) return <ErrorState message={error || 'No se encontró la variante.'} action={<Link to="/variants">Volver a variantes</Link>} />;
  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/variants"><span aria-hidden="true">←</span> Volver a variantes</Link>
      <header className="editor-header"><div className="editor-mark editor-mark-edit" aria-hidden="true">✎</div><div className="editor-heading-copy"><p className="eyebrow">EDICIÓN DE VARIANTE</p><h1>Editar variante</h1><p>Actualiza las condiciones de esta variante.</p></div><span className="editor-mode">Editando</span></header>
      {submitError && <div className="alert error" role="alert">{submitError}</div>}
      <VariantForm initialValues={variant} accommodations={accommodations} onSubmit={update} submitting={submitting} />
    </section>
  );
}
