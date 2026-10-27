import { AccommodationRepository } from '../repositories/accommodation.repository.js';
import { ResourceService } from './resource.service.js';
import { VariantRepository } from '../repositories/variant.repository.js';

export class VariantService extends ResourceService {
  constructor() {
    super(new VariantRepository(), 'la variante', {
      accommodation_id: {
        repository: new AccommodationRepository(),
        label: 'El alojamiento asociado'
      }
    });
  }
}
