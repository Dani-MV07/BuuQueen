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
  getBySlug: (slug) => runRequest(async () => {
    try {
      return await request(`/accommodations/slug/${encodeURIComponent(slug)}`);
    } catch (detailError) {
      const products = await request('/accommodations');
      if (!Array.isArray(products)) {
        throw detailError;
      }
      const product = products.find((item) => item.slug === slug);
      if (!product) {
        throw detailError;
      }
      return product;
    }
  }, 'No se pudo cargar el alojamiento.')
};

export default productService;
