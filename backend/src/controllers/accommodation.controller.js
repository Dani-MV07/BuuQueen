import { AccommodationService } from '../services/accommodation.service.js';

const service = new AccommodationService();
const isAdmin = (user) => user?.role === 'admin';
const isBookable = (accommodation) => (
  accommodation.isActive !== false && accommodation.status === 'published'
);

function toBookingProduct(accommodation) {
  const product = accommodation.toObject ? accommodation.toObject() : accommodation;
  return {
    _id: product._id,
    title: product.title,
    description: product.description,
    slug: product.slug,
    status: product.status,
    isActive: product.isActive,
    category_id: product.category_id && {
      name: product.category_id.name,
      slug: product.category_id.slug
    },
    location_id: product.location_id && {
      _id: product.location_id._id,
      city: product.location_id.city,
      country: product.location_id.country,
      name: [product.location_id.city, product.location_id.country].filter(Boolean).join(', ')
    },
    host_id: product.host_id && {
      _id: product.host_id._id,
      name: product.host_id.user_id?.name,
      slug: product.host_id.slug,
      bio: product.host_id.bio
    },
    images: (product.images || [])
      .filter((image) => image.isActive !== false && image.status === 'active')
      .map(({ _id, url_image }) => ({ _id, url_image })),
    variants: (product.variants || [])
      .filter((variant) => (
        (variant.deletedAt === null || variant.deletedAt === undefined)
        && variant.isActive !== false
        && variant.status === 'available'
        && variant.stock > 0
      ))
      .map(({ _id, price, capacity, description, stock, status, isActive }) => ({
        _id,
        price,
        capacity,
        description,
        stock,
        status,
        isActive
      }))
  };
}

export class AccommodationController {
  static async getAll(req, res, next) {
    try {
      const accommodations = await service.getAllAccommodations(req.query);
      res.json(isAdmin(req.user) ? accommodations : accommodations
        .filter(isBookable)
        .map(toBookingProduct));
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
      const accommodation = await service.getAccommodationBySlug(req.params.slug);
      if (isAdmin(req.user)) {
        return res.json(accommodation);
      }
      if (!isBookable(accommodation)) {
        return res.status(404).json({ message: 'No se encontró el alojamiento.' });
      }
      return res.json(toBookingProduct(accommodation));
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
