import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, select: false },
    description: { type: String, trim: true, maxlength: [2000, 'Máximo 2000 caracteres.'], default: '' },
    role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    slug: { type: String, required: true, unique: true, trim: true },
    status: { type: String, required: true, trim: true, default: 'active' },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (document, result) => {
        delete result.passwordHash;
        return result;
      }
    },
    toObject: {
      virtuals: true,
      transform: (document, result) => {
        delete result.passwordHash;
        return result;
      }
    }
  }
);

userSchema.virtual('hosts', {
  ref: 'Host',
  localField: '_id',
  foreignField: 'user_id'
});
userSchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'entity_id',
  match: { entity_type: 'User', deletedAt: null }
});
userSchema.virtual('profile', {
  ref: 'Profile',
  localField: '_id',
  foreignField: 'user_id',
  justOne: true
});

export const UserModel = model('User', userSchema);
