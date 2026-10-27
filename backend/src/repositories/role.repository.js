import { RoleModel } from '../models/role.model.js';
import { BaseRepository } from './base.repository.js';

export class RoleRepository extends BaseRepository {
  constructor() {
    super(RoleModel, ['users']);
  }
}
