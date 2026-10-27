import { createResourceController } from './resource.controller.js';
import { ImageService } from '../services/image.service.js';

export const ImageController = createResourceController(new ImageService());
