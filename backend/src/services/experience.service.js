import AppError from '../utils/app-error.js';
import { handleServiceError } from '../utils/service-error.js';
import { ExperienceRepository } from '../repositories/experience.repository.js';

const notFound = message => new AppError(message, 404);

export class ExperienceService {
  constructor() {
    this.repository = new ExperienceRepository();
  }

  async getAllExperiences() {
    try {
      const experiences = await this.repository.findAll();
      return experiences;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getDeletedExperiences() {
    try {
      return await this.repository.findDeleted();
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getExperienceById(id) {
    try {
      const experience = await this.repository.findById(id);
      if (!experience) {
        throw notFound('Experiencia no encontrada');
      }
      return experience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getExperienceBySlug(slug) {
    try {
      const experience = await this.repository.findBySlug(slug);
      if (!experience) {
        throw notFound('Experiencia no encontrada');
      }
      return experience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async createExperience(data) {
    try {
      const experience = await this.repository.create(data);
      return experience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async updateExperience(id, data) {
    try {
      const updatedExperience = await this.repository.update(id, data);
      if (!updatedExperience) {
        throw notFound('Experiencia no encontrada');
      }
      return updatedExperience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async changeExperienceIsActive(id, isActive) {
    try {
      if (typeof isActive !== 'boolean') {
        throw new AppError('isActive debe ser un valor booleano.', 400);
      }

      const updatedExperience = await this.repository.changeIsActive(id, isActive);
      if (!updatedExperience) {
        throw notFound('Experiencia no encontrada');
      }
      return updatedExperience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async changeExperienceStatus(id, status) {
    try {
      if (typeof status !== 'string' || !status.trim()) {
        throw new AppError('El estado es obligatorio.', 400);
      }

      const updatedExperience = await this.repository.changeStatus(id, status.trim());
      if (!updatedExperience) {
        throw notFound('Experiencia no encontrada');
      }
      return updatedExperience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async softDeleteExperience(id) {
    try {
      const deletedExperience = await this.repository.softDelete(id);
      if (!deletedExperience) {
        throw notFound('Experiencia no encontrada');
      }
      return deletedExperience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async restoreDeletedExperience(id) {
    try {
      const restoredExperience = await this.repository.restoreDelete(id);
      if (!restoredExperience) {
        throw notFound('Experiencia eliminada no encontrada');
      }
      return restoredExperience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}
