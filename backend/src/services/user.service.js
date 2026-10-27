import { RoleRepository } from '../repositories/role.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ResourceService } from './resource.service.js';

export class UserService extends ResourceService {
  constructor() {
    super(new UserRepository(), 'el usuario', {
      role_id: { repository: new RoleRepository(), label: 'El rol asociado' }
    });
  }
}
