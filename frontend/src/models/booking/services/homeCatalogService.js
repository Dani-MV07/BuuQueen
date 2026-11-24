import { request } from '../../../services/apiService';
import { normalizeError } from '../../../utils/errorHandler';

const homeCatalogService = {
  async getSections() {
    try {
      const sections = await request('/booking/home');
      if (!sections || !Array.isArray(sections.categories) || !Array.isArray(sections.hosts) || !Array.isArray(sections.locations)) {
        throw new Error('La respuesta de secciones no tiene un formato válido.');
      }
      return sections;
    } catch (error) {
      throw normalizeError(error, 'No se pudieron cargar las secciones del inicio.');
    }
  }
};

export default homeCatalogService;
