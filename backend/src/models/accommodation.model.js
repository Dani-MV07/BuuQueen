import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const accommodationSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio.'],
      trim: true,
      maxlength: [120, 'Máximo 120 caracteres.']
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    location_id: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true
    },
    host_id: {
      type: Schema.Types.ObjectId,
      ref: 'Host',
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      trim: true,
      default: 'published'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

accommodationSchema.virtual('variants', {
  ref: 'Variant',
  localField: '_id',
  foreignField: 'accommodation_id'
});
accommodationSchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'entity_id',
  match: { entity_type: 'Accommodation' }
});

accommodationSchema.pre('validate', async function () {
  if (!this.isNew && !this.isModified('title')) {
    return;
  }

  const baseSlug = slugify(this.title, { lower: true, strict: true, trim: true }) || 'alojamiento';
  let candidate = baseSlug;
  let suffix = 2;

  while (await this.constructor.exists({ _id: { $ne: this._id }, slug: candidate })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  this.slug = candidate;
});

export const AccommodationModel = model('Accommodation', accommodationSchema);
