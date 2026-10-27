import { AccommodationRepository } from '../repositories/accommodation.repository.js';
import { CategoryRepository } from '../repositories/category.repository.js';
import { HostRepository } from '../repositories/host.repository.js';
import { ImageRepository } from '../repositories/image.repository.js';
import { LocationRepository } from '../repositories/location.repository.js';
import { RoleRepository } from '../repositories/role.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { VariantRepository } from '../repositories/variant.repository.js';
import AppError from '../utils/app-error.js';
import { ResourceService } from './resource.service.js';

export class ImageService extends ResourceService {
  constructor() {
    super(new ImageRepository(), 'la imagen');
    this.entityRepositories = {
      Accommodation: new AccommodationRepository(),
      Category: new CategoryRepository(),
      Host: new HostRepository(),
      Location: new LocationRepository(),
      Role: new RoleRepository(),
      User: new UserRepository(),
      Variant: new VariantRepository()
    };
  }

  async validateRelations(data, current) {
    const entityType = data.entity_type ?? current?.entity_type;
    const entityId = data.entity_id ?? current?.entity_id;

    if (entityType === undefined && entityId === undefined) {
      return;
    }

    const repository = this.entityRepositories[entityType];
    if (!repository) {
      throw new AppError('El tipo de entidad de la imagen no es válido.', 400);
    }

    if (!/^[a-f\d]{24}$/i.test(String(entityId))) {
      throw new AppError('El ID de la entidad debe ser un ObjectId válido.', 422);
    }

    if (!(await repository.findById(entityId))) {
      throw new AppError('No se encontró la entidad asociada a la imagen.', 404);
    }
  }
}
