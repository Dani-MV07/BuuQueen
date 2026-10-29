import { categoriesApi } from './api';
import { normalizeError } from '../utils/errorHandler';

const categoryService = {
  list: async () => {
    try {
      return await categoriesApi.list();
    } catch (error) {
      throw normalizeError(error, 'No se pudieron cargar las categorías.');
    }
  }
};

export default categoryService;
