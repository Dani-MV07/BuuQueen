import { Schema, model } from 'mongoose';

const imageSchema = new Schema(
  {
    entity_type: {
      type: String,
      required: true,
      enum: ['Accommodation', 'Category', 'Host', 'Location', 'Role', 'User', 'Variant']
    },
    entity_id: { type: Schema.Types.ObjectId, refPath: 'entity_type', required: true },
    url_image: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    status: { type: String, required: true, trim: true, default: 'active' },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true, versionKey: false }
);

export const ImageModel = model('Image', imageSchema);
