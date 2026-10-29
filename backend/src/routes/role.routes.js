import { z } from 'zod';
import { RoleController } from '../controllers/role.controller.js';
import { createResourceRouter } from './resource.routes.js';

export default createResourceRouter(RoleController, {
  name: z.string().trim().min(1, 'El nombre es obligatorio.'),
  description: z.string().trim().optional()
});
