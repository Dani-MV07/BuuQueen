import { request } from '../../../services/api';
import { normalizeError } from '../../../utils/errorHandler';

async function run(operation, fallback) {
  try {
    return await operation();
  } catch (error) {
    throw normalizeError(error, fallback);
  }
}

const userService = {
  list: () => run(() => request('/users'), 'No se pudieron cargar los usuarios.'),
  listDeleted: () => run(() => request('/users/deleted'), 'No se pudieron cargar los usuarios eliminados.'),
  get: (id) => run(() => request(`/users/${id}`), 'No se pudo cargar el usuario.'),
  create: (data) => run(() => request('/users', { method: 'POST', body: JSON.stringify(data) }), 'No se pudo crear el usuario.'),
  update: (id, data) => run(() => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }), 'No se pudo actualizar el usuario.'),
  setActive: (id, isActive) => run(() => request(`/users/${id}/is-active`, { method: 'PATCH', body: JSON.stringify({ isActive }) }), 'No se pudo cambiar la disponibilidad del usuario.'),
  setStatus: (id, status) => run(() => request(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }), 'No se pudo cambiar el estado del usuario.'),
  remove: (id) => run(() => request(`/users/${id}`, { method: 'DELETE' }), 'No se pudo eliminar el usuario.'),
  restore: (id) => run(() => request(`/users/${id}/restore`, { method: 'PATCH' }), 'No se pudo recuperar el usuario.')
};

export default userService;
