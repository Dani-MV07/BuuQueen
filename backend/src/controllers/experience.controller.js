import { ExperienceService } from '../services/experience.service.js';

const service = new ExperienceService();

export class ExperienceController {
  static async getAll(req, res, next) {
    try {
      const experiences = await service.getAllExperiences();
      res.json(experiences);
    } catch (error) {
      next(error);
    }
  }

  static async getDeleted(req, res, next) {
    try {
      const experiences = await service.getDeletedExperiences();
      res.json(experiences);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const experience = await service.getExperienceById(req.params.id);
      res.json(experience);
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req, res, next) {
    try {
      const experience = await service.getExperienceBySlug(req.params.slug);
      res.json(experience);
    } catch (error) {
      next(error);
    }
  }

  static async changeIsActive(req, res, next) {
    try {
      const updatedExperience = await service.changeExperienceIsActive(req.params.id, req.body?.isActive);
      res.json(updatedExperience);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const newExperience = await service.createExperience(req.body);
      res.status(201).json(newExperience);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const updatedExperience = await service.updateExperience(req.params.id, req.body);
      res.json(updatedExperience);
    } catch (error) {
      next(error);
    }
  }

  static async changeStatus(req, res, next) {
    try {
      const updatedExperience = await service.changeExperienceStatus(req.params.id, req.body?.status);
      res.json(updatedExperience);
    } catch (error) {
      next(error);
    }
  }

  static async softDelete(req, res, next) {
    try {
      await service.softDeleteExperience(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async restoreDelete(req, res, next) {
    try {
      const restoredExperience = await service.restoreDeletedExperience(req.params.id);
      res.json(restoredExperience);
    } catch (error) {
      next(error);
    }
  }
}
