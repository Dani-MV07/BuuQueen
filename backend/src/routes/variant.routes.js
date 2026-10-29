import { z } from 'zod';
import { VariantController } from '../controllers/variant.controller.js';
import { createResourceRouter } from './resource.routes.js';

export default createResourceRouter(VariantController, {
  accommodation_id: z.string().regex(/^[a-f\d]{24}$/i, 'El alojamiento debe ser un ObjectId válido.'),
  sku: z.string().trim().min(1, 'El SKU es obligatorio.'),
  price: z.number().min(0, 'El precio no puede ser negativo.'),
  stock: z.number().int().min(0, 'El stock debe ser un entero no negativo.'),
  capacity: z.number().int().min(1, 'La capacidad debe ser un entero positivo.')
});
