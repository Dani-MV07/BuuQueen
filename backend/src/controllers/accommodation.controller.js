import { AccommodationService } from '../services/accommodation.service.js';

const service = new AccommodationService();

export class AccommodationController {
  static async getAll(req, res, next) {
    try {
      res.json(await service.getAllAccommodations(req.query));
    } catch (error) {
      next(error);
    }
  }

  static async getDeleted(req, res, next) {
    try {
      res.json(await service.getDeletedAccommodations());
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      res.json(await service.getAccommodationById(req.params.id));
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req, res, next) {
    try {
      res.json(await service.getAccommodationBySlug(req.params.slug));
    } catch (error) {
      next(error);
    }
  }

  static async changeIsActive(req, res, next) {
    try {
      res.json(await service.changeAccommodationIsActive(req.params.id, req.body?.isActive));
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      res.status(201).json(await service.createAccommodation(req.body));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.json(await service.updateAccommodation(req.params.id, req.body));
    } catch (error) {
      next(error);
    }
  }

  static async changeStatus(req, res, next) {
    try {
      res.json(await service.changeAccommodationStatus(req.params.id, req.body?.status));
    } catch (error) {
      next(error);
    }
  }

  static async softDelete(req, res, next) {
    try {
      await service.softDeleteAccommodation(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async restoreDelete(req, res, next) {
    try {
      res.json(await service.restoreDeletedAccommodation(req.params.id));
    } catch (error) {
      next(error);
    }
  }
}
