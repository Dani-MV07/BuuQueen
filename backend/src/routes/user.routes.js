import { z } from 'zod';
import { UserController } from '../controllers/user.controller.js';
import { createResourceRouter } from './resource.routes.js';

const router = createResourceRouter(UserController, {
  name: z.string().trim().min(1, 'El nombre es obligatorio.'),
  email: z.string().trim().email('El correo electrónico no es válido.'),
  role_id: z.string().regex(/^[a-f\d]{24}$/i, 'El rol debe ser un ObjectId válido.'),
  description: z.string().trim().max(2000, 'La descripción no puede superar los 2000 caracteres.').optional(),
  status: z.string().trim().min(1, 'El estado es obligatorio.').optional(),
  isActive: z.boolean({ error: 'isActive debe ser un valor booleano.' }).optional()
}, {
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.').max(128).optional()
});

export default router;
