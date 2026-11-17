import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';

const router = Router();
const loginSchema = z.object({
    body: z.object({
        email: z.string().trim().email('El correo electrónico no es válido.'),
        password: z.string().min(1, 'La contraseña es obligatoria.').max(128)
    })
});

router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/logout', authenticate, AuthController.logout);

export default router;