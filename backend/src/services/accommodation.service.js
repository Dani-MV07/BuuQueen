import { AccommodationRepository } from '../repositories/accommodation.repository.js';
import { CategoryRepository } from '../repositories/category.repository.js';
import { HostRepository } from '../repositories/host.repository.js';
import { LocationRepository } from '../repositories/location.repository.js';
import { ResourceService } from './resource.service.js';

export class AccommodationService extends ResourceService {
  constructor() {
    super(
      new AccommodationRepository(),
      'el alojamiento',
      {
        category_id: {
          repository: new CategoryRepository(),
          label: 'La categoría asociada',
          required: true
        },
        location_id: {
          repository: new LocationRepository(),
          label: 'La ubicación asociada',
          required: true
        },
        host_id: {
          repository: new HostRepository(),
          label: 'El anfitrión asociado',
          required: true
        }
      },
      { slugSource: (data) => data.title, slugFields: ['title'] }
    );
  }

  async getAllAccommodations(filters) {
    return this.getAll(filters);
  }

  async getDeletedAccommodations() {
    return this.getDeleted();
  }

  async getAccommodationById(id) {
    return this.getById(id);
  }

  async getAccommodationBySlug(slug) {
    return this.getBySlug(slug);
  }

  async createAccommodation(data) {
    return this.create(data);
  }

  async updateAccommodation(id, data) {
    return this.update(id, data);
  }

  async changeAccommodationIsActive(id, isActive) {
    return this.changeIsActive(id, isActive);
  }

  async changeAccommodationStatus(id, status) {
    return this.changeStatus(id, status);
  }

  async softDeleteAccommodation(id) {
    return this.softDelete(id);
  }

  async restoreDeletedAccommodation(id) {
    return this.restoreDelete(id);
  }
}
