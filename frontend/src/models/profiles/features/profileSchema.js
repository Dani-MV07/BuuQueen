import { z } from 'zod';

export const profileAvatarSchema = z.string()
  .trim()
  .max(2_800_000, 'La foto supera el tamaño permitido.')
  .refine((value) => {
    if (!value) return true;
    if (/^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z\d+/]+={0,2}$/i.test(value)) return true;
    if (/^\/uploads\/profile-avatars\/[a-f\d]{24}\.(?:jpg|png|webp|gif)$/i.test(value)) return true;
    try {
      return ['http:', 'https:'].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, 'Introduce una URL de imagen HTTP o HTTPS válida.');

export const profileSchema = z.object({
  user_id: z.string().trim().min(1, 'Selecciona un usuario.'),
  avatar: profileAvatarSchema,
  phone: z.string().trim().max(30, 'Máximo 30 caracteres.'),
  bio: z.string().trim().max(2000, 'Máximo 2000 caracteres.')
});
