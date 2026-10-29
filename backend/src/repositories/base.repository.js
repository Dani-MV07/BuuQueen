import '../models/index.js';
import { handleServiceError } from '../utils/service-error.js';

export class BaseRepository {
  constructor(model, populatePaths = []) {
    this.model = model;
    this.populatePaths = populatePaths;
  }

  populateQuery(query) {
    return query.populate(this.populatePaths);
  }

  async populateDocument(document) {
    return document.populate(this.populatePaths);
  }

  async findAll(filter = {}) {
    try {
      return await this.populateQuery(
        this.model.find({ ...filter, deletedAt: null }).sort({ createdAt: -1 })
      );
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async findDeleted() {
    try {
      return await this.populateQuery(
        this.model.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 })
      );
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async findById(id) {
    try {
      return await this.populateQuery(this.model.findOne({ _id: id, deletedAt: null }));
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async findByIdIncludingDeleted(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async findBySlug(slug) {
    try {
      return await this.populateQuery(this.model.findOne({ slug, deletedAt: null }));
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async slugExists(slug, excludeId) {
    try {
      const filter = { slug };
      if (excludeId) {
        filter._id = { $ne: excludeId };
      }
      return Boolean(await this.model.exists(filter));
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async create(data) {
    try {
      const document = await this.model.create(data);
      return await this.populateDocument(document);
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async update(id, data) {
    try {
      return await this.populateQuery(
        this.model.findOneAndUpdate(
          { _id: id, deletedAt: null },
          { $set: data },
          { new: true, runValidators: true }
        )
      );
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async softDelete(id) {
    try {
      return await this.populateQuery(
        this.model.findOneAndUpdate(
          { _id: id, deletedAt: null },
          { $set: { deletedAt: new Date() } },
          { new: true }
        )
      );
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async changeIsActive(id, isActive) {
    try {
      return await this.populateQuery(
        this.model.findOneAndUpdate(
          { _id: id, deletedAt: null },
          { $set: { isActive } },
          { new: true, runValidators: true }
        )
      );
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async changeStatus(id, status) {
    try {
      return await this.populateQuery(
        this.model.findOneAndUpdate(
          { _id: id, deletedAt: null },
          { $set: { status } },
          { new: true, runValidators: true }
        )
      );
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async restoreDelete(id) {
    try {
      return await this.populateQuery(
        this.model.findOneAndUpdate(
          { _id: id, deletedAt: { $ne: null } },
          { $set: { deletedAt: null } },
          { new: true }
        )
      );
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}
