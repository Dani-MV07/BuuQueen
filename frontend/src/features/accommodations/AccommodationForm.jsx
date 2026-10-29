import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { accommodationSchema } from './accommodationSchema';

function toFormValues(values = {}) {
  return {
    title: values.title ?? '',
    city: values.city ?? '',
    price: values.price == null ? '' : String(values.price),
    description: values.description ?? ''
  };
}

export default function AccommodationForm({
  initialValues,
  onSubmit,
  submitLabel = 'Guardar',
  submitting = false
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(accommodationSchema),
    defaultValues: toFormValues(initialValues)
  });
  const description = watch('description') || '';

  useEffect(() => {
    reset(toFormValues(initialValues));
  }, [initialValues, reset]);

  return (
    <form className="form-panel" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-grid">
        <label>
          <span>Nombre del alojamiento *</span>
          <input {...register('title')} maxLength={120} placeholder="Escapada de fin de semana a Valencia" aria-invalid={Boolean(errors.title)} />
          {errors.title && <small className="field-error">{errors.title.message}</small>}
        </label>
        <label>
          <span>Destino *</span>
          <input {...register('city')} maxLength={80} placeholder="Valencia" aria-invalid={Boolean(errors.city)} />
          {errors.city && <small className="field-error">{errors.city.message}</small>}
        </label>
        <label>
          <span>Precio por persona (€) *</span>
          <input {...register('price')} type="number" min="0" step="any" placeholder="45" aria-invalid={Boolean(errors.price)} />
          {errors.price && <small className="field-error">{errors.price.message}</small>}
        </label>
        <label className="full-width">
          <span>Descripción del alojamiento</span>
          <textarea {...register('description')} maxLength={500} rows="6" placeholder="Aprende a preparar la auténtica paella valenciana en una huerta local con ingredientes frescos." aria-invalid={Boolean(errors.description)} />
          <small className="counter">{description.length}/500</small>
          {errors.description && <small className="field-error">{errors.description.message}</small>}
        </label>
      </div>
      <div className="form-actions">
        <button className="button" disabled={submitting}>
          {submitting ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
