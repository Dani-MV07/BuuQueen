import '../models/index.js';
import { CategoryModel } from '../models/category.model.js';
import { HostModel } from '../models/host.model.js';
import { LocationModel } from '../models/location.model.js';

const activeEntityFilter = { deletedAt: null, isActive: true, status: 'active' };

function publicImages(images = []) {
  return images
    .filter((image) => image.isActive !== false && image.status === 'active')
    .map(({ _id, url_image }) => ({ _id, url_image }));
}

export class BookingCatalogService {
  async getHomeSections() {
    const [categories, hosts, locations] = await Promise.all([
      CategoryModel.find(activeEntityFilter)
        .select('name description slug')
        .populate('images')
        .lean(),
      HostModel.find(activeEntityFilter)
        .select('bio description slug user_id')
        .populate({
          path: 'user_id',
          select: 'name',
          match: { deletedAt: null, isActive: true, status: 'active' }
        })
        .populate('images')
        .lean(),
      LocationModel.find(activeEntityFilter)
        .select('country city description slug')
        .populate('images')
        .lean()
    ]);

    return {
      categories: categories.map((category) => ({
        _id: category._id,
        name: category.name,
        description: category.description,
        slug: category.slug,
        images: publicImages(category.images)
      })),
      hosts: hosts
        .filter((host) => host.user_id?.name)
        .map((host) => ({
          _id: host._id,
          name: host.user_id.name,
          bio: host.bio,
          description: host.description,
          slug: host.slug,
          images: publicImages(host.images)
        })),
      locations: locations.map((location) => ({
        _id: location._id,
        city: location.city,
        country: location.country,
        name: [location.city, location.country].filter(Boolean).join(', '),
        description: location.description,
        slug: location.slug,
        images: publicImages(location.images)
      }))
    };
  }
}
