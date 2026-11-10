import { HostRepository } from '../repositories/host.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AccommodationRepository } from '../repositories/accommodation.repository.js';
import { ImageRepository } from '../repositories/image.repository.js';
import { ResourceService } from './resource.service.js';

export class HostService extends ResourceService {
  constructor() {
    const userRepository = new UserRepository();
    super(new HostRepository(), 'el anfitrión', {
      user_id: { repository: userRepository, label: 'El usuario asociado', required: true }
    }, {
      slugSource: async (data) => (await userRepository.findById(data.user_id))?.name,
      slugFields: ['user_id'],
      references: [
        { repository: new AccommodationRepository(), field: 'host_id', label: 'alojamientos' },
        { repository: new ImageRepository(), field: 'entity_id', filter: { entity_type: 'Host' }, label: 'imágenes' }
      ]
    });
  }
}
