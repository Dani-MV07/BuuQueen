import { createResourceController } from './resource.controller.js';
import { LocationService } from '../services/location.service.js';

export const LocationController = createResourceController(new LocationService());
