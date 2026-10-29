import mongoose from 'mongoose';
import AppError from '../utils/app-error.js';
import { generateSlug } from '../utils/slug.util.js';

export class ResourceService {
  constructor(repository, resourceName, relations = {}, options = {}) {
    this.repository = repository;
    this.resourceName = resourceName;
    this.relations = relations;
    this.slugSource = options.slugSource;
    this.slugFields = options.slugFields || [];
    this.slugMaxLength = options.slugMaxLength || 300;
    this.fields = Object.keys(repository.model.schema.paths)
      .filter((field) => !field.includes('.$') && ![
        '_id', 'id', 'slug', 'deletedAt', 'createdAt', 'updatedAt', '__v'
      ].includes(field));
  }

  async getAll(filters = {}) {
    this.#validateObject(filters, 'Los filtros deben ser un objeto');
    const allowed = new Set([...this.fields, '_id', 'slug']);
    allowed.delete('passwordHash');
    const filter = {};

    for (const [field, value] of Object.entries(filters)) {
      if (!allowed.has(field)) {
        throw new AppError(`Filtro no permitido: ${field}`, 400);
      }
      if (value === undefined) {
        continue;
      }
      if (field === '_id' || field.endsWith('_id') || this.relations[field]) {
        if (value !== null) {
          this.#validateObjectId(value, `${field} debe ser un ID válido de MongoDB`);
        }
      } else if (value !== null && typeof value === 'object') {
        throw new AppError(`El filtro ${field} debe ser un valor simple`, 400);
      }
      filter[field] = value;
    }

    return this.repository.findAll(filter);
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

  async findById(id) {
    return this.getById(id);
  }

  async getBySlug(slug) {
    if (typeof slug !== 'string' || !slug.trim()) {
      throw new AppError('El slug es obligatorio', 400);
    }
    const resource = await this.repository.findBySlug(slug.trim());
    if (!resource) {
      throw this.#notFound();
    }
    return resource;
  }

  async create(payload) {
    const data = this.#toPayload(payload);
    await this.validateRelations(data);
    const reservedSlugs = new Set();
    let resource;

    while (!resource) {
      data.slug = await this.#buildUniqueSlug(data, undefined, reservedSlugs);
      try {
        resource = await this.repository.create(data);
      } catch (error) {
        if (!this.#isSlugDuplicate(error)) {
          throw this.#normalizeError(error);
        }
        reservedSlugs.add(data.slug);
      }
    }

    return resource;
  }

  async update(id, payload) {
    const current = await this.#getCurrent(id);
    const data = this.#toPayload(payload);
    if (!Object.keys(data).length) {
      throw new AppError('Debe proporcionar al menos un campo para actualizar', 400);
    }

    const effective = { ...current, ...data };
    await this.validateRelations(effective, current);
    const rebuildSlug = this.slugFields.some((field) => Object.hasOwn(data, field));
    const reservedSlugs = new Set();
    let resource;

    while (!resource) {
      if (rebuildSlug) {
        data.slug = await this.#buildUniqueSlug(effective, id, reservedSlugs);
      }
      try {
        resource = await this.repository.update(id, data);
        if (!resource) {
          throw this.#notFound();
        }
      } catch (error) {
        if (!rebuildSlug || !this.#isSlugDuplicate(error)) {
          throw this.#normalizeError(error);
        }
        reservedSlugs.add(data.slug);
      }
    }

    return resource;
  }

  async updateAssociations(id, payload) {
    this.#validateObject(payload);
    const associations = Object.fromEntries(
      Object.keys(this.relations)
        .filter((field) => Object.hasOwn(payload, field))
        .map((field) => [field, payload[field]])
    );
    return this.update(id, associations);
  }

  async deleteEntity(id) {
    this.#validateObjectId(id);
    const current = await this.repository.findByIdIncludingDeleted(id);
    if (!current) {
      throw this.#notFound();
    }
    if (current.deletedAt) {
      return { alreadyDeleted: true };
    }
    await this.repository.softDelete(id);
    return { alreadyDeleted: false };
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
    const current = await this.#getCurrent(id, true);
    if (!current.deletedAt) {
      throw this.#notFound();
    }
    await this.validateRelations(current, current);
    const resource = await this.repository.restoreDelete(id);
    if (!resource) {
      throw this.#notFound();
    }
    return resource;
  }

  async changeIsActive(id, isActive) {
    if (typeof isActive !== 'boolean') {
      throw new AppError('isActive debe ser un booleano', 400);
    }
    return this.update(id, { isActive });
  }

  async setActivation(id, isActive) {
    return this.changeIsActive(id, isActive);
  }

  async changeStatus(id, status) {
    if (typeof status !== 'string' || !status.trim() || status.trim().length > 50) {
      throw new AppError('El estado debe tener entre 1 y 50 caracteres', 400);
    }
    return this.update(id, { status: status.trim() });
  }

  async validateRelations(data) {
    for (const [field, { repository, label, required = false }] of Object.entries(this.relations)) {
      const id = data[field];
      if (id === null || id === undefined) {
        if (required) {
          throw new AppError(`${field} es obligatorio`, 400);
        }
        continue;
      }

      this.#validateObjectId(id, `El campo ${field} debe ser un ObjectId válido.`);
      if (!(await repository.findById(id))) {
        throw new AppError(`${label} no encontrado.`, 404);
      }
    }
  }

  #toPayload(payload) {
    this.#validateObject(payload);
    return Object.fromEntries(
      this.fields
        .filter((field) => Object.hasOwn(payload, field) && payload[field] !== undefined)
        .map((field) => [
          field,
          typeof payload[field] === 'string' ? payload[field].trim() : payload[field]
        ])
    );
  }

  #validateObject(value, message = 'El payload debe ser un objeto') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new AppError(message, 400);
    }
  }

  #validateObjectId(id, message = 'El ID proporcionado no es válido.') {
    if (!mongoose.isObjectIdOrHexString(id)) {
      throw new AppError(message, 400);
    }
  }

  async #getCurrent(id, includeDeleted = false) {
    this.#validateObjectId(id);
    const current = await this.repository.findByIdIncludingDeleted(id);
    if (!current || (!includeDeleted && current.deletedAt)) {
      throw this.#notFound();
    }
    return typeof current.toObject === 'function'
      ? current.toObject({ virtuals: true })
      : { ...current };
  }

  async #buildUniqueSlug(data, excludeId, reservedSlugs) {
    const source = await this.slugSource(data);
    if (typeof source !== 'string' || !source.trim()) {
      throw new AppError('No se pudo determinar el texto para generar el slug', 400);
    }

    const base = generateSlug(source).slice(0, this.slugMaxLength);
    if (!base) {
      throw new AppError('No se pudo generar un slug válido', 400);
    }

    for (let suffix = 0; ; suffix += 1) {
      const ending = suffix ? `-${suffix}` : '';
      const candidate = base.slice(0, this.slugMaxLength - ending.length) + ending;
      if (!reservedSlugs.has(candidate) && !await this.repository.slugExists(candidate, excludeId)) {
        return candidate;
      }
    }
  }

  #isSlugDuplicate(error) {
    return error.code === 11000 && Boolean(error.keyPattern?.slug || error.keyValue?.slug);
  }

  #normalizeError(error) {
    if (error.code !== 11000) {
      return error;
    }
    const fields = Object.keys(error.keyPattern || error.keyValue || {});
    return new AppError(
      `Ya existe un registro con el mismo valor de ${fields.join(', ') || 'un campo único'}`,
      409
    );
  }

  #notFound() {
    return new AppError(`No se encontró ${this.resourceName}.`, 404);
  }
}
