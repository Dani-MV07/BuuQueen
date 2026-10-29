import { accommodationsApi } from './api';
import { normalizeError } from '../utils/errorHandler';

async function runRequest(request, fallbackMessage) {
  try {
    return await request();
  } catch (error) {
    throw normalizeError(error, fallbackMessage);
  }
}

const accommodationService = {
  list: () => runRequest(() => accommodationsApi.list(), 'No se pudieron cargar los alojamientos.'),
  listDeleted: () => runRequest(() => accommodationsApi.listDeleted(), 'No se pudieron cargar los alojamientos eliminados.'),
  get: (id) => runRequest(() => accommodationsApi.get(id), 'No se pudo cargar el alojamiento.'),
  create: (data) => runRequest(() => accommodationsApi.create(data), 'No se pudo crear el alojamiento.'),
  update: (id, data) => runRequest(() => accommodationsApi.update(id, data), 'No se pudo actualizar el alojamiento.'),
  setActive: (id, isActive) => runRequest(() => accommodationsApi.setActive(id, isActive), 'No se pudo cambiar la disponibilidad del alojamiento.'),
  setStatus: (id, status) => runRequest(() => accommodationsApi.setStatus(id, status), 'No se pudo cambiar el estado del alojamiento.'),
  remove: (id) => runRequest(() => accommodationsApi.remove(id), 'No se pudo eliminar el alojamiento.'),
  restore: (id) => runRequest(() => accommodationsApi.restore(id), 'No se pudo recuperar el alojamiento.')
};

export default accommodationService;
