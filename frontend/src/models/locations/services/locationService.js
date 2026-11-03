import { request } from '../../../services/api';
import { normalizeError } from '../../../utils/errorHandler';

async function run(operation, fallback) {
  try {
    return await operation();
  } catch (error) {
    throw normalizeError(error, fallback);
  }
}

const locationService = {
  list: () => run(() => request('/locations'), 'No se pudieron cargar las ubicaciones.'),
  listDeleted: () => run(() => request('/locations/deleted'), 'No se pudieron cargar las ubicaciones eliminadas.'),
  get: (id) => run(() => request(`/locations/${id}`), 'No se pudo cargar la ubicación.'),
  create: (data) => run(() => request('/locations', { method: 'POST', body: JSON.stringify(data) }), 'No se pudo crear la ubicación.'),
  update: (id, data) => run(() => request(`/locations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }), 'No se pudo actualizar la ubicación.'),
  setActive: (id, isActive) => run(() => request(`/locations/${id}/is-active`, { method: 'PATCH', body: JSON.stringify({ isActive }) }), 'No se pudo cambiar la disponibilidad de la ubicación.'),
  setStatus: (id, status) => run(() => request(`/locations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }), 'No se pudo cambiar el estado de la ubicación.'),
  remove: (id) => run(() => request(`/locations/${id}`, { method: 'DELETE' }), 'No se pudo eliminar la ubicación.'),
  restore: (id) => run(() => request(`/locations/${id}/restore`, { method: 'PATCH' }), 'No se pudo recuperar la ubicación.')
};

export default locationService;
