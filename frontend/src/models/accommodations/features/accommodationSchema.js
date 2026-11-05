import { z } from 'zod';
import { imageUrlsSchema, removedImageIdsSchema } from '../../../components/shared/imageUrlSchema';

export const accommodationSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio.').max(120, 'Máximo 120 caracteres.'),
  category_id: z.string().min(1, 'Selecciona una categoría.'),
  location_id: z.string().min(1, 'Selecciona una ubicación.'),
  host_id: z.string().min(1, 'Selecciona un anfitrión.'),
  description: z.string().trim().max(2000, 'Máximo 2000 caracteres.'),
  status: z.string().trim().min(1, 'Selecciona un estado.'),
  isActive: z.boolean(),
  imageUrls: imageUrlsSchema,
  imageIdsToRemove: removedImageIdsSchema
});
