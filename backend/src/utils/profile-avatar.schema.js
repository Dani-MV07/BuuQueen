import { z } from 'zod';

const DATA_IMAGE_PATTERN = /^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z\d+/]+={0,2}$/i;
const STORED_AVATAR_PATTERN = /^\/uploads\/profile-avatars\/[a-f\d]{24}\.(?:jpg|png|webp|gif)$/i;

export const profileAvatarSchema = z.string().trim().max(2_800_000).refine((value) => {
  if (!value) return true;
  if (DATA_IMAGE_PATTERN.test(value) || STORED_AVATAR_PATTERN.test(value)) return true;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, 'Selecciona una imagen válida o utiliza una URL HTTP o HTTPS.');
