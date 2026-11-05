import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import ImageUrlsField from '../../../components/shared/ImageUrlsField';
import { accommodationSchema } from './accommodationSchema';

const statusOptions = [
  ['scheduled', 'Programado'],
  ['active', 'En curso'],
  ['completed', 'Completado'],
  ['cancelled', 'Cancelado'],
  ['published', 'Publicado']
];

function toFormValues(values = {}) {
  const getId = (value) => (
    value && typeof value === 'object' ? value._id ?? '' : value ?? ''
  );

  return {
    title: values.title ?? '',
    category_id: getId(values.category_id),
    location_id: getId(values.location_id),
    host_id: getId(values.host_id),
    description: values.description ?? '',
    status: values.status ?? 'published',
    isActive: values.isActive === false || values.isActive === 'false' ? false : true,
    imageUrls: [],
    imageIdsToRemove: []
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
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(accommodationSchema),
    defaultValues: toFormValues(initialValues)
  });
  useEffect(() => {
    reset(toFormValues(initialValues));
  }, [initialValues, reset]);
  const isActive = watch('isActive');

  return (
    <form className="form-panel accommodation-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className="form-section" aria-labelledby="details-heading">
        <div className="form-section-heading">
          <span className="form-section-number">01</span>
          <div>
            <h2 id="details-heading">Información del alojamiento</h2>
            <p>Los datos principales que identificarán tu alojamiento.</p>
          </div>
        </div>
        <div className="form-grid">
          <label className="full-width">
            <span>Nombre del alojamiento <em>*</em></span>
            <input {...register('title')} maxLength={120} placeholder="Escapada de fin de semana a Valencia" aria-invalid={Boolean(errors.title)} />
            {errors.title && <small className="field-error">{errors.title.message}</small>}
          </label>
          <label>
            <span>Categoría <em>*</em></span>
            <select {...register('category_id')} aria-invalid={Boolean(errors.category_id)} disabled={loadingOptions}>
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            {errors.category_id && <small className="field-error">{errors.category_id.message}</small>}
          </label>
          <label>
            <span>Ubicación <em>*</em></span>
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
            <span>Anfitrión <em>*</em></span>
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
        </div>
      </section>

      <section className="form-section" aria-labelledby="description-heading">
        <div className="form-section-heading">
          <span className="form-section-number">02</span>
          <div>
            <h2 id="description-heading">Descripción</h2>
            <p>Añade detalles que ayuden a presentar mejor el alojamiento.</p>
          </div>
        </div>
        <label className="form-description">
          <span>Descripción del alojamiento</span>
          <textarea
            {...register('description')}
            maxLength={2000}
            rows={5}
            placeholder="Describe el alojamiento, sus características y lo que lo hace especial..."
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description && <small className="field-error">{errors.description.message}</small>}
          <small className="field-hint">Hasta 2000 caracteres.</small>
        </label>
      </section>

      <ImageUrlsField
        control={control}
        register={register}
        errors={errors}
        images={initialValues?.images}
        disabled={submitting}
      />

      <section className="form-section publication-section" aria-labelledby="publication-heading">
        <div className="form-section-heading">
          <span className="form-section-number">03</span>
          <div>
            <h2 id="publication-heading">Publicación</h2>
            <p>Controla si el alojamiento está disponible para tus clientes.</p>
          </div>
        </div>
        <label className="availability-field">
          <span>Disponibilidad</span>
          <div className="availability-control">
            <input
              {...register('isActive')}
              className="availability-switch-input"
              type="checkbox"
              aria-label="Alojamiento disponible"
              aria-invalid={Boolean(errors.isActive)}
            />
            <span className="availability-switch" aria-hidden="true" />
            <span className="availability-copy">
              {isActive ? 'Disponible para reservar' : 'No disponible para reservar'}
            </span>
          </div>
          <small className="field-hint availability-hint">
            Desactiva esta opción para ocultarlo temporalmente de las reservas.
          </small>
          {errors.isActive && <small className="field-error">{errors.isActive.message}</small>}
        </label>
      </section>

      <footer className="form-actions">
        <p><em>*</em> Campos obligatorios</p>
        <div className="form-action-buttons">
          <Link className="button button-secondary" to="/accommodations">Cancelar</Link>
          <button className="button form-submit" disabled={submitting || loadingOptions}>
            <span aria-hidden="true">{submitting ? '◌' : '✓'}</span>
            {submitting ? 'Guardando...' : submitLabel}
          </button>
        </div>
      </footer>
    </form>
  );
}
