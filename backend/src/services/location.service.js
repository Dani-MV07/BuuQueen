import { LocationRepository } from '../repositories/location.repository.js';
import { ResourceService } from './resource.service.js';

export class LocationService extends ResourceService {
  constructor() {
    super(new LocationRepository(), 'la ubicación', {}, {
      slugSource: (data) => `${data.city}-${data.country}`,
      slugFields: ['city', 'country']
    });
  }
}
