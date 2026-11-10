import { LocationRepository } from '../repositories/location.repository.js';
import { AccommodationRepository } from '../repositories/accommodation.repository.js';
import { ImageRepository } from '../repositories/image.repository.js';
import { ResourceService } from './resource.service.js';

export class LocationService extends ResourceService {
  constructor() {
    super(new LocationRepository(), 'la ubicación', {}, {
      slugSource: (data) => `${data.city}-${data.country}`,
      slugFields: ['city', 'country'],
      references: [
        { repository: new AccommodationRepository(), field: 'location_id', label: 'alojamientos' },
        { repository: new ImageRepository(), field: 'entity_id', filter: { entity_type: 'Location' }, label: 'imágenes' }
      ]
    });
  }
}
