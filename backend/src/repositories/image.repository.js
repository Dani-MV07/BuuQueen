import { ImageModel } from '../models/image.model.js';
import { BaseRepository } from './base.repository.js';

export class ImageRepository extends BaseRepository {
  constructor() {
    super(ImageModel, ['entity_id']);
  }
}
