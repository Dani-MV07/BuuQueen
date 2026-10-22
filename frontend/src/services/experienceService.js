import { experiencesApi } from './api';
import { normalizeError } from '../utils/errorHandler';

async function runRequest(request, fallbackMessage) {
  try {
    return await request();
  } catch (error) {
    throw normalizeError(error, fallbackMessage);
  }
}

const experienceService = {
  list: () => runRequest(() => experiencesApi.list(), 'No se pudieron cargar las experiencias.'),
  listDeleted: () => runRequest(() => experiencesApi.listDeleted(), 'No se pudieron cargar los viajes eliminados.'),
  get: (id) => runRequest(() => experiencesApi.get(id), 'No se pudo cargar la experiencia.'),
  create: (data) => runRequest(() => experiencesApi.create(data), 'No se pudo crear la experiencia.'),
  update: (id, data) => runRequest(() => experiencesApi.update(id, data), 'No se pudo actualizar la experiencia.'),
  setActive: (id, isActive) => runRequest(() => experiencesApi.setActive(id, isActive), 'No se pudo cambiar la disponibilidad del viaje.'),
  setStatus: (id, status) => runRequest(() => experiencesApi.setStatus(id, status), 'No se pudo cambiar el estado del viaje.'),
  remove: (id) => runRequest(() => experiencesApi.remove(id), 'No se pudo eliminar la experiencia.'),
  restore: (id) => runRequest(() => experiencesApi.restore(id), 'No se pudo recuperar el viaje.')
};

export default experienceService;
