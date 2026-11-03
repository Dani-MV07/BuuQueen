import { request } from '../../../services/api';
import { normalizeError } from '../../../utils/errorHandler';

async function run(operation, fallback) {
  try {
    return await operation();
  } catch (error) {
    throw normalizeError(error, fallback);
  }
}

const roleService = {
  list: () => run(() => request('/roles'), 'No se pudieron cargar los roles.'),
  listDeleted: () => run(() => request('/roles/deleted'), 'No se pudieron cargar los roles eliminados.'),
  get: (id) => run(() => request(`/roles/${id}`), 'No se pudo cargar el rol.'),
  create: (data) => run(() => request('/roles', { method: 'POST', body: JSON.stringify(data) }), 'No se pudo crear el rol.'),
  update: (id, data) => run(() => request(`/roles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }), 'No se pudo actualizar el rol.'),
  setActive: (id, isActive) => run(() => request(`/roles/${id}/is-active`, { method: 'PATCH', body: JSON.stringify({ isActive }) }), 'No se pudo cambiar la disponibilidad del rol.'),
  setStatus: (id, status) => run(() => request(`/roles/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }), 'No se pudo cambiar el estado del rol.'),
  remove: (id) => run(() => request(`/roles/${id}`, { method: 'DELETE' }), 'No se pudo eliminar el rol.'),
  restore: (id) => run(() => request(`/roles/${id}/restore`, { method: 'PATCH' }), 'No se pudo recuperar el rol.')
};

export default roleService;
