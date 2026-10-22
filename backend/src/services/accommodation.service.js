import AppError from '../utils/app-error.js';
import { handleServiceError } from '../utils/service-error.js';
import { AccommodationRepository } from '../repositories/accommodation.repository.js';

const notFound = message => new AppError(message, 404);

export class AccommodationService {
  constructor() {
    this.repository = new AccommodationRepository();
  }

  async getAllAccommodations() {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getDeletedAccommodations() {
    try {
      return await this.repository.findDeleted();
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getAccommodationById(id) {
    try {
      const accommodation = await this.repository.findById(id);
      if (!accommodation) {
        throw notFound('Alojamiento no encontrado');
      }
      return accommodation;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getAccommodationBySlug(slug) {
    try {
      const accommodation = await this.repository.findBySlug(slug);
      if (!accommodation) {
        throw notFound('Alojamiento no encontrado');
      }
      return accommodation;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async createAccommodation(data) {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async updateAccommodation(id, data) {
    try {
      const accommodation = await this.repository.update(id, data);
      if (!accommodation) {
        throw notFound('Alojamiento no encontrado');
      }
      return accommodation;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async changeAccommodationIsActive(id, isActive) {
    try {
      if (typeof isActive !== 'boolean') {
        throw new AppError('isActive debe ser un valor booleano.', 400);
      }

      const accommodation = await this.repository.changeIsActive(id, isActive);
      if (!accommodation) {
        throw notFound('Alojamiento no encontrado');
      }
      return accommodation;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async changeAccommodationStatus(id, status) {
    try {
      if (typeof status !== 'string' || !status.trim()) {
        throw new AppError('El estado es obligatorio.', 400);
      }

      const accommodation = await this.repository.changeStatus(id, status.trim());
      if (!accommodation) {
        throw notFound('Alojamiento no encontrado');
      }
      return accommodation;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async softDeleteAccommodation(id) {
    try {
      const accommodation = await this.repository.softDelete(id);
      if (!accommodation) {
        throw notFound('Alojamiento no encontrado');
      }
      return accommodation;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async restoreDeletedAccommodation(id) {
    try {
      const accommodation = await this.repository.restoreDelete(id);
      if (!accommodation) {
        throw notFound('Alojamiento eliminado no encontrado');
      }
      return accommodation;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}
