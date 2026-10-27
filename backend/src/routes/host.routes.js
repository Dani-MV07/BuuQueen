import { z } from 'zod';
import { HostController } from '../controllers/host.controller.js';
import { createResourceRouter } from './resource.routes.js';

export default createResourceRouter(HostController, {
  user_id: z.string().regex(/^[a-f\d]{24}$/i, 'El usuario debe ser un ObjectId válido.'),
  bio: z.string().trim().optional(),
  slug: z.string().trim().min(1, 'El slug es obligatorio.')
});
