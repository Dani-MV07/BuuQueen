import { request } from '../../../services/apiService';
import { normalizeError } from '../../../utils/errorHandler';

async function run(operation, fallback) {
  try {
    return await operation();
  } catch (error) {
    throw normalizeError(error, fallback);
  }
}

const profileService = {
  list: () => run(() => request('/profiles'), 'No se pudieron cargar los perfiles.'),
  listDeleted: () => run(() => request('/profiles/deleted'), 'No se pudieron cargar los perfiles eliminados.'),
  get: (id) => run(() => request(`/profiles/${id}`), 'No se pudo cargar el perfil.'),
  create: (data) => run(() => request('/profiles', { method: 'POST', body: JSON.stringify(data) }), 'No se pudo crear el perfil.'),
  update: (id, data) => run(() => request(`/profiles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }), 'No se pudo actualizar el perfil.'),
  remove: (id) => run(() => request(`/profiles/${id}`, { method: 'DELETE' }), 'No se pudo eliminar el perfil.'),
  restore: (id) => run(() => request(`/profiles/${id}/restore`, { method: 'PATCH' }), 'No se pudo recuperar el perfil.')
};

export default profileService;
