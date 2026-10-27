import mongoose from 'mongoose';
import AppError from '../utils/app-error.js';
import { AccommodationRepository } from '../repositories/accommodation.repository.js';
import { CategoryRepository } from '../repositories/category.repository.js';
import { HostRepository } from '../repositories/host.repository.js';
import { LocationRepository } from '../repositories/location.repository.js';

export class AccommodationService {
  constructor() {
    this.repository = new AccommodationRepository();
    this.categoryRepository = new CategoryRepository();
    this.hostRepository = new HostRepository();
    this.locationRepository = new LocationRepository();
  }

  async getAllAccommodations() {
    return this.repository.findAll();
  }

  async getDeletedAccommodations() {
    return this.repository.findDeleted();
  }

  async getAccommodationById(id) {
    this.#validateObjectId(id);
    const accommodation = await this.repository.findById(id);

    if (!accommodation) {
      throw new AppError('Alojamiento no encontrado', 404);
    }

    return accommodation;
  }

  async getAccommodationBySlug(slug) {
    const accommodation = await this.repository.findBySlug(slug);

    if (!accommodation) {
      throw new AppError('Alojamiento no encontrado', 404);
    }

    return accommodation;
  }

  async createAccommodation(data) {
    await this.#ensureValidRelations(data);
    return this.repository.create(data);
  }

  async updateAccommodation(id, data) {
    this.#validateObjectId(id);

    const current = await this.repository.findById(id);
    if (!current) {
      throw new AppError('Alojamiento no encontrado', 404);
    }

    await this.#ensureValidRelations(data);

    const accommodation = await this.repository.update(id, data);
    if (!accommodation) {
      throw new AppError('Alojamiento no encontrado', 404);
    }

    return accommodation;
  }

  async changeAccommodationIsActive(id, isActive) {
    this.#validateObjectId(id);
    if (typeof isActive !== 'boolean') {
      throw new AppError('isActive debe ser un valor booleano.', 400);
    }

    const accommodation = await this.repository.changeIsActive(id, isActive);
    if (!accommodation) {
      throw new AppError('Alojamiento no encontrado', 404);
    }

    return accommodation;
  }

  async changeAccommodationStatus(id, status) {
    this.#validateObjectId(id);
    if (typeof status !== 'string' || !status.trim()) {
      throw new AppError('El estado es obligatorio.', 400);
    }

    const accommodation = await this.repository.changeStatus(id, status.trim());
    if (!accommodation) {
      throw new AppError('Alojamiento no encontrado', 404);
    }

    return accommodation;
  }

  async softDeleteAccommodation(id) {
    this.#validateObjectId(id);
    const accommodation = await this.repository.softDelete(id);

    if (!accommodation) {
      throw new AppError('Alojamiento no encontrado', 404);
    }

    return accommodation;
  }

  async restoreDeletedAccommodation(id) {
    this.#validateObjectId(id);
    const accommodation = await this.repository.restoreDelete(id);

    if (!accommodation) {
      throw new AppError('Alojamiento eliminado no encontrado', 404);
    }

    return accommodation;
  }

  async #ensureValidRelations(data) {
    const relations = [
      ['category_id', this.categoryRepository, 'Categoría asociada no encontrada'],
      ['location_id', this.locationRepository, 'Ubicación asociada no encontrada'],
      ['host_id', this.hostRepository, 'Anfitrión asociado no encontrado']
    ];

    for (const [field, repository, notFoundMessage] of relations) {
      if (!Object.prototype.hasOwnProperty.call(data, field)) {
        continue;
      }

      this.#validateObjectId(data[field], `El campo ${field} debe ser un ObjectId válido.`);

      const relatedDocument = await repository.findById(data[field]);
      if (!relatedDocument) {
        throw new AppError(notFoundMessage, 404);
      }
    }
  }

  #validateObjectId(id, message = 'El ID del alojamiento no es válido.') {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(message, 422);
    }
  }
}
