import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { locationSchema } from './locationSchema';

const statuses = [['active', 'Activo'], ['inactive', 'Inactivo'], ['draft', 'Borrador'], ['archived', 'Archivado']];

function getValues(location) {
  return {
    country: location?.country ?? '',
    city: location?.city ?? '',
    address: location?.address ?? '',
    latitude: location?.coordinates?.[0] ?? '',
    longitude: location?.coordinates?.[1] ?? '',
    description: location?.description ?? '',
    status: location?.status ?? 'active',
    isActive: location?.isActive !== false
  };
}

export default function LocationForm({ initialValues, onSubmit, submitting }) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: getValues(initialValues)
  });
  useEffect(() => reset(getValues(initialValues)), [initialValues, reset]);
  const isActive = watch('isActive');

  function submit(data) {
    const { latitude, longitude, ...fields } = data;
    return onSubmit({ ...fields, coordinates: [latitude, longitude] });
  }

  return (
    <form className="form-panel accommodation-form management-form" onSubmit={handleSubmit(submit)} noValidate>
      <section className="form-section">
        <div className="form-section-heading"><span className="form-section-number">01</span><div><h2>Datos de la ubicación</h2><p>Indica la dirección y las coordenadas del lugar.</p></div></div>
        <div className="form-grid">
          {[
            ['country', 'País', 'text'],
            ['city', 'Ciudad', 'text'],
            ['address', 'Dirección', 'text'],
            ['latitude', 'Latitud', 'number'],
            ['longitude', 'Longitud', 'number']
          ].map(([name, label, type]) => (
            <label key={name}><span>{label} <em>*</em></span>
              <input {...register(name, type === 'number' ? { valueAsNumber: true } : {})} type={type}
                min={name === 'latitude' ? -90 : name === 'longitude' ? -180 : undefined}
                max={name === 'latitude' ? 90 : name === 'longitude' ? 180 : undefined}
                step={type === 'number' ? 'any' : undefined}
                aria-invalid={Boolean(errors[name])} />
              {errors[name] && <small className="field-error">{errors[name].message}</small>}
            </label>
          ))}
          <label className="form-description full-width"><span>Descripción</span>
            <textarea {...register('description')} maxLength={2000} rows={4} placeholder="Detalles adicionales de la ubicación..." />
            {errors.description && <small className="field-error">{errors.description.message}</small>}
          </label>
        </div>
      </section>
      <section className="form-section publication-section">
        <div className="form-section-heading"><span className="form-section-number">02</span><div><h2>Publicación</h2><p>Configura el estado y la disponibilidad de la ubicación.</p></div></div>
        <div className="category-publication-grid">
          <label className="management-status-field"><span>Estado <em>*</em></span>
            <select {...register('status')} aria-invalid={Boolean(errors.status)}>
              {!statuses.some(([value]) => value === initialValues?.status) && initialValues?.status && <option value={initialValues.status}>Mantener estado actual: {initialValues.status}</option>}
              {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            {errors.status && <small className="field-error">{errors.status.message}</small>}
          </label>
          <label className="availability-field"><span>Disponibilidad</span><span className="availability-control">
            <input {...register('isActive')} className="availability-switch-input" type="checkbox" aria-label="Ubicación disponible" />
            <span className="availability-switch" aria-hidden="true" /><span className="availability-copy">{isActive ? 'Disponible' : 'No disponible'}</span>
          </span></label>
        </div>
      </section>
      <footer className="form-actions"><p><em>*</em> Campos obligatorios</p><div className="form-action-buttons">
        <Link className="button button-secondary" to="/locations">Cancelar</Link>
        <button className="button form-submit" disabled={submitting}><span aria-hidden="true">{submitting ? '◌' : '✓'}</span>{submitting ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Crear ubicación'}</button>
      </div></footer>
    </form>
  );
}
