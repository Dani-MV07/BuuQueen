import { z } from 'zod';
import { CategoryController } from '../controllers/category.controller.js';
import { createResourceRouter } from './resource.routes.js';

export default createResourceRouter(CategoryController, {
  name: z.string().trim().min(1, 'El nombre es obligatorio.').max(120, 'El nombre no puede superar los 120 caracteres.'),
  description: z.string().trim().max(2000, 'La descripción no puede superar los 2000 caracteres.').optional(),
  status: z.string().trim().min(1, 'El estado es obligatorio.').optional(),
  isActive: z.boolean({ error: 'isActive debe ser un valor booleano.' }).optional()
});
