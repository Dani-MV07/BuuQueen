import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import ProfileAvatarField from '../../../components/shared/ProfileAvatarField';
import { profileSchema } from './profileSchema';

function getValues(profile) {
  return {
    user_id: profile?.user_id?._id ?? profile?.user_id ?? '',
    avatar: profile?.avatar ?? '',
    phone: profile?.phone ?? '',
    bio: profile?.bio ?? ''
  };
}

export default function ProfileForm({ initialValues, users = [], onSubmit, submitting = false }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: getValues(initialValues)
  });

  useEffect(() => reset(getValues(initialValues)), [initialValues, reset]);

  const owner = initialValues?.user_id;
  const ownerName = owner?.name || users.find(user => user._id === (owner?._id || owner))?.name;

  return (
    <form className="form-panel management-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className="form-section">
        <div className="form-section-heading">
          <span className="form-section-number">01</span>
          <div><h2>Información del perfil</h2><p>Asocia el perfil a un usuario y completa sus datos.</p></div>
        </div>
        <div className="form-grid">
          {initialValues ? (
            <>
              <input type="hidden" {...register('user_id')} />
              <label className="full-width">
                <span>Usuario</span>
                <input value={ownerName || owner?.email || 'Usuario asociado'} readOnly />
              </label>
            </>
          ) : (
            <label className="full-width">
              <span>Usuario <em>*</em></span>
              <select {...register('user_id')} aria-invalid={Boolean(errors.user_id)}>
                <option value="">Selecciona un usuario</option>
                {users.map(user => <option key={user._id} value={user._id}>{user.name} · {user.email}</option>)}
              </select>
              {errors.user_id && <small className="field-error">{errors.user_id.message}</small>}
            </label>
          )}
          <ProfileAvatarField
            register={register}
            watch={watch}
            setValue={setValue}
            error={errors.avatar}
            disabled={submitting}
            initial={ownerName?.charAt(0).toUpperCase() || '?'}
          />
          <label>
            <span>Teléfono</span>
            <input {...register('phone')} type="tel" maxLength={30} autoComplete="tel" aria-invalid={Boolean(errors.phone)} />
            {errors.phone && <small className="field-error">{errors.phone.message}</small>}
          </label>
          <label className="form-description full-width">
            <span>Biografía</span>
            <textarea {...register('bio')} maxLength={2000} rows={4} aria-invalid={Boolean(errors.bio)} />
            {errors.bio && <small className="field-error">{errors.bio.message}</small>}
          </label>
        </div>
      </section>
      <footer className="form-actions">
        <p><em>*</em> Campos obligatorios</p>
        <div className="form-action-buttons">
          <Link className="button button-secondary" to="/profiles">Cancelar</Link>
          <button className="button form-submit" type="submit" disabled={submitting || (!initialValues && users.length === 0)}>
            <span aria-hidden="true">{submitting ? '◌' : '✓'}</span>
            {submitting ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Crear perfil'}
          </button>
        </div>
      </footer>
    </form>
  );
}
