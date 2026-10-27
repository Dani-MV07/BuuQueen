import { CategoryModel } from '../models/category.model.js';
import { BaseRepository } from './base.repository.js';

export class CategoryRepository extends BaseRepository {
  constructor() {
    super(CategoryModel, ['accommodations', 'images']);
  }
}
