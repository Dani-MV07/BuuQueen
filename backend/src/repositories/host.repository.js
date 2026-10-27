import { HostModel } from '../models/host.model.js';
import { BaseRepository } from './base.repository.js';

export class HostRepository extends BaseRepository {
  constructor() {
    super(HostModel, [
      { path: 'user_id', populate: { path: 'role_id' } },
      'accommodations',
      'images'
    ]);
  }
}
