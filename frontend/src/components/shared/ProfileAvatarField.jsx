import { useEffect, useRef, useState } from 'react';
import { resolveAssetUrl } from '../../services/apiService';

export default function ProfileAvatarField({ register, watch, setValue, error, disabled, initial = '?' }) {
  const avatarUrl = watch('avatar') || '';
  const fileInputRef = useRef(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [fileError, setFileError] = useState('');

  useEffect(() => setPreviewFailed(false), [avatarUrl]);

  function selectImage(event) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setFileError('Selecciona una imagen PNG, JPG, WEBP o GIF.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError('La imagen no puede superar los 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setValue('avatar', String(reader.result || ''), { shouldDirty: true, shouldValidate: true });
      setFileError('');
    };
    reader.onerror = () => setFileError('No se pudo leer la imagen seleccionada.');
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setValue('avatar', '', { shouldDirty: true, shouldValidate: true });
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="profile-photo-field full-width">
      <div className="profile-photo-preview" aria-label="Vista previa de la foto de perfil">
        {avatarUrl && !previewFailed
          ? <img src={resolveAssetUrl(avatarUrl)} alt="Vista previa de la foto de perfil" onError={() => setPreviewFailed(true)} />
          : <span aria-hidden="true">{initial || '?'}</span>}
      </div>
      <div className="profile-photo-input">
        <label>
          <span>Seleccionar foto de perfil</span>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={selectImage} aria-invalid={Boolean(error || fileError)} disabled={disabled} />
        </label>
        <input type="hidden" {...register('avatar')} />
        <p>Selecciona una imagen de hasta 2 MB. Cada perfil admite una sola foto; al elegir otra, se reemplaza la anterior.</p>
        {(fileError || error) && <small className="field-error">{fileError || error.message}</small>}
        {avatarUrl && (
          <button
            className="button button-secondary profile-photo-remove"
            type="button"
            onClick={removeImage}
            disabled={disabled}
          >
            Quitar foto
          </button>
        )}
      </div>
    </div>
  );
}
