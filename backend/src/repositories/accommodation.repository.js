import { AccommodationModel } from '../models/accommodation.model.js';
import { handleServiceError } from '../utils/service-error.js';

const isSlugDuplicateError = error =>
  error.code === 11000 && (error.keyPattern?.slug || error.keyValue?.slug);

export class AccommodationRepository {
  async findAll() {
    try {
      return await AccommodationModel.find({ deletedAt: null }).sort({ createdAt: -1 });
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async findDeleted() {
    try {
      return await AccommodationModel.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async findById(id) {
    try {
      return await AccommodationModel.findOne({ _id: id, deletedAt: null });
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async findBySlug(slug) {
    try {
      return await AccommodationModel.findOne({ slug, deletedAt: null });
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async create(data) {
    try {
      const { slug, deletedAt, isActive, status, ...accommodationData } = data;

      for (let attempt = 0; attempt < 10; attempt += 1) {
        try {
          return await AccommodationModel.create(accommodationData);
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
          return await accommodation.save();
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

  async softDelete(id) {
    try {
      return await AccommodationModel.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $set: { deletedAt: new Date() } },
        { new: true }
      );
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async changeIsActive(id, isActive) {
    try {
      return await AccommodationModel.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $set: { isActive } },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async changeStatus(id, status) {
    try {
      return await AccommodationModel.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $set: { status } },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async restoreDelete(id) {
    try {
      return await AccommodationModel.findOneAndUpdate(
        { _id: id, deletedAt: { $ne: null } },
        { $set: { deletedAt: null } },
        { new: true }
      );
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}
