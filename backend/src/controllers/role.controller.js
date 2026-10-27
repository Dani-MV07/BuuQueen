import { createResourceController } from './resource.controller.js';
import { RoleService } from '../services/role.service.js';

export const RoleController = createResourceController(new RoleService());
