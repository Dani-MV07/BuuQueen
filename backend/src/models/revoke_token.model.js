import { Schema, model } from 'mongoose';

const revokeTokenSchema = new Schema(
    {
        tokenHash: { type: String, required: true, unique: true, select: false },
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        expiresAt: { type: Date, required: true, expires: 0 }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'revoke_token'
    }
);

export const RevokeTokenModel = model('RevokeToken', revokeTokenSchema);