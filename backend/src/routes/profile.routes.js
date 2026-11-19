import { Router } from 'express';
import { z } from 'zod';
import { ProfileController } from '../controllers/profile.controller.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { profileAvatarSchema } from '../utils/profile-avatar.schema.js';

const router = Router();
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'El ID debe ser un ObjectId válido.');
const idParams = z.object({
    params: z.object({ id: objectId })
});
const userIdParams = z.object({
    params: z.object({ userId: objectId })
});
const createSchema = z.object({
    body: z.object({
        user_id: objectId,
        phone: z.string().trim().max(30).optional(),
        bio: z.string().trim().max(2000).optional(),
        avatar: profileAvatarSchema.optional()
    })
});
const updateSchema = z.object({
    ...idParams.shape,
    body: z.object({
        phone: z.string().trim().max(30).optional(),
        bio: z.string().trim().max(2000).optional(),
        avatar: profileAvatarSchema.optional()
    }).refine((body) => Object.keys(body).length > 0, 'Debe proporcionar al menos un campo para actualizar.')
});

router.get('/', ProfileController.getAll);
router.get('/deleted', ProfileController.getDeleted);
router.get('/user/:userId', validateRequest(userIdParams), ProfileController.getByUserId);
router.get('/:id', validateRequest(idParams), ProfileController.getById);
router.post('/', validateRequest(createSchema), ProfileController.create);
router.patch('/:id', validateRequest(updateSchema), ProfileController.update);
router.patch('/:id/restore', validateRequest(idParams), ProfileController.restoreDelete);
router.delete('/:id', validateRequest(idParams), ProfileController.softDelete);

export default router;
