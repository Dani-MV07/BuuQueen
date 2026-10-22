import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const experienceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio.'],
      trim: true,
      maxlength: [120, 'Máximo 120 caracteres.']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Máximo 500 caracteres.'],
      default: ''
    },
    location: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: [true, 'La ciudad es obligatoria.'],
      trim: true,
      maxlength: [80, 'Máximo 80 caracteres.']
    },
    price: {
      type: Number,
      required: [true, 'Indica un precio válido.'],
      min: [0, 'El precio debe ser 0 o superior.']
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      minlength: [3, 'La moneda debe tener 3 letras.'],
      maxlength: [3, 'La moneda debe tener 3 letras.'],
      default: 'EUR'
    },
    duration: {
      type: Number,
      default: 1,
      min: [1, 'La duración debe ser de al menos 1 hora.'],
      validate: Number.isInteger
    },
    maxGuests: {
      type: Number,
      default: 1,
      min: [1, 'Debe permitirse al menos 1 huésped.'],
      validate: Number.isInteger
    },
    coverImage: {
      type: String,
      trim: true
    },
    gallery: {
      type: [String],
      default: []
    },
    hostName: {
      type: String,
      trim: true,
      minlength: [2, 'El nombre del anfitrión debe tener al menos 2 caracteres.'],
      maxlength: [100, 'El nombre del anfitrión no puede superar los 100 caracteres.']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, 'El estado es obligatorio.'],
      default: 'active'
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

experienceSchema.pre('validate', async function () {
  if (!this.isNew && !this.isModified('title')) {
    return;
  }

  const baseSlug = slugify(this.title, { lower: true, strict: true, trim: true }) || 'experiencia';
  let candidate = baseSlug;
  let suffix = 2;

  while (await this.constructor.exists({ _id: { $ne: this._id }, slug: candidate })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  this.slug = candidate;
});

export const ExperienceModel = model('Experience', experienceSchema);
