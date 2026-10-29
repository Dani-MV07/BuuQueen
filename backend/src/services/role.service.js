import { RoleRepository } from '../repositories/role.repository.js';
import { ResourceService } from './resource.service.js';

export class RoleService extends ResourceService {
  constructor() {
    super(new RoleRepository(), 'el rol', {}, {
      slugSource: (data) => data.name,
      slugFields: ['name']
    });
  }
}
