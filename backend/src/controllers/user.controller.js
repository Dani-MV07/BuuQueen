import { createResourceController } from './resource.controller.js';
import { UserService } from '../services/user.service.js';

export const UserController = createResourceController(new UserService());
