import { z } from 'zod';
import { imageUrlsSchema, removedImageIdsSchema } from '../../../components/shared/imageUrlSchema';

export const variantSchema = z.object({
  accommodation_id: z.string().min(1, 'Selecciona un alojamiento.'),
  sku: z.string().trim().min(1, 'El SKU es obligatorio.').max(120, 'Máximo 120 caracteres.'),
  price: z.number().finite().min(0, 'El precio no puede ser negativo.'),
  stock: z.number().int().min(0, 'El stock debe ser un entero no negativo.'),
  capacity: z.number().int().min(1, 'La capacidad debe ser un entero positivo.'),
  description: z.string().trim().max(2000, 'Máximo 2000 caracteres.'),
  status: z.string().trim().min(1, 'Selecciona un estado.'),
  isActive: z.boolean(),
  imageUrls: imageUrlsSchema,
  imageIdsToRemove: removedImageIdsSchema
});
