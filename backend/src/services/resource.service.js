import mongoose from 'mongoose';
import AppError from '../utils/app-error.js';

export class ResourceService {
  constructor(repository, resourceName, relations = {}) {
    this.repository = repository;
    this.resourceName = resourceName;
    this.relations = relations;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getDeleted() {
    return this.repository.findDeleted();
  }

  async getById(id) {
    this.#validateObjectId(id);
    const resource = await this.repository.findById(id);

    if (!resource) {
      throw this.#notFound();
    }

    return resource;
  }

  async getBySlug(slug) {
    const resource = await this.repository.findBySlug(slug);

    if (!resource) {
      throw this.#notFound();
    }

    return resource;
  }

  async create(data) {
    await this.validateRelations(data);
    return this.repository.create(data);
  }

  async update(id, data) {
    this.#validateObjectId(id);
    const current = await this.repository.findById(id);

    if (!current) {
      throw this.#notFound();
    }

    await this.validateRelations(data, current);
    const resource = await this.repository.update(id, data);

    if (!resource) {
      throw this.#notFound();
    }

    return resource;
  }

  async changeIsActive(id, isActive) {
    this.#validateObjectId(id);
    if (typeof isActive !== 'boolean') {
      throw new AppError('isActive debe ser un valor booleano.', 400);
    }

    const resource = await this.repository.changeIsActive(id, isActive);
    if (!resource) {
      throw this.#notFound();
    }

    return resource;
  }

  async changeStatus(id, status) {
    this.#validateObjectId(id);
    if (typeof status !== 'string' || !status.trim()) {
      throw new AppError('El estado es obligatorio.', 400);
    }

    const resource = await this.repository.changeStatus(id, status.trim());
    if (!resource) {
      throw this.#notFound();
    }

    return resource;
  }

  async softDelete(id) {
    this.#validateObjectId(id);
    const resource = await this.repository.softDelete(id);

    if (!resource) {
      throw this.#notFound();
    }

    return resource;
  }

  async restoreDelete(id) {
    this.#validateObjectId(id);
    const resource = await this.repository.restoreDelete(id);

    if (!resource) {
      throw new AppError(`No se encontró el registro eliminado de ${this.resourceName}.`, 404);
    }

    return resource;
  }

  async validateRelations(data, _current) {
    for (const [field, { repository, label }] of Object.entries(this.relations)) {
      if (!Object.prototype.hasOwnProperty.call(data, field)) {
        continue;
      }

      const id = data[field];
      this.#validateObjectId(id, `El campo ${field} debe ser un ObjectId válido.`);

      if (!(await repository.findById(id))) {
        throw new AppError(`${label} no encontrado.`, 404);
      }
    }
  }

  #validateObjectId(id, message = 'El ID proporcionado no es válido.') {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(message, 422);
    }
  }

  #notFound() {
    return new AppError(`No se encontró ${this.resourceName}.`, 404);
  }
}
