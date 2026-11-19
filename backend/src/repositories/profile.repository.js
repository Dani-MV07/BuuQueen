import { ProfileModel } from '../models/profile.model.js';
import { BaseRepository } from './base.repository.js';
import { handleServiceError } from '../utils/service-error.js';

export class ProfileRepository extends BaseRepository {
    constructor() {
        super(ProfileModel, ['user_id']);
    }

    async findByUserId(userId) {
        try {
            return await this.populateQuery(
                this.model.findOne({ user_id: userId, deletedAt: null })
            );
        } catch (error) {
            throw handleServiceError(error);
        }
    }

    async findByUserIdIncludingDeleted(userId) {
        try {
            return await this.populateQuery(
                this.model.findOne({ user_id: userId })
            );
        } catch (error) {
            throw handleServiceError(error);
        }
    }
}
