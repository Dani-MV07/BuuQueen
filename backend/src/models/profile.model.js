import { Schema, model } from 'mongoose';

const profileSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        avatar: {
            type: String,
            trim: true,
            default: '',
            maxlength: 2048,
            validate: {
                validator: (value) => {
                    if (!value) return true;
                    if (/^\/uploads\/profile-avatars\/[a-f\d]{24}\.(?:jpg|png|webp|gif)$/i.test(value)) return true;
                    try {
                        return ['http:', 'https:'].includes(new URL(value).protocol);
                    } catch {
                        return false;
                    }
                },
                message: 'La foto debe usar una URL HTTP o HTTPS.'
            }
        },
        phone: { type: String, trim: true, maxlength: 30, default: '' },
        bio: { type: String, trim: true, maxlength: [2000, 'Máximo 2000 caracteres.'], default: '' },
        deletedAt: { type: Date, default: null }
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

export const ProfileModel = model('Profile', profileSchema);
