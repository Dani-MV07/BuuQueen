import { Schema, model } from 'mongoose';

const roleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
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

roleSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'role_id'
});

export const RoleModel = model('Role', roleSchema);
