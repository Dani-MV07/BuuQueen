import { z } from 'zod';
import { imageUrlsSchema, removedImageIdsSchema } from '../../../components/shared/imageUrlSchema';

export const userSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio.').max(160, 'Máximo 160 caracteres.'),
  email: z.string().trim().email('Introduce un correo electrónico válido.').max(254, 'Máximo 254 caracteres.'),
  role_id: z.string().min(1, 'Selecciona un rol.'),
  description: z.string().trim().max(2000, 'Máximo 2000 caracteres.'),
  status: z.string().trim().min(1, 'Selecciona un estado.'),
  isActive: z.boolean(),
  imageUrls: imageUrlsSchema,
  imageIdsToRemove: removedImageIdsSchema
});
