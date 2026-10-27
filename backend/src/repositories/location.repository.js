import { LocationModel } from '../models/location.model.js';
import { BaseRepository } from './base.repository.js';

export class LocationRepository extends BaseRepository {
  constructor() {
    super(LocationModel, ['accommodations', 'images']);
  }
}
