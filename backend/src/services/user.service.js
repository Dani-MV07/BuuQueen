import { RoleRepository } from '../repositories/role.repository.js';
import { HostRepository } from '../repositories/host.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ProfileRepository } from '../repositories/profile.repository.js';
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
    this.profileRepository = new ProfileRepository();
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

  async update(id, payload) {
    const current = await this.repository.findByIdIncludingDeleted(id);
    const isBeingDeactivated = current && (
      (payload.isActive === false && current.isActive !== false)
      || (Object.hasOwn(payload, 'status') && payload.status !== current.status && payload.status !== 'active')
    );

    if (isBeingDeactivated) {
      await this.#ensureProfileless(id, 'deshabilitar');
    }

    return super.update(id, payload);
  }

  async softDelete(id) {
    await this.#ensureProfileless(id, 'eliminar');
    return super.softDelete(id);
  }

  async #ensureProfileless(userId, action) {
    if (await this.profileRepository.findByUserIdIncludingDeleted(userId)) {
      throw new AppError(`No se puede ${action} al usuario porque tiene un perfil asociado.`, 409);
    }
  }
}
