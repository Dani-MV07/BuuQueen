import { categoriesApi } from '../../../services/api';
import { normalizeError } from '../../../utils/errorHandler';

async function runRequest(request, fallbackMessage) {
  try {
    return await request();
  } catch (error) {
    throw normalizeError(error, fallbackMessage);
  }
}

const categoryService = {
  list: () => runRequest(() => categoriesApi.list(), 'No se pudieron cargar las categorías.'),
  listDeleted: () => runRequest(() => categoriesApi.listDeleted(), 'No se pudieron cargar las categorías eliminadas.'),
  get: (id) => runRequest(() => categoriesApi.get(id), 'No se pudo cargar la categoría.'),
  create: (data) => runRequest(() => categoriesApi.create(data), 'No se pudo crear la categoría.'),
  update: (id, data) => runRequest(() => categoriesApi.update(id, data), 'No se pudo actualizar la categoría.'),
  setActive: (id, isActive) => runRequest(() => categoriesApi.setActive(id, isActive), 'No se pudo cambiar la disponibilidad de la categoría.'),
  setStatus: (id, status) => runRequest(() => categoriesApi.setStatus(id, status), 'No se pudo cambiar el estado de la categoría.'),
  remove: (id) => runRequest(() => categoriesApi.remove(id), 'No se pudo eliminar la categoría.'),
  restore: (id) => runRequest(() => categoriesApi.restore(id), 'No se pudo recuperar la categoría.')
};

export default categoryService;
