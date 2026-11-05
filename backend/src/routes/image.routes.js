import { Router } from 'express';
import { z } from 'zod';
import { ImageController } from '../controllers/image.controller.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { createResourceRouter } from './resource.routes.js';

const entityType = z.enum(['Accommodation', 'Category', 'Host', 'Location', 'User', 'Variant']);
const entityId = z.string().regex(/^[a-f\d]{24}$/i, 'El ID de la entidad debe ser un ObjectId valido.');
const imageUrl = z.string()
  .trim()
  .url('La URL de la imagen debe ser valida.')
  .refine(value => {
    try {
      return ['http:', 'https:'].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, 'La URL de la imagen debe usar HTTP o HTTPS.');

const router = Router();

router.post('/bulk', validateRequest(z.object({
  body: z.object({
    entity_type: entityType,
    entity_id: entityId,
    urls: z.array(imageUrl)
      .min(1, 'Debes proporcionar al menos una URL.')
      .max(20, 'No se pueden anadir mas de 20 imagenes por peticion.')
  })
})), ImageController.createMany);

router.use('/', createResourceRouter(ImageController, {
  entity_type: entityType,
  entity_id: entityId,
  url_image: imageUrl
}));

export default router;
