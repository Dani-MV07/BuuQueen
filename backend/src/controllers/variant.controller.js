import { createResourceController } from './resource.controller.js';
import { VariantService } from '../services/variant.service.js';

export const VariantController = createResourceController(new VariantService());
