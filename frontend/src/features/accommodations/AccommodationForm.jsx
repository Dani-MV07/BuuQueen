import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { accommodationSchema } from './accommodationSchema';

function toFormValues(values = {}) {
  const getId = (value) => (
    value && typeof value === 'object' ? value._id ?? '' : value ?? ''
  );

  return {
    title: values.title ?? '',
    category_id: getId(values.category_id),
    location_id: getId(values.location_id),
    host_id: getId(values.host_id)
  };
}

export default function AccommodationForm({
  initialValues,
  categories,
  locations,
  hosts,
  onSubmit,
  submitLabel = 'Guardar',
  submitting = false,
  loadingOptions = false
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(accommodationSchema),
    defaultValues: toFormValues(initialValues)
  });
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
          <span>Categoría *</span>
          <select {...register('category_id')} aria-invalid={Boolean(errors.category_id)} disabled={loadingOptions}>
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          {errors.category_id && <small className="field-error">{errors.category_id.message}</small>}
        </label>
        <label>
          <span>Ubicación *</span>
          <select {...register('location_id')} aria-invalid={Boolean(errors.location_id)} disabled={loadingOptions}>
            <option value="">Selecciona una ubicación</option>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {[location.city, location.country, location.address].filter(Boolean).join(', ')}
              </option>
            ))}
          </select>
          {errors.location_id && <small className="field-error">{errors.location_id.message}</small>}
        </label>
        <label>
          <span>Anfitrión *</span>
          <select {...register('host_id')} aria-invalid={Boolean(errors.host_id)} disabled={loadingOptions}>
            <option value="">Selecciona un anfitrión</option>
            {hosts.map((host) => (
              <option key={host._id} value={host._id}>
                {host.user_id?.name || host.bio || host.slug}
              </option>
            ))}
          </select>
          {errors.host_id && <small className="field-error">{errors.host_id.message}</small>}
        </label>
      </div>
      <div className="form-actions">
        <button className="button" disabled={submitting || loadingOptions}>
          {submitting ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
