import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { userSchema } from './userSchema';

const statuses = [['active', 'Activo'], ['inactive', 'Inactivo'], ['draft', 'Borrador'], ['archived', 'Archivado']];

function getValues(user) {
  return {
    name: user?.name ?? '',
    email: user?.email ?? '',
    role_id: user?.role_id?._id ?? user?.role_id ?? '',
    description: user?.description ?? '',
    status: user?.status ?? 'active',
    isActive: user?.isActive !== false
  };
}

export default function UserForm({ initialValues, roles, onSubmit, submitting }) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: getValues(initialValues)
  });
  useEffect(() => reset(getValues(initialValues)), [initialValues, reset]);
  const isActive = watch('isActive');

  return (
    <form className="form-panel accommodation-form management-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className="form-section">
        <div className="form-section-heading"><span className="form-section-number">01</span><div><h2>Información del usuario</h2><p>Indica sus datos de acceso y el rol asociado.</p></div></div>
        <div className="form-grid">
          <label><span>Nombre completo <em>*</em></span><input {...register('name')} maxLength={160} placeholder="Nombre y apellidos" aria-invalid={Boolean(errors.name)} />{errors.name && <small className="field-error">{errors.name.message}</small>}</label>
          <label><span>Correo electrónico <em>*</em></span><input {...register('email')} type="email" maxLength={254} placeholder="nombre@ejemplo.com" aria-invalid={Boolean(errors.email)} />{errors.email && <small className="field-error">{errors.email.message}</small>}</label>
          <label className="full-width"><span>Rol <em>*</em></span><select {...register('role_id')} aria-invalid={Boolean(errors.role_id)}><option value="">Selecciona un rol</option>{roles.map((role) => <option key={role._id} value={role._id}>{role.name}</option>)}</select>{errors.role_id && <small className="field-error">{errors.role_id.message}</small>}</label>
          <label className="form-description full-width"><span>Descripción</span><textarea {...register('description')} maxLength={2000} rows={4} placeholder="Información adicional del usuario..." aria-invalid={Boolean(errors.description)} />{errors.description && <small className="field-error">{errors.description.message}</small>}</label>
        </div>
      </section>
      <section className="form-section publication-section">
        <div className="form-section-heading"><span className="form-section-number">02</span><div><h2>Publicación</h2><p>Configura el estado y la disponibilidad de la cuenta.</p></div></div>
        <div className="category-publication-grid">
          <label className="management-status-field"><span>Estado <em>*</em></span><select {...register('status')} aria-invalid={Boolean(errors.status)}>{!statuses.some(([value]) => value === initialValues?.status) && initialValues?.status && <option value={initialValues.status}>Mantener estado actual: {initialValues.status}</option>}{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{errors.status && <small className="field-error">{errors.status.message}</small>}</label>
          <label className="availability-field"><span>Disponibilidad</span><span className="availability-control"><input {...register('isActive')} className="availability-switch-input" type="checkbox" aria-label="Usuario disponible" /><span className="availability-switch" aria-hidden="true" /><span className="availability-copy">{isActive ? 'Disponible' : 'No disponible'}</span></span></label>
        </div>
      </section>
      <footer className="form-actions"><p><em>*</em> Campos obligatorios</p><div className="form-action-buttons"><Link className="button button-secondary" to="/users">Cancelar</Link><button className="button form-submit" disabled={submitting}><span aria-hidden="true">{submitting ? '◌' : '✓'}</span>{submitting ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Crear usuario'}</button></div></footer>
    </form>
  );
}
