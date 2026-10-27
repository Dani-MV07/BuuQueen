import { UserModel } from '../models/user.model.js';
import { BaseRepository } from './base.repository.js';

export class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel, ['role_id', 'hosts', 'images']);
  }
}
