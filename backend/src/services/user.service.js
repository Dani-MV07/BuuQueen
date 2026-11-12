import { RoleRepository } from '../repositories/role.repository.js';
import { HostRepository } from '../repositories/host.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ResourceService } from './resource.service.js';
import AppError from '../utils/app-error.js';
import { hashPassword } from '../utils/password.util.js';

export class UserService extends ResourceService {
  constructor() {
    super(new UserRepository(), 'el usuario', {
      role_id: { repository: new RoleRepository(), label: 'El rol asociado', required: true }
    }, {
      slugSource: (data) => data.name,
      slugFields: ['name'],
      references: [
        { repository: new HostRepository(), field: 'user_id', label: 'anfitriones' }
      ]
    });
  }

  async create(payload) {
    const data = { ...payload };
    const { password } = data;
    delete data.password;
    delete data.passwordHash;

    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
        throw new AppError('La contraseña debe tener entre 8 y 128 caracteres.', 400);
      }
      data.passwordHash = await hashPassword(password);
    }

    return super.create(data);
  }
}
