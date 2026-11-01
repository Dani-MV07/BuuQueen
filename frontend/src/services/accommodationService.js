import { request } from './api';
import { normalizeError } from '../utils/errorHandler';

async function runRequest(request, fallbackMessage) {
  try {
    return await request();
  } catch (error) {
    throw normalizeError(error, fallbackMessage);
  }
}

const accommodationService = {
  list: () => runRequest(() => request('/accommodations'), 'No se pudieron cargar los alojamientos.'),
  listDeleted: () => runRequest(() => request('/accommodations/deleted'), 'No se pudieron cargar los alojamientos eliminados.'),
  get: (id) => runRequest(() => request(`/accommodations/${id}`), 'No se pudo cargar el alojamiento.'),
  create: (data) => runRequest(() => request('/accommodations', {
    method: 'POST',
    body: JSON.stringify(data)
  }), 'No se pudo crear el alojamiento.'),
  update: (id, data) => runRequest(() => request(`/accommodations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }), 'No se pudo actualizar el alojamiento.'),
  setActive: (id, isActive) => runRequest(() => request(`/accommodations/${id}/is-active`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive })
  }), 'No se pudo cambiar la disponibilidad del alojamiento.'),
  setStatus: (id, status) => runRequest(() => request(`/accommodations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }), 'No se pudo cambiar el estado del alojamiento.'),
  remove: (id) => runRequest(() => request(`/accommodations/${id}`, { method: 'DELETE' }), 'No se pudo eliminar el alojamiento.'),
  restore: (id) => runRequest(() => request(`/accommodations/${id}/restore`, { method: 'PATCH' }), 'No se pudo recuperar el alojamiento.')
};

export default accommodationService;
