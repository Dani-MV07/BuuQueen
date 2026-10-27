import { z } from 'zod';
import { CategoryController } from '../controllers/category.controller.js';
import { createResourceRouter } from './resource.routes.js';

export default createResourceRouter(CategoryController, {
  name: z.string().trim().min(1, 'El nombre es obligatorio.'),
  slug: z.string().trim().min(1, 'El slug es obligatorio.')
});
