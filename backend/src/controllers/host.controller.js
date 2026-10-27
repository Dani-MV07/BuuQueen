import { createResourceController } from './resource.controller.js';
import { HostService } from '../services/host.service.js';

export const HostController = createResourceController(new HostService());
