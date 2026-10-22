import { Schema, model } from 'mongoose';

const variantSchema = new Schema(
  {
    accommodation_id: { type: Schema.Types.ObjectId, ref: 'Accommodation', required: true },
    sku: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
    capacity: { type: Number, required: true, min: 1, validate: Number.isInteger },
    slug: { type: String, required: true, unique: true, trim: true },
    status: { type: String, required: true, trim: true, default: 'available' },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true, versionKey: false }
);

export const VariantModel = model('Variant', variantSchema);
