import { hostsApi } from './api';
import { normalizeError } from '../utils/errorHandler';

const hostService = {
  list: async () => {
    try {
      return await hostsApi.list();
    } catch (error) {
      throw normalizeError(error, 'No se pudieron cargar los anfitriones.');
    }
  }
};

export default hostService;
