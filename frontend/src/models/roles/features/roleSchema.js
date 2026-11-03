import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio.').max(120, 'Máximo 120 caracteres.'),
  description: z.string().trim().max(2000, 'Máximo 2000 caracteres.'),
  status: z.string().trim().min(1, 'Selecciona un estado.'),
  isActive: z.boolean()
});
