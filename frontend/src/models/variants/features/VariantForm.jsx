import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { variantSchema } from './variantSchema';

const statuses = [['available', 'Disponible'], ['unavailable', 'No disponible'], ['draft', 'Borrador'], ['archived', 'Archivado']];

function getValues(variant) {
  return {
    accommodation_id: variant?.accommodation_id?._id ?? variant?.accommodation_id ?? '',
    sku: variant?.sku ?? '',
    price: variant?.price ?? '',
    stock: variant?.stock ?? '',
    capacity: variant?.capacity ?? '',
    description: variant?.description ?? '',
    status: variant?.status ?? 'available',
    isActive: variant?.isActive !== false
  };
}

export default function VariantForm({ initialValues, accommodations, onSubmit, submitting }) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(variantSchema),
    defaultValues: getValues(initialValues)
  });
  useEffect(() => reset(getValues(initialValues)), [initialValues, reset]);
  const isActive = watch('isActive');

  return (
    <form className="form-panel accommodation-form management-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className="form-section">
        <div className="form-section-heading"><span className="form-section-number">01</span><div><h2>Datos de la variante</h2><p>Asocia la variante a un alojamiento y define sus condiciones.</p></div></div>
        <div className="form-grid">
          <label className="full-width"><span>Alojamiento <em>*</em></span><select {...register('accommodation_id')} aria-invalid={Boolean(errors.accommodation_id)}><option value="">Selecciona un alojamiento</option>{accommodations.map((accommodation) => <option key={accommodation._id} value={accommodation._id}>{accommodation.title}</option>)}</select>{errors.accommodation_id && <small className="field-error">{errors.accommodation_id.message}</small>}</label>
          <label><span>SKU <em>*</em></span><input {...register('sku')} maxLength={120} placeholder="SKU-001" aria-invalid={Boolean(errors.sku)} />{errors.sku && <small className="field-error">{errors.sku.message}</small>}</label>
          <label><span>Precio <em>*</em></span><input {...register('price', { valueAsNumber: true })} type="number" min="0" step="0.01" aria-invalid={Boolean(errors.price)} />{errors.price && <small className="field-error">{errors.price.message}</small>}</label>
          <label><span>Stock <em>*</em></span><input {...register('stock', { valueAsNumber: true })} type="number" min="0" step="1" aria-invalid={Boolean(errors.stock)} />{errors.stock && <small className="field-error">{errors.stock.message}</small>}</label>
          <label><span>Capacidad <em>*</em></span><input {...register('capacity', { valueAsNumber: true })} type="number" min="1" step="1" aria-invalid={Boolean(errors.capacity)} />{errors.capacity && <small className="field-error">{errors.capacity.message}</small>}</label>
          <label className="form-description full-width"><span>Descripción</span><textarea {...register('description')} maxLength={2000} rows={4} placeholder="Detalles de esta variante..." aria-invalid={Boolean(errors.description)} />{errors.description && <small className="field-error">{errors.description.message}</small>}</label>
        </div>
      </section>
      <section className="form-section publication-section">
        <div className="form-section-heading"><span className="form-section-number">02</span><div><h2>Publicación</h2><p>Configura el estado y la disponibilidad de la variante.</p></div></div>
        <div className="category-publication-grid">
          <label className="management-status-field"><span>Estado <em>*</em></span><select {...register('status')} aria-invalid={Boolean(errors.status)}>{!statuses.some(([value]) => value === initialValues?.status) && initialValues?.status && <option value={initialValues.status}>Mantener estado actual: {initialValues.status}</option>}{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{errors.status && <small className="field-error">{errors.status.message}</small>}</label>
          <label className="availability-field"><span>Disponibilidad</span><span className="availability-control"><input {...register('isActive')} className="availability-switch-input" type="checkbox" aria-label="Variante disponible" /><span className="availability-switch" aria-hidden="true" /><span className="availability-copy">{isActive ? 'Disponible' : 'No disponible'}</span></span></label>
        </div>
      </section>
      <footer className="form-actions"><p><em>*</em> Campos obligatorios</p><div className="form-action-buttons"><Link className="button button-secondary" to="/variants">Cancelar</Link><button className="button form-submit" disabled={submitting}><span aria-hidden="true">{submitting ? '◌' : '✓'}</span>{submitting ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Crear variante'}</button></div></footer>
    </form>
  );
}
