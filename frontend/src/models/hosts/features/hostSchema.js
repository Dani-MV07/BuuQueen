import { z } from 'zod';
import { imageUrlsSchema, removedImageIdsSchema } from '../../../components/shared/imageUrlSchema';

export const hostSchema = z.object({
  user_id: z.string().min(1, 'Selecciona un usuario.'),
  bio: z.string().trim().max(2000, 'Máximo 2000 caracteres.'),
  description: z.string().trim().max(2000, 'Máximo 2000 caracteres.'),
  status: z.string().trim().min(1, 'Selecciona un estado.'),
  isActive: z.boolean(),
  imageUrls: imageUrlsSchema,
  imageIdsToRemove: removedImageIdsSchema
});
