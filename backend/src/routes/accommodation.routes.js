import { Router } from 'express';
import { z } from 'zod';
import { AccommodationController } from '../controllers/accommodation.controller.js';
import { validateRequest } from '../middlewares/validation.middleware.js';

const router = Router();

const idParams = z.object({
  params: z.object({
    id: z.string().trim().min(1, 'El ID proporcionado no es válido.')
  })
});

const accommodationFields = {
  category_id: z.string().trim().min(1, 'La categoría es obligatoria.'),
  location_id: z.string().trim().min(1, 'La ubicación es obligatoria.'),
  host_id: z.string().trim().min(1, 'El anfitrión es obligatorio.')
};

const createSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'El título es obligatorio.').max(120, 'El título no puede superar los 120 caracteres.'),
    ...accommodationFields
  })
});

const updateSchema = z.object({
  ...idParams.shape,
  body: z.object({
    title: z.string().trim().min(1, 'El título no puede estar vacío.').max(120, 'El título no puede superar los 120 caracteres.').optional(),
    ...Object.fromEntries(
      Object.entries(accommodationFields).map(([field, schema]) => [field, schema.optional()])
    )
  })
});

const slugSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1, 'El slug es obligatorio.')
  })
});

const isActiveSchema = z.object({
  ...idParams.shape,
  body: z.object({
    isActive: z.boolean({ error: 'isActive debe ser un valor booleano.' })
  })
});

const statusSchema = z.object({
  ...idParams.shape,
  body: z.object({
    status: z.string().trim().min(1, 'El estado es obligatorio.')
  })
});

router.get('/', AccommodationController.getAll);
router.get('/deleted', AccommodationController.getDeleted);
router.get('/slug/:slug', validateRequest(slugSchema), AccommodationController.getBySlug);
router.get('/:id', validateRequest(idParams), AccommodationController.getById);
router.post('/', validateRequest(createSchema), AccommodationController.create);
router.patch('/:id', validateRequest(updateSchema), AccommodationController.update);
router.patch('/:id/is-active', validateRequest(isActiveSchema), AccommodationController.changeIsActive);
router.patch('/:id/status', validateRequest(statusSchema), AccommodationController.changeStatus);
router.patch('/:id/restore', validateRequest(idParams), AccommodationController.restoreDelete);
router.delete('/:id', validateRequest(idParams), AccommodationController.softDelete);

export default router;
