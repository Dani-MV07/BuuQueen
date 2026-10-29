import { z } from 'zod';
import { LocationController } from '../controllers/location.controller.js';
import { createResourceRouter } from './resource.routes.js';

export default createResourceRouter(LocationController, {
  country: z.string().trim().min(1, 'El país es obligatorio.'),
  city: z.string().trim().min(1, 'La ciudad es obligatoria.'),
  address: z.string().trim().min(1, 'La dirección es obligatoria.'),
  coordinates: z.array(z.number()).length(2, 'Las coordenadas deben contener latitud y longitud.')
});
