import { Schema, model } from 'mongoose';

const hostSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bio: { type: String, trim: true, default: '' },
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

hostSchema.virtual('accommodations', {
  ref: 'Accommodation',
  localField: '_id',
  foreignField: 'host_id'
});
hostSchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'entity_id',
  match: { entity_type: 'Host' }
});

export const HostModel = model('Host', hostSchema);
