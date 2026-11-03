import { request } from '../../../services/api';
import { normalizeError } from '../../../utils/errorHandler';

async function run(operation, fallback) {
  try {
    return await operation();
  } catch (error) {
    throw normalizeError(error, fallback);
  }
}

const variantService = {
  list: () => run(() => request('/variants'), 'No se pudieron cargar las variantes.'),
  listDeleted: () => run(() => request('/variants/deleted'), 'No se pudieron cargar las variantes eliminadas.'),
  get: (id) => run(() => request(`/variants/${id}`), 'No se pudo cargar la variante.'),
  create: (data) => run(() => request('/variants', { method: 'POST', body: JSON.stringify(data) }), 'No se pudo crear la variante.'),
  update: (id, data) => run(() => request(`/variants/${id}`, { method: 'PATCH', body: JSON.stringify(data) }), 'No se pudo actualizar la variante.'),
  setActive: (id, isActive) => run(() => request(`/variants/${id}/is-active`, { method: 'PATCH', body: JSON.stringify({ isActive }) }), 'No se pudo cambiar la disponibilidad de la variante.'),
  setStatus: (id, status) => run(() => request(`/variants/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }), 'No se pudo cambiar el estado de la variante.'),
  remove: (id) => run(() => request(`/variants/${id}`, { method: 'DELETE' }), 'No se pudo eliminar la variante.'),
  restore: (id) => run(() => request(`/variants/${id}/restore`, { method: 'PATCH' }), 'No se pudo recuperar la variante.')
};

export default variantService;
