import { RevokeTokenModel } from '../models/revoke_token.model.js';
import { handleServiceError } from '../utils/service-error.js';

export class RevokeTokenRepository {
    async revokeToken({ tokenHash, userId, expiresAt }) {
        try {
            return await RevokeTokenModel.updateOne(
                { tokenHash },
                { $setOnInsert: { tokenHash, user_id: userId, expiresAt } },
                { upsert: true }
            );
        } catch (error) {
            throw handleServiceError(error);
        }
    }

    async isRevoked(tokenHash) {
        try {
            return Boolean(await RevokeTokenModel.exists({
                tokenHash,
                expiresAt: { $gt: new Date() }
            }));
        } catch (error) {
            throw handleServiceError(error);
        }
    }
}