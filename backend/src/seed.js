import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AccommodationModel } from './models/accommodation.model.js';

dotenv.config();

const initialData = [
  {
    title: 'Hotel Vista al Mar',
    category_id: '65001a000000000000000001',
    location_id: '65002b000000000000000001',
    host_id: '65009i000000000000000001'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await AccommodationModel.deleteMany({});
    for (const accommodation of initialData) {
      await AccommodationModel.create(accommodation);
    }
    console.log('Base de datos poblada con éxito.');
    await mongoose.disconnect();
  } catch (error) {
    console.error(`Error en el seed: ${error.message}`);
    process.exitCode = 1;
    await mongoose.disconnect();
  }
};

seedDB();
