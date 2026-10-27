import { createResourceController } from './resource.controller.js';
import { CategoryService } from '../services/category.service.js';

export const CategoryController = createResourceController(new CategoryService());
