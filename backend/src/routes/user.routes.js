import { z } from 'zod';
import { UserController } from '../controllers/user.controller.js';
import { createResourceRouter } from './resource.routes.js';

export default createResourceRouter(UserController, {
  name: z.string().trim().min(1, 'El nombre es obligatorio.'),
  email: z.string().trim().email('El correo electrónico no es válido.'),
  role_id: z.string().regex(/^[a-f\d]{24}$/i, 'El rol debe ser un ObjectId válido.')
});
