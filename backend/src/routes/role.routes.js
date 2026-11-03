import { z } from 'zod';
import { RoleController } from '../controllers/role.controller.js';
import { createResourceRouter } from './resource.routes.js';

export default createResourceRouter(RoleController, {
  name: z.string().trim().min(1, 'El nombre es obligatorio.'),
  description: z.string().trim().max(2000, 'La descripción no puede superar los 2000 caracteres.').optional(),
  status: z.string().trim().min(1, 'El estado es obligatorio.').optional(),
  isActive: z.boolean({ error: 'isActive debe ser un valor booleano.' }).optional()
});
