import { LocationRepository } from '../repositories/location.repository.js';
import { ResourceService } from './resource.service.js';

export class LocationService extends ResourceService {
  constructor() {
    super(new LocationRepository(), 'la ubicación');
  }
}
