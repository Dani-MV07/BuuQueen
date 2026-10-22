import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Booking Accommodations API',
    version: '1.0.0',
    description: 'API REST para la gestión de alojamientos'
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor Local'
    }
  ],
  paths: {
    '/accommodations': {
      get: {
        summary: 'Obtener todos los alojamientos',
        responses: {
          '200': { description: 'Lista de alojamientos devuelta con éxito.' }
        }
      },
      post: {
        summary: 'Crear un nuevo alojamiento',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AccommodationInput' }
            }
          }
        },
        responses: {
          '201': { description: 'Alojamiento creado exitosamente.' },
          '400': { description: 'Datos de entrada no válidos.' }
        }
      }
    },
    '/accommodations/{id}': {
      get: {
        summary: 'Obtener un alojamiento por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Detalles del alojamiento.' },
          '404': { description: 'Alojamiento no encontrado.' }
        }
      },
      patch: {
        summary: 'Actualizar un alojamiento',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AccommodationInput' }
            }
          }
        },
        responses: {
          '200': { description: 'Alojamiento actualizado.' },
          '404': { description: 'Alojamiento no encontrado.' }
        }
      },
      delete: {
        summary: 'Eliminar un alojamiento',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'Alojamiento eliminado con éxito.' },
          '404': { description: 'Alojamiento no encontrado.' }
        }
      }
    }
  },
  components: {
    schemas: {
      AccommodationInput: {
        type: 'object',
        required: ['title', 'category_id', 'location_id', 'host_id'],
        properties: {
          title: { type: 'string', example: 'Hotel Vista al Mar' },
          category_id: { type: 'string', format: 'objectId', example: '65001a000000000000000001' },
          location_id: { type: 'string', format: 'objectId', example: '65002b000000000000000001' },
          host_id: { type: 'string', format: 'objectId', example: '65009a000000000000000001' }
        }
      }
    }
  }
};

export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(swaggerDocument);
