import { ExperienceModel } from '../models/experience.model.js';
import { handleServiceError } from '../utils/service-error.js';

const isSlugDuplicateError = error =>
  error.code === 11000 && (error.keyPattern?.slug || error.keyValue?.slug);

export class ExperienceRepository {
  async findAll() {
    try {
      const experiences = await ExperienceModel.find({ deletedAt: null }).sort({ createdAt: -1 });
      return experiences;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async findDeleted() {
    try {
      const experiences = await ExperienceModel.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
      return experiences;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async findById(id) {
    try {
      const experience = await ExperienceModel.findOne({ _id: id, deletedAt: null });
      return experience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async findBySlug(slug) {
    try {
      const experience = await ExperienceModel.findOne({ slug, deletedAt: null });
      return experience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async create(data) {
    try {
      const { slug, deletedAt, isActive, status, ...experienceData } = data;

      for (let attempt = 0; attempt < 10; attempt += 1) {
        try {
          const experience = await ExperienceModel.create(experienceData);
          return experience;
        } catch (error) {
          if (!isSlugDuplicateError(error)) {
            throw error;
          }
        }
      }

      throw new Error('No se pudo generar un slug único para la experiencia.');
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async update(id, data) {
    try {
      const { slug, deletedAt, isActive, status, ...experienceData } = data;
      const experience = await this.findById(id);

      if (!experience) {
        return null;
      }

      experience.set(experienceData);

      for (let attempt = 0; attempt < 10; attempt += 1) {
        try {
          const updatedExperience = await experience.save();
          return updatedExperience;
        } catch (error) {
          if (!isSlugDuplicateError(error)) {
            throw error;
          }
        }
      }

      throw new Error('No se pudo generar un slug único para la experiencia.');
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async softDelete(id) {
    try {
      const deletedExperience = await ExperienceModel.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $set: { deletedAt: new Date() } },
        { new: true }
      );
      return deletedExperience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async changeIsActive(id, isActive) {
    try {
      const updatedExperience = await ExperienceModel.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $set: { isActive } },
        { new: true, runValidators: true }
      );
      return updatedExperience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async changeStatus(id, status) {
    try {
      const updatedExperience = await ExperienceModel.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $set: { status } },
        { new: true, runValidators: true }
      );
      return updatedExperience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async restoreDelete(id) {
    try {
      const restoredExperience = await ExperienceModel.findOneAndUpdate(
        { _id: id, deletedAt: { $ne: null } },
        { $set: { deletedAt: null } },
        { new: true }
      );
      return restoredExperience;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}
