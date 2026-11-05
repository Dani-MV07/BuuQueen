import { request } from './api';
import { normalizeError } from '../utils/errorHandler';

export async function addManyImages(entityType, entityId, urls) {
  try {
    return await request('/images/bulk', {
      method: 'POST',
      body: JSON.stringify({
        entity_type: entityType,
        entity_id: entityId,
        urls
      })
    });
  } catch (error) {
    throw normalizeError(error, 'No se pudieron guardar las imágenes.');
  }
}

export async function removeImage(imageId) {
  try {
    return await request(`/images/${imageId}`, { method: 'DELETE' });
  } catch (error) {
    throw normalizeError(error, 'No se pudo quitar la imagen.');
  }
}
