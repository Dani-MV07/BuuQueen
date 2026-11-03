import { z } from 'zod';
import { HostController } from '../controllers/host.controller.js';
import { createResourceRouter } from './resource.routes.js';

export default createResourceRouter(HostController, {
  user_id: z.string().regex(/^[a-f\d]{24}$/i, 'El usuario debe ser un ObjectId válido.'),
  bio: z.string().trim().optional(),
  description: z.string().trim().max(2000, 'La descripción no puede superar los 2000 caracteres.').optional(),
  status: z.string().trim().min(1, 'El estado es obligatorio.').optional(),
  isActive: z.boolean({ error: 'isActive debe ser un valor booleano.' }).optional()
});
