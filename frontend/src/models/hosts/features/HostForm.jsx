import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import ImageUrlsField from '../../../components/shared/ImageUrlsField';
import { hostSchema } from './hostSchema';

const statuses = [['active', 'Activo'], ['inactive', 'Inactivo'], ['draft', 'Borrador'], ['archived', 'Archivado']];

export default function HostForm({ initialValues, users, onSubmit, submitting }) {
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      user_id: initialValues?.user_id?._id ?? initialValues?.user_id ?? '',
      bio: initialValues?.bio ?? '',
      description: initialValues?.description ?? '',
      status: initialValues?.status ?? 'active',
      isActive: initialValues?.isActive !== false,
      imageUrls: [],
      imageIdsToRemove: []
    }
  });
  useEffect(() => {
    reset({
      user_id: initialValues?.user_id?._id ?? initialValues?.user_id ?? '',
      bio: initialValues?.bio ?? '',
      description: initialValues?.description ?? '',
      status: initialValues?.status ?? 'active',
      isActive: initialValues?.isActive !== false,
      imageUrls: [],
      imageIdsToRemove: []
    });
  }, [initialValues, reset]);
  const isActive = watch('isActive');

  return (
    <form className="form-panel accommodation-form management-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className="form-section">
        <div className="form-section-heading"><span className="form-section-number">01</span><div><h2>Datos del anfitrión</h2><p>Asocia un usuario y completa su perfil público.</p></div></div>
        <div className="form-grid">
          <label className="full-width"><span>Usuario asociado <em>*</em></span>
            <select {...register('user_id')} aria-invalid={Boolean(errors.user_id)}>
              <option value="">Selecciona un usuario</option>
              {users.map((user) => <option key={user._id} value={user._id}>{user.name} · {user.email}</option>)}
            </select>
            {errors.user_id && <small className="field-error">{errors.user_id.message}</small>}
          </label>
          <label className="form-description full-width"><span>Biografía</span>
            <textarea {...register('bio')} maxLength={2000} rows={4} placeholder="Breve presentación del anfitrión..." />
            {errors.bio && <small className="field-error">{errors.bio.message}</small>}
          </label>
          <label className="form-description full-width"><span>Descripción</span>
            <textarea {...register('description')} maxLength={2000} rows={4} placeholder="Información adicional del anfitrión..." />
            {errors.description && <small className="field-error">{errors.description.message}</small>}
          </label>
        </div>
      </section>
      <ImageUrlsField control={control} register={register} errors={errors} images={initialValues?.images} disabled={submitting} />
      <section className="form-section publication-section">
        <div className="form-section-heading"><span className="form-section-number">02</span><div><h2>Publicación</h2><p>Configura el estado y la disponibilidad del anfitrión.</p></div></div>
        <div className="category-publication-grid">
          <label className="management-status-field"><span>Estado <em>*</em></span>
            <select {...register('status')} aria-invalid={Boolean(errors.status)}>
              {!statuses.some(([value]) => value === initialValues?.status) && initialValues?.status && <option value={initialValues.status}>Mantener estado actual: {initialValues.status}</option>}
              {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            {errors.status && <small className="field-error">{errors.status.message}</small>}
          </label>
          <label className="availability-field"><span>Disponibilidad</span><span className="availability-control">
            <input {...register('isActive')} className="availability-switch-input" type="checkbox" aria-label="Anfitrión disponible" />
            <span className="availability-switch" aria-hidden="true" /><span className="availability-copy">{isActive ? 'Disponible' : 'No disponible'}</span>
          </span></label>
        </div>
      </section>
      <footer className="form-actions"><p><em>*</em> Campos obligatorios</p><div className="form-action-buttons">
        <Link className="button button-secondary" to="/hosts">Cancelar</Link>
        <button className="button form-submit" disabled={submitting}><span aria-hidden="true">{submitting ? '◌' : '✓'}</span>{submitting ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Crear anfitrión'}</button>
      </div></footer>
    </form>
  );
}
