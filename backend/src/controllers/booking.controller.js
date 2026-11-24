import { BookingCatalogService } from '../services/booking-catalog.service.js';

const service = new BookingCatalogService();

export class BookingController {
  static async getHomeSections(req, res, next) {
    try {
      res.json(await service.getHomeSections());
    } catch (error) {
      next(error);
    }
  }
}
