import { z } from 'zod';
import { ImageController } from '../controllers/image.controller.js';
import { createResourceRouter } from './resource.routes.js';

export default createResourceRouter(ImageController, {
  entity_type: z.enum(['Accommodation', 'Category', 'Host', 'Location', 'Role', 'User', 'Variant']),
  entity_id: z.string().regex(/^[a-f\d]{24}$/i, 'La entidad debe tener un ObjectId válido.'),
  url_image: z.string().trim().min(1, 'La URL de la imagen es obligatoria.')
});
