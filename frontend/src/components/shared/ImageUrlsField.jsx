import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';

function isHttpUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export default function ImageUrlsField({
  control,
  register,
  errors,
  images = [],
  disabled = false
}) {
  const [draftUrl, setDraftUrl] = useState('');
  const [draftError, setDraftError] = useState('');
  const {
    fields: newImages,
    append: appendImage,
    remove: removeNewImage,
    replace: replaceNewImages
  } = useFieldArray({ control, name: 'imageUrls' });
  const {
    fields: removedImages,
    append: markImageForRemoval,
    remove: unmarkImageForRemoval,
    replace: replaceRemovedImages
  } = useFieldArray({ control, name: 'imageIdsToRemove' });

  const removedImageIds = new Set(removedImages.map(image => image.imageId));
  const savedImages = images.filter(image => image?._id && !removedImageIds.has(image._id));
  const galleryItems = [
    ...savedImages.map(image => ({
      key: image._id,
      url: image.url_image,
      savedId: image._id
    })),
    ...newImages.map((image, index) => ({
      key: image.id,
      url: image.url,
      newIndex: index
    }))
  ];

  function addImage() {
    const url = draftUrl.trim();
    if (!isHttpUrl(url)) {
      setDraftError('Introduce una URL de imagen HTTP o HTTPS válida.');
      return;
    }
    if (newImages.length >= 20) {
      setDraftError('Puedes añadir hasta 20 imágenes nuevas por guardado.');
      return;
    }

    appendImage({ url });
    setDraftUrl('');
    setDraftError('');
  }

  function removeImage(item) {
    if (item.savedId) {
      markImageForRemoval({ imageId: item.savedId });
    } else {
      removeNewImage(item.newIndex);
    }
  }

  function removeAllImages() {
    replaceNewImages([]);
    replaceRemovedImages(images
      .filter(image => image?._id)
      .map(image => ({ imageId: image._id })));
    setDraftUrl('');
    setDraftError('');
  }

  function undoImageRemoval(id) {
    const index = removedImages.findIndex(image => image.imageId === id);
    if (index >= 0) unmarkImageForRemoval(index);
  }

  return (
    <section className="form-section image-url-section" aria-labelledby="image-urls-heading">
      <div className="form-section-heading image-url-heading">
        <div>
          <h2 id="image-urls-heading">Galería de imágenes</h2>
          <p>Añade imágenes con URLs directas. Los cambios se guardan al enviar el formulario.</p>
        </div>
      </div>

      {galleryItems.length > 0 && (
        <div className="image-url-gallery">
          {galleryItems.map((item, index) => (
            <article className="image-url-card" key={item.key}>
              <a
                className="image-url-preview"
                href={item.url}
                target="_blank"
                rel="noreferrer"
                title="Abrir imagen en una pestaña nueva"
              >
                <img src={item.url} alt={`Imagen ${index + 1}`} loading="lazy" referrerPolicy="no-referrer" />
              </a>
              <strong>URL de imagen {index + 1}</strong>
              <input
                className="image-url-readonly"
                value={item.url}
                readOnly
                aria-label={`URL de imagen ${index + 1}`}
              />
              <button
                className="button button-secondary image-url-remove"
                type="button"
                onClick={() => removeImage(item)}
                disabled={disabled}
              >
                Quitar imagen {index + 1}
              </button>
            </article>
          ))}
        </div>
      )}

      {removedImages.length > 0 && (
        <div className="image-url-undo-list" aria-live="polite">
          <div className="image-url-undo-heading">
            <strong>Imágenes pendientes de quitar</strong>
            <span>Se quitarán al guardar los cambios.</span>
          </div>
          <div className="image-url-removed-items">
            {removedImages.map(image => {
              const savedImage = images.find(current => current?._id === image.imageId);
              if (!savedImage) return null;
              const imageNumber = images.findIndex(current => current?._id === image.imageId) + 1;
              return (
                <div className="image-url-removed-item" key={image.imageId}>
                  <img
                    className="image-url-removed-preview"
                    src={savedImage.url_image}
                    alt=""
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <span className="image-url-removed-copy">
                    <strong>Imagen {imageNumber}</strong>
                    <small>Marcada para quitar</small>
                  </span>
                  <button
                    className="button button-secondary image-url-restore"
                    type="button"
                    onClick={() => undoImageRemoval(image.imageId)}
                    disabled={disabled}
                    aria-label={`Restaurar imagen ${imageNumber}`}
                  >
                    Restaurar imagen
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="image-url-add-row">
        <label className="image-url-input">
          <span>Añadir imagen por URL</span>
          <input
            value={draftUrl}
            onChange={event => {
              setDraftUrl(event.target.value);
              if (draftError) setDraftError('');
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addImage();
              }
            }}
            type="url"
            inputMode="url"
            placeholder="https://images.unsplash.com/..."
            aria-invalid={Boolean(draftError)}
            disabled={disabled}
          />
          {draftError && <small className="field-error">{draftError}</small>}
        </label>
        <button
          className="button image-url-submit"
          type="button"
          onClick={addImage}
          disabled={disabled || !draftUrl.trim()}
        >
          Añadir imagen
        </button>
      </div>

      {errors?.imageUrls?.message && <small className="field-error">{errors.imageUrls.message}</small>}
      {errors?.imageIdsToRemove?.message && <small className="field-error">{errors.imageIdsToRemove.message}</small>}

      {galleryItems.length > 0 && (
        <button
          className="button button-secondary image-url-remove-all"
          type="button"
          onClick={removeAllImages}
          disabled={disabled}
        >
          Quitar todas las imágenes
        </button>
      )}

      {newImages.map((image, index) => (
        <input
          key={image.id}
          type="hidden"
          {...register(`imageUrls.${index}.url`)}
        />
      ))}
      {removedImages.map((image, index) => (
        <input
          key={image.id}
          type="hidden"
          {...register(`imageIdsToRemove.${index}.imageId`)}
        />
      ))}
    </section>
  );
}
