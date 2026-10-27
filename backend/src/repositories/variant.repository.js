import { VariantModel } from '../models/variant.model.js';
import { BaseRepository } from './base.repository.js';

export class VariantRepository extends BaseRepository {
  constructor() {
    super(VariantModel, [
      {
        path: 'accommodation_id',
        populate: [
          { path: 'category_id' },
          { path: 'location_id' },
          { path: 'host_id', populate: { path: 'user_id' } }
        ]
      },
      'images'
    ]);
  }
}
