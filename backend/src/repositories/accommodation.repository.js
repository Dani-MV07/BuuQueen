import { AccommodationModel } from '../models/accommodation.model.js';
import { BaseRepository } from './base.repository.js';
import { handleServiceError } from '../utils/service-error.js';

const isSlugDuplicateError = error =>
  error.code === 11000 && (error.keyPattern?.slug || error.keyValue?.slug);

export class AccommodationRepository extends BaseRepository {
  constructor() {
    super(AccommodationModel, [
      'category_id',
      'location_id',
      {
        path: 'host_id',
        populate: { path: 'user_id', populate: { path: 'role_id' } }
      },
      'variants',
      'images'
    ]);
  }

  async create(data) {
    try {
      const { slug, deletedAt, isActive, status, ...accommodationData } = data;

      for (let attempt = 0; attempt < 10; attempt += 1) {
        try {
          const accommodation = await AccommodationModel.create(accommodationData);
          return await this.populateDocument(accommodation);
        } catch (error) {
          if (!isSlugDuplicateError(error)) {
            throw error;
          }
        }
      }

      throw new Error('No se pudo generar un slug único para el alojamiento.');
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async update(id, data) {
    try {
      const { slug, deletedAt, isActive, status, ...accommodationData } = data;
      const accommodation = await this.findById(id);

      if (!accommodation) {
        return null;
      }

      accommodation.set(accommodationData);

      for (let attempt = 0; attempt < 10; attempt += 1) {
        try {
          await accommodation.save();
          return await this.populateDocument(accommodation);
        } catch (error) {
          if (!isSlugDuplicateError(error)) {
            throw error;
          }
        }
      }

      throw new Error('No se pudo generar un slug único para el alojamiento.');
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}
