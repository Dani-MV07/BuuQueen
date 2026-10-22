import { Router } from 'express';
import { z } from 'zod';
import { ExperienceController } from '../controllers/experience.controller.js';
import { validateRequest } from '../middlewares/validation.middleware.js';

const router = Router();

const idParams = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'El ID proporcionado no es válido.')
  })
});

const experienceFields = {
  location: z.string().trim().min(1, 'La ubicación no puede estar vacía.').optional(),
  country: z.string().trim().min(1, 'El país no puede estar vacío.').optional(),
  city: z.string().trim().min(1).max(80, 'La ciudad no puede superar los 80 caracteres.'),
  price: z.preprocess(
    value => typeof value === 'string' && value.trim() === '' ? Number.NaN : value,
    z.coerce.number().finite().min(0, 'El precio debe ser 0 o superior.')
  ),
  currency: z.string().trim().regex(/^[a-z]{3}$/i, 'La moneda debe tener 3 letras.').optional(),
  duration: z.coerce.number().int().positive('La duración debe ser un entero superior a 0.').optional(),
  maxGuests: z.coerce.number().int().positive('El máximo de huéspedes debe ser un entero superior a 0.').optional(),
  coverImage: z.string().url('La imagen de portada debe ser una URL válida.').optional(),
  gallery: z.array(z.string().url('Cada imagen de la galería debe ser una URL válida.')).optional(),
  hostName: z.string().trim().min(2).max(100, 'El anfitrión debe tener entre 2 y 100 caracteres.').optional()
};

const createSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'El título es obligatorio.').max(120, 'El título no puede superar los 120 caracteres.'),
    description: z.string().trim().max(500, 'La descripción no puede superar los 500 caracteres.').optional(),
    ...experienceFields
  })
});

const updateSchema = z.object({
  ...idParams.shape,
  body: z.object({
    title: z.string().trim().min(1, 'El título no puede estar vacío.').max(120, 'El título no puede superar los 120 caracteres.').optional(),
    description: z.string().trim().max(500, 'La descripción no puede superar los 500 caracteres.').optional(),
    ...Object.fromEntries(
      Object.entries(experienceFields).map(([field, schema]) => [field, schema.optional()])
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

router.get('/', ExperienceController.getAll);
router.get('/deleted', ExperienceController.getDeleted);
router.get('/slug/:slug', validateRequest(slugSchema), ExperienceController.getBySlug);
router.get('/:id', validateRequest(idParams), ExperienceController.getById);
router.post('/', validateRequest(createSchema), ExperienceController.create);
router.patch('/:id', validateRequest(updateSchema), ExperienceController.update);
router.patch('/:id/is-active', validateRequest(isActiveSchema), ExperienceController.changeIsActive);
router.patch('/:id/status', validateRequest(statusSchema), ExperienceController.changeStatus);
router.patch('/:id/restore', validateRequest(idParams), ExperienceController.restoreDelete);
router.delete('/:id', validateRequest(idParams), ExperienceController.softDelete);

export default router;
