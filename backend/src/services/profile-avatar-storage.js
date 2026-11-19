import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import AppError from '../utils/app-error.js';

export const PROFILE_AVATAR_DIRECTORY = fileURLToPath(new URL('../../uploads/profile-avatars/', import.meta.url));
const PUBLIC_DIRECTORY = '/uploads/profile-avatars';
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const IMAGE_TYPES = {
  'image/jpeg': { extension: 'jpg', signature: buffer => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  'image/png': { extension: 'png', signature: buffer => buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  'image/webp': { extension: 'webp', signature: buffer => buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP' },
  'image/gif': { extension: 'gif', signature: buffer => ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6)) }
};

async function removeStoredAvatarFiles(userId) {
  await Promise.all(Object.values(IMAGE_TYPES).map(({ extension }) =>
    rm(path.join(PROFILE_AVATAR_DIRECTORY, `${userId}.${extension}`), { force: true })
  ));
}

export async function saveProfileAvatar(userId, avatar) {
  if (avatar === undefined) return undefined;
  const ownerId = String(userId?._id ?? userId);

  if (!avatar) {
    await removeStoredAvatarFiles(ownerId);
    return '';
  }

  if (avatar.startsWith(`${PUBLIC_DIRECTORY}/${ownerId}.`)) return avatar;

  if (/^https?:\/\//i.test(avatar)) {
    await removeStoredAvatarFiles(ownerId);
    return avatar;
  }

  const match = avatar.match(/^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z\d+/]+={0,2})$/i);
  if (!match) {
    throw new AppError('La foto de perfil no tiene un formato válido.', 400);
  }

  const imageType = IMAGE_TYPES[match[1].toLowerCase()];
  const image = Buffer.from(match[2], 'base64');
  if (!image.length || image.length > MAX_IMAGE_BYTES || !imageType.signature(image)) {
    throw new AppError('La imagen debe ser válida y no superar los 2 MB.', 400);
  }

  await mkdir(PROFILE_AVATAR_DIRECTORY, { recursive: true });
  const extension = imageType.extension;
  const temporaryPath = path.join(PROFILE_AVATAR_DIRECTORY, `.${ownerId}-${randomUUID()}.tmp`);
  const finalPath = path.join(PROFILE_AVATAR_DIRECTORY, `${ownerId}.${extension}`);
  try {
    await writeFile(temporaryPath, image, { flag: 'wx' });
    await removeStoredAvatarFiles(ownerId);
    await rename(temporaryPath, finalPath);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }

  return `${PUBLIC_DIRECTORY}/${ownerId}.${extension}`;
}
