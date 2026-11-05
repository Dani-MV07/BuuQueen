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
    '/images': {
      post: {
        summary: 'Añadir una imagen por URL a un módulo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ImageInput' }
            }
          }
        },
        responses: {
          '201': { description: 'Imagen creada.' },
          '400': { description: 'Datos de entrada no válidos.' },
          '404': { description: 'Módulo asociado no encontrado.' }
        }
      }
    },
    '/images/bulk': {
      post: {
        summary: 'Añadir varias imágenes por URL a un módulo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ImageBatchInput' }
            }
          }
        },
        responses: {
          '201': { description: 'Imágenes creadas.' },
          '400': { description: 'Datos de entrada no válidos.' },
          '404': { description: 'Módulo asociado no encontrado.' }
        }
      }
    },
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
      ImageInput: {
        type: 'object',
        required: ['entity_type', 'entity_id', 'url_image'],
        properties: {
          entity_type: {
            type: 'string',
            enum: ['Accommodation', 'Category', 'Host', 'Location', 'User', 'Variant']
          },
          entity_id: { type: 'string', format: 'objectId' },
          url_image: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg' }
        }
      },
      ImageBatchInput: {
        type: 'object',
        required: ['entity_type', 'entity_id', 'urls'],
        properties: {
          entity_type: {
            type: 'string',
            enum: ['Accommodation', 'Category', 'Host', 'Location', 'User', 'Variant']
          },
          entity_id: { type: 'string', format: 'objectId' },
          urls: {
            type: 'array',
            minItems: 1,
            maxItems: 20,
            items: { type: 'string', format: 'uri' }
          }
        }
      },
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
