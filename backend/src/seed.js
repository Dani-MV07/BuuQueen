import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ExperienceModel } from './models/experience.model.js';

dotenv.config();

const initialData = [
  {
    title: 'Clase de paella valenciana tradicional',
    location: 'Huerta local',
    country: 'España',
    city: 'Valencia',
    price: 45,
    currency: 'EUR',
    duration: 3,
    maxGuests: 8,
    coverImage: 'https://picsum.photos/seed/paella-cover/900/600',
    gallery: ['https://picsum.photos/seed/paella-gallery/900/600'],
    hostName: 'Chef local',
    description: 'Aprende a preparar la auténtica paella valenciana en una huerta local con ingredientes frescos.'
  },
  {
    title: 'Paseo en barco al atardecer por la bahía',
    location: 'Puerto de Barcelona',
    country: 'España',
    city: 'Barcelona',
    price: 65,
    currency: 'EUR',
    duration: 2,
    maxGuests: 10,
    coverImage: 'https://picsum.photos/seed/boat-cover/900/600',
    gallery: ['https://picsum.photos/seed/boat-gallery/900/600'],
    hostName: 'Capitán local',
    description: 'Navega por la costa de Barcelona mientras disfrutas de una copa de cava y música en vivo.'
  },
  {
    title: 'Ruta de tapas y vinos por el centro histórico',
    location: 'Centro histórico',
    country: 'España',
    city: 'Madrid',
    price: 38,
    currency: 'EUR',
    duration: 3,
    maxGuests: 6,
    coverImage: 'https://picsum.photos/seed/tapas-cover/900/600',
    gallery: ['https://picsum.photos/seed/tapas-gallery/900/600'],
    hostName: 'Guía local',
    description: 'Recorrido guiado por las tabernas más emblemáticas probando especialidades locales.'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await ExperienceModel.deleteMany({});
    for (const experience of initialData) {
      await ExperienceModel.create(experience);
    }
    console.log('Base de datos poblada con éxito.');
    process.exit(0);
  } catch (error) {
    console.error(`Error en el seed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
