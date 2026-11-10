import { CategoryRepository } from '../repositories/category.repository.js';
import { AccommodationRepository } from '../repositories/accommodation.repository.js';
import { ImageRepository } from '../repositories/image.repository.js';
import { ResourceService } from './resource.service.js';

export class CategoryService extends ResourceService {
  constructor() {
    super(new CategoryRepository(), 'la categoría', {}, {
      slugSource: (data) => data.name,
      slugFields: ['name'],
      references: [
        { repository: new AccommodationRepository(), field: 'category_id', label: 'alojamientos' },
        { repository: new ImageRepository(), field: 'entity_id', filter: { entity_type: 'Category' }, label: 'imágenes' }
      ]
    });
  }
}
