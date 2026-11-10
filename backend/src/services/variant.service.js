import { AccommodationRepository } from '../repositories/accommodation.repository.js';
import { ResourceService } from './resource.service.js';
import { VariantRepository } from '../repositories/variant.repository.js';
import { ImageRepository } from '../repositories/image.repository.js';

export class VariantService extends ResourceService {
  constructor() {
    super(new VariantRepository(), 'la variante', {
      accommodation_id: {
        repository: new AccommodationRepository(),
        label: 'El alojamiento asociado',
        required: true
      }
    }, {
      slugSource: (data) => data.sku,
      slugFields: ['sku'],
      references: [
        { repository: new ImageRepository(), field: 'entity_id', filter: { entity_type: 'Variant' }, label: 'imágenes' }
      ]
    });
  }
}
