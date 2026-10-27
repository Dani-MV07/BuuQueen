import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation.middleware.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'El ID debe ser un ObjectId válido.');

export const createResourceRouter = (controller, fields) => {
  const router = Router();
  const idParams = z.object({
    params: z.object({
      id: objectId
    })
  });
  const slugParams = z.object({
    params: z.object({
      slug: z.string().trim().min(1, 'El slug es obligatorio.')
    })
  });
  const createSchema = z.object({
    body: z.object(fields)
  });
  const updateSchema = z.object({
    ...idParams.shape,
    body: z.object(
      Object.fromEntries(Object.entries(fields).map(([field, schema]) => [field, schema.optional()]))
    )
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

  router.get('/', controller.getAll);
  router.get('/deleted', controller.getDeleted);
  router.get('/slug/:slug', validateRequest(slugParams), controller.getBySlug);
  router.get('/:id', validateRequest(idParams), controller.getById);
  router.post('/', validateRequest(createSchema), controller.create);
  router.patch('/:id', validateRequest(updateSchema), controller.update);
  router.patch('/:id/is-active', validateRequest(isActiveSchema), controller.changeIsActive);
  router.patch('/:id/status', validateRequest(statusSchema), controller.changeStatus);
  router.patch('/:id/restore', validateRequest(idParams), controller.restoreDelete);
  router.delete('/:id', validateRequest(idParams), controller.softDelete);

  return router;
};
