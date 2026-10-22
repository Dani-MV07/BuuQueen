import { Schema, Types, model } from 'mongoose';

const hostSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    user_id: { type: String, ref: 'User', required: true },
    bio: { type: String, trim: true, default: '' },
    slug: { type: String, required: true, unique: true, trim: true },
    status: { type: String, required: true, trim: true, default: 'active' },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true, versionKey: false }
);

export const HostModel = model('Host', hostSchema);
