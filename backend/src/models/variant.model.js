import { Schema, Types, model } from 'mongoose';

const variantSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    accommodation_id: { type: String, ref: 'Accommodation', required: true },
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
