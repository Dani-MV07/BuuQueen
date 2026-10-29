import { z } from 'zod';

export const accommodationSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio.').max(120, 'Máximo 120 caracteres.'),
  city: z.string().trim().min(1, 'La ciudad es obligatoria.').max(80, 'Máximo 80 caracteres.'),
  price: z.string()
    .trim()
    .min(1, 'Indica un precio válido (0 o superior).')
    .refine((value) => Number.isFinite(Number(value)), 'Indica un precio válido (0 o superior).')
    .refine((value) => Number(value) >= 0, 'Indica un precio válido (0 o superior).')
    .transform(Number),
  description: z.string().trim().max(500, 'Máximo 500 caracteres.')
});
