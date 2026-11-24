import { request } from '../../../services/apiService';
import { normalizeError } from '../../../utils/errorHandler';

async function runRequest(callback, fallbackMessage) {
  try {
    return await callback();
  } catch (error) {
    throw normalizeError(error, fallbackMessage);
  }
}

const productService = {
  list: () => runRequest(async () => {
    const products = await request('/accommodations');
    if (!Array.isArray(products)) {
      throw new Error('La respuesta del catálogo no tiene un formato válido.');
    }
    return products;
  }, 'No se pudieron cargar los alojamientos.'),
  getBySlug: (slug) => runRequest(
    () => request(`/accommodations/slug/${encodeURIComponent(slug)}`),
    'No se pudo cargar el alojamiento.'
  )
};

export default productService;
