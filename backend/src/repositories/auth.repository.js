import { UserModel } from '../models/user.model.js';
import { handleServiceError } from '../utils/service-error.js';

export class AuthRepository {
    async findUserByEmail(email) {
        try {
            return await UserModel
                .findOne({ email: email.toLowerCase(), deletedAt: null })
                .select('+passwordHash')
                .populate('role_id');
        } catch (error) {
            throw handleServiceError(error);
        }
    }
}