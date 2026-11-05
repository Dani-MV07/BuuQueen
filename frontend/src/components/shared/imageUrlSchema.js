import { z } from 'zod';

const isHttpUrl = value => {
  if (!value) return true;

  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

export const imageUrlsSchema = z.array(z.object({
  url: z.string().trim().refine(isHttpUrl, 'Introduce una URL HTTP o HTTPS válida.')
})).max(20, 'Puedes añadir hasta 20 imágenes por guardado.');

export const removedImageIdsSchema = z.array(z.object({
  imageId: z.string().min(1)
}));
