import { Router } from 'express';
import { z } from 'zod';
import { AccommodationController } from '../controllers/accommodation.controller.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authorizeRoles } from '../middlewares/authorize.middleware.js';

const router = Router();

const idParams = z.object({
  params: z.object({
    id: z.string().trim().min(1, 'El ID proporcionado no es válido.')
  })
});

const accommodationFields = {
  category_id: z.string().regex(/^[a-f\d]{24}$/i, 'El ID de categoría debe ser un ObjectId válido.'),
  location_id: z.string().regex(/^[a-f\d]{24}$/i, 'El ID de ubicación debe ser un ObjectId válido.'),
  host_id: z.string().regex(/^[a-f\d]{24}$/i, 'El ID de anfitrión debe ser un ObjectId válido.')
};

const editableFields = {
  description: z.string().trim().max(2000, 'La descripción no puede superar los 2000 caracteres.'),
  status: z.string().trim().min(1, 'El estado es obligatorio.'),
  isActive: z.boolean({ error: 'isActive debe ser un valor booleano.' })
};

const createSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'El título es obligatorio.').max(120, 'El título no puede superar los 120 caracteres.'),
    ...accommodationFields,
    ...Object.fromEntries(
      Object.entries(editableFields).map(([field, schema]) => [field, schema.optional()])
    )
  })
});

const updateSchema = z.object({
  ...idParams.shape,
  body: z.object({
    title: z.string().trim().min(1, 'El título no puede estar vacío.').max(120, 'El título no puede superar los 120 caracteres.').optional(),
    ...Object.fromEntries(
      Object.entries(accommodationFields).map(([field, schema]) => [field, schema.optional()])
    ),
    ...Object.fromEntries(
      Object.entries(editableFields).map(([field, schema]) => [field, schema.optional()])
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
router.get('/deleted', authorizeRoles('admin'), AccommodationController.getDeleted);
router.get('/slug/:slug', validateRequest(slugSchema), AccommodationController.getBySlug);
router.get('/:id', authorizeRoles('admin'), validateRequest(idParams), AccommodationController.getById);
router.post('/', authorizeRoles('admin'), validateRequest(createSchema), AccommodationController.create);
router.patch('/:id', authorizeRoles('admin'), validateRequest(updateSchema), AccommodationController.update);
router.patch('/:id/is-active', authorizeRoles('admin'), validateRequest(isActiveSchema), AccommodationController.changeIsActive);
router.patch('/:id/status', authorizeRoles('admin'), validateRequest(statusSchema), AccommodationController.changeStatus);
router.patch('/:id/restore', authorizeRoles('admin'), validateRequest(idParams), AccommodationController.restoreDelete);
router.delete('/:id', authorizeRoles('admin'), validateRequest(idParams), AccommodationController.softDelete);

export default router;
