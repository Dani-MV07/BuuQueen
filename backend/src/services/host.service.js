import { HostRepository } from '../repositories/host.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ResourceService } from './resource.service.js';

export class HostService extends ResourceService {
  constructor() {
    super(new HostRepository(), 'el anfitrión', {
      user_id: { repository: new UserRepository(), label: 'El usuario asociado' }
    });
  }
}
