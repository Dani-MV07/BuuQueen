import { z } from 'zod';

export const locationSchema = z.object({
  country: z.string().trim().min(1, 'El país es obligatorio.').max(120, 'Máximo 120 caracteres.'),
  city: z.string().trim().min(1, 'La ciudad es obligatoria.').max(120, 'Máximo 120 caracteres.'),
  address: z.string().trim().min(1, 'La dirección es obligatoria.').max(300, 'Máximo 300 caracteres.'),
  latitude: z.number().min(-90, 'La latitud debe estar entre -90 y 90.').max(90, 'La latitud debe estar entre -90 y 90.'),
  longitude: z.number().min(-180, 'La longitud debe estar entre -180 y 180.').max(180, 'La longitud debe estar entre -180 y 180.'),
  description: z.string().trim().max(2000, 'Máximo 2000 caracteres.'),
  status: z.string().trim().min(1, 'Selecciona un estado.'),
  isActive: z.boolean()
});
