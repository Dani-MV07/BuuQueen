import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import VariantForm from '../features/VariantForm';
import accommodationService from '../../accommodations/services/accommodationService';
import variantService from '../services/variantService';
import { saveResourceWithImages } from '../../../utils/saveResourceWithImages';

export default function VariantCreate() {
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    let active = true;
    accommodationService.list().then((data) => { if (active) setAccommodations(data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function create(data) {
    setSubmitting(true);
    setSubmitError('');
    try {
      await saveResourceWithImages({
        data,
        entityType: 'Variant',
        saveResource: variantService.create
      });
      navigate('/variants');
    } catch (err) {
      if (err.resourceSaved?._id) {
        navigate(`/variants/${err.resourceSaved._id}/edit`, {
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
  if (error) return <ErrorState message={error} action={<Link to="/variants">Volver a variantes</Link>} />;
  return (
    <section className="accommodation-editor">
      <Link className="back-link editor-back-link" to="/variants"><span aria-hidden="true">←</span> Volver a variantes</Link>
      <header className="editor-header"><div className="editor-mark" aria-hidden="true">＋</div><div className="editor-heading-copy"><p className="eyebrow">NUEVA VARIANTE</p><h1>Crear variante</h1><p>Configura precio, stock y capacidad de un alojamiento.</p></div><span className="editor-mode">Nuevo registro</span></header>
      {submitError && <div className="alert error" role="alert">{submitError}</div>}
      <VariantForm accommodations={accommodations} onSubmit={create} submitting={submitting} />
    </section>
  );
}
