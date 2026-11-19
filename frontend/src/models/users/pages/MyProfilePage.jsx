import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import ErrorState from '../../../components/shared/ErrorState';
import ProfileAvatarField from '../../../components/shared/ProfileAvatarField';
import Skeleton from '../../../components/shared/Skeleton';
import { useAuth } from '../../../auth/AuthContext';
import { authApi } from '../../../services/apiService';
import { profileAvatarSchema } from '../../profiles/features/profileSchema';

const myProfileSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio.').max(160, 'Máximo 160 caracteres.'),
  email: z.string().trim().email('Introduce un correo electrónico válido.').max(254, 'Máximo 254 caracteres.'),
  phone: z.string().trim().max(30, 'Máximo 30 caracteres.'),
  bio: z.string().trim().max(2000, 'Máximo 2000 caracteres.'),
  avatar: profileAvatarSchema
});

function getValues(user, profile) {
  return {
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: profile?.phone ?? '',
    bio: profile?.bio ?? '',
    avatar: profile?.avatar ?? ''
  };
}

export default function MyProfilePage() {
  const { updateMyProfile } = useAuth();
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(myProfileSchema),
    defaultValues: getValues(null, null)
  });

  useEffect(() => {
    let active = true;
    authApi.getMyProfile()
      .then(({ user, profile }) => {
        if (!active) return;
        const nextValues = getValues(user, profile);
        setValues(nextValues);
        reset(nextValues);
      })
      .catch(error => { if (active) setLoadError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reset]);

  async function save(data) {
    setSubmitting(true);
    setSubmitError('');
    setSaved(false);
    try {
      const updated = await updateMyProfile(data);
      const nextValues = getValues(updated.user, updated.profile);
      setValues(nextValues);
      reset(nextValues);
      setSaved(true);
    } catch (error) {
      setSubmitError(error.message || 'No se pudo actualizar tu perfil.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton />;
  if (!values) return <ErrorState message={loadError || 'No se pudo cargar tu perfil.'} action={<Link to="/">Volver</Link>} />;

  return (
    <section className="accommodation-editor">
      <header className="editor-header">
        <div className="editor-mark editor-mark-edit" aria-hidden="true">♙</div>
        <div className="editor-heading-copy"><p className="eyebrow">TU CUENTA</p><h1>Mi perfil</h1><p>Edita tus datos y la foto que verán otros usuarios.</p></div>
        <span className="editor-mode">Perfil personal</span>
      </header>
      {submitError && <div className="alert error" role="alert">{submitError}</div>}
      {saved && <div className="alert success" role="status">Tus cambios se han guardado correctamente.</div>}
      <form className="form-panel management-form" onSubmit={handleSubmit(save)} noValidate>
        <section className="form-section">
          <div className="form-section-heading"><span className="form-section-number">01</span><div><h2>Datos personales</h2><p>La foto se comparte y aparece junto a tu nombre.</p></div></div>
          <div className="form-grid">
            <ProfileAvatarField
              register={register}
              watch={watch}
              setValue={setValue}
              error={errors.avatar}
              disabled={submitting}
              initial={values.name.charAt(0).toUpperCase() || '?'}
            />
            <label>
              <span>Nombre completo <em>*</em></span>
              <input {...register('name')} maxLength={160} autoComplete="name" aria-invalid={Boolean(errors.name)} />
              {errors.name && <small className="field-error">{errors.name.message}</small>}
            </label>
            <label>
              <span>Correo electrónico <em>*</em></span>
              <input {...register('email')} type="email" maxLength={254} autoComplete="email" aria-invalid={Boolean(errors.email)} />
              {errors.email && <small className="field-error">{errors.email.message}</small>}
            </label>
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
            <Link className="button button-secondary" to="/">Volver</Link>
            <button className="button form-submit" type="submit" disabled={submitting}>
              <span aria-hidden="true">{submitting ? '◌' : '✓'}</span>
              {submitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </footer>
      </form>
    </section>
  );
}
