import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { profileAvatarSchema } from '../utils/profile-avatar.schema.js';

const router = Router();
const loginSchema = z.object({
    body: z.object({
        email: z.string().trim().email('El correo electrónico no es válido.'),
        password: z.string().min(1, 'La contraseña es obligatoria.').max(128)
    })
});
const myProfileSchema = z.object({
    body: z.object({
        name: z.string().trim().min(1, 'El nombre es obligatorio.').max(160).optional(),
        email: z.string().trim().email('El correo electrónico no es válido.').max(254).optional(),
        phone: z.string().trim().max(30).optional(),
        bio: z.string().trim().max(2000).optional(),
        avatar: profileAvatarSchema.optional()
    }).strict().refine((body) => Object.keys(body).length > 0, 'Debe proporcionar al menos un campo para actualizar.')
});

router.post('/login', validateRequest(loginSchema), AuthController.login);
router.get('/me/profile', authenticate, AuthController.getMyProfile);
router.patch('/me/profile', authenticate, validateRequest(myProfileSchema), AuthController.updateMyProfile);
router.post('/logout', authenticate, AuthController.logout);

export default router;
