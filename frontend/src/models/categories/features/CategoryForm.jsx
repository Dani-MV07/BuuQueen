import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import ImageUrlsField from '../../../components/shared/ImageUrlsField';
import { categorySchema } from './categorySchema';

const statusOptions = [
  ['active', 'Activa'],
  ['draft', 'Borrador'],
  ['archived', 'Archivada'],
  ['inactive', 'Inactiva']
];

function toFormValues(values = {}) {
  return {
    name: values.name ?? '',
    description: values.description ?? '',
    status: values.status ?? 'active',
    isActive: values.isActive === false || values.isActive === 'false' ? false : true,
    imageUrls: [],
    imageIdsToRemove: []
  };
}

export default function CategoryForm({
  initialValues,
  onSubmit,
  submitLabel = 'Guardar',
  submitting = false
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: toFormValues(initialValues)
  });

  useEffect(() => {
    reset(toFormValues(initialValues));
  }, [initialValues, reset]);

  const isActive = watch('isActive');

  return (
    <form className="form-panel accommodation-form category-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className="form-section" aria-labelledby="category-details-heading">
        <div className="form-section-heading">
          <span className="form-section-number">01</span>
          <div>
            <h2 id="category-details-heading">Información de la categoría</h2>
            <p>Define el nombre y la descripción que verán los usuarios.</p>
          </div>
        </div>
        <div className="form-grid">
          <label className="full-width">
            <span>Nombre de la categoría <em>*</em></span>
            <input
              {...register('name')}
              maxLength={120}
              placeholder="Por ejemplo, Hotel"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <small className="field-error">{errors.name.message}</small>}
          </label>
          <label className="form-description full-width">
            <span>Descripción</span>
            <textarea
              {...register('description')}
              maxLength={2000}
              rows={5}
              placeholder="Describe qué tipo de alojamientos pertenecen a esta categoría..."
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && <small className="field-error">{errors.description.message}</small>}
            <small className="field-hint">Hasta 2000 caracteres.</small>
          </label>
        </div>
      </section>

      <ImageUrlsField
        control={control}
        register={register}
        errors={errors}
        images={initialValues?.images}
        disabled={submitting}
      />

      <section className="form-section publication-section" aria-labelledby="category-publication-heading">
        <div className="form-section-heading">
          <span className="form-section-number">02</span>
          <div>
            <h2 id="category-publication-heading">Publicación</h2>
            <p>Configura el estado y la disponibilidad de esta categoría.</p>
          </div>
        </div>
        <div className="category-publication-grid">
          <label>
            <span>Estado <em>*</em></span>
            <select {...register('status')} aria-invalid={Boolean(errors.status)}>
              {!statusOptions.some(([value]) => value === initialValues?.status)
                && initialValues?.status
                && <option value={initialValues.status}>Mantener estado actual: {initialValues.status}</option>}
              {statusOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.status && <small className="field-error">{errors.status.message}</small>}
          </label>
          <label className="availability-field">
            <span>Disponibilidad</span>
            <span className="availability-control">
              <input
                {...register('isActive')}
                className="availability-switch-input"
                type="checkbox"
                aria-label="Categoría disponible"
                aria-invalid={Boolean(errors.isActive)}
              />
              <span className="availability-switch" aria-hidden="true" />
              <span className="availability-copy">
                {isActive ? 'Disponible para usar' : 'No disponible'}
              </span>
            </span>
            {errors.isActive && <small className="field-error">{errors.isActive.message}</small>}
          </label>
        </div>
      </section>

      <footer className="form-actions">
        <p><em>*</em> Campos obligatorios</p>
        <div className="form-action-buttons">
          <Link className="button button-secondary" to="/categories">Cancelar</Link>
          <button className="button form-submit" disabled={submitting}>
            <span aria-hidden="true">{submitting ? '◌' : '✓'}</span>
            {submitting ? 'Guardando...' : submitLabel}
          </button>
        </div>
      </footer>
    </form>
  );
}
