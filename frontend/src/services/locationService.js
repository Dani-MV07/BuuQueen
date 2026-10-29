import { locationsApi } from './api';
import { normalizeError } from '../utils/errorHandler';

const locationService = {
  list: async () => {
    try {
      return await locationsApi.list();
    } catch (error) {
      throw normalizeError(error, 'No se pudieron cargar las ubicaciones.');
    }
  }
};

export default locationService;
