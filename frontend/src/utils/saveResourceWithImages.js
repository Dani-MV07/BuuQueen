import { addManyImages, removeImage } from '../services/imageService';

export async function saveResourceWithImages({ data, entityType, saveResource }) {
  const { imageUrls = [], imageIdsToRemove = [], ...resourceData } = data;
  const resource = await saveResource(resourceData);
  const urls = imageUrls.map(({ url }) => url.trim()).filter(Boolean);

  if (urls.length === 0 && imageIdsToRemove.length === 0) return resource;

  try {
    for (const { imageId } of imageIdsToRemove) {
      await removeImage(imageId);
    }
    if (urls.length > 0) {
      await addManyImages(entityType, resource._id, urls);
    }
  } catch (error) {
    const saveError = new Error(
      `El módulo se guardó, pero no se pudieron guardar todos los cambios de imágenes: ${error.message}`,
      { cause: error }
    );
    saveError.resourceSaved = resource;
    throw saveError;
  }

  return resource;
}
