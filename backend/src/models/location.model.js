import { Schema, model } from 'mongoose';

const locationSchema = new Schema(
  {
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    coordinates: {
      type: [{ type: Number, required: true }],
      validate: {
        validator: coordinates => coordinates.length === 2,
        message: 'Las coordenadas deben contener latitud y longitud.'
      }
    },
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

locationSchema.virtual('accommodations', {
  ref: 'Accommodation',
  localField: '_id',
  foreignField: 'location_id'
});
locationSchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'entity_id',
  match: { entity_type: 'Location' }
});

export const LocationModel = model('Location', locationSchema);
