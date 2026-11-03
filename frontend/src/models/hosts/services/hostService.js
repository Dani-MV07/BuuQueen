import { request } from '../../../services/api';
import { normalizeError } from '../../../utils/errorHandler';

async function run(operation, fallback) {
  try {
    return await operation();
  } catch (error) {
    throw normalizeError(error, fallback);
  }
}

const hostService = {
  list: () => run(() => request('/hosts'), 'No se pudieron cargar los anfitriones.'),
  listDeleted: () => run(() => request('/hosts/deleted'), 'No se pudieron cargar los anfitriones eliminados.'),
  get: (id) => run(() => request(`/hosts/${id}`), 'No se pudo cargar el anfitrión.'),
  create: (data) => run(() => request('/hosts', { method: 'POST', body: JSON.stringify(data) }), 'No se pudo crear el anfitrión.'),
  update: (id, data) => run(() => request(`/hosts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }), 'No se pudo actualizar el anfitrión.'),
  setActive: (id, isActive) => run(() => request(`/hosts/${id}/is-active`, { method: 'PATCH', body: JSON.stringify({ isActive }) }), 'No se pudo cambiar la disponibilidad del anfitrión.'),
  setStatus: (id, status) => run(() => request(`/hosts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }), 'No se pudo cambiar el estado del anfitrión.'),
  remove: (id) => run(() => request(`/hosts/${id}`, { method: 'DELETE' }), 'No se pudo eliminar el anfitrión.'),
  restore: (id) => run(() => request(`/hosts/${id}/restore`, { method: 'PATCH' }), 'No se pudo recuperar el anfitrión.')
};

export default hostService;
