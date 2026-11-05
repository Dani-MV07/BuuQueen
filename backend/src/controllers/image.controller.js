import { createResourceController } from './resource.controller.js';
import { ImageService } from '../services/image.service.js';

const service = new ImageService();
const resourceController = createResourceController(service);

export const ImageController = {
  ...resourceController,
  createMany: async (req, res, next) => {
    try {
      res.status(201).json(await service.createMany(req.body));
    } catch (error) {
      next(error);
    }
  }
};
