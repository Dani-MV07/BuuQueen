import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    slug: { type: String, required: true, unique: true, trim: true },
    status: { type: String, required: true, trim: true, default: 'active' },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
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
  match: { entity_type: 'User' }
});

export const UserModel = model('User', userSchema);
