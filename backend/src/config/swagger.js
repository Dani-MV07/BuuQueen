import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Booking Experiences API',
    version: '1.0.0',
    description: 'API REST para la gestión de experiencias de viaje'
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor Local'
    }
  ],
  paths: {
    '/experiences': {
      get: {
        summary: 'Obtener todas las experiencias',
        responses: {
          '200': { description: 'Lista de experiencias devuelta con éxito.' }
        }
      },
      post: {
        summary: 'Crear una nueva experiencia',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ExperienceInput' }
            }
          }
        },
        responses: {
          '201': { description: 'Experiencia creada exitosamente.' },
          '400': { description: 'Datos de entrada no válidos.' }
        }
      }
    },
    '/experiences/{id}': {
      get: {
        summary: 'Obtener una experiencia por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Detalles de la experiencia.' },
          '404': { description: 'Experiencia no encontrada.' }
        }
      },
      patch: {
        summary: 'Actualizar una experiencia',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ExperienceInput' }
            }
          }
        },
        responses: {
          '200': { description: 'Experiencia actualizada.' },
          '404': { description: 'Experiencia no encontrada.' }
        }
      },
      delete: {
        summary: 'Eliminar una experiencia',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'Experiencia eliminada con éxito.' },
          '404': { description: 'Experiencia no encontrada.' }
        }
      }
    }
  },
  components: {
    schemas: {
      ExperienceInput: {
        type: 'object',
        required: ['title', 'city', 'price'],
        properties: {
          title: { type: 'string', example: 'Clase de paella valenciana' },
          city: { type: 'string', example: 'Valencia' },
          price: { type: 'number', example: 45 },
          description: { type: 'string', example: 'Aprende a cocinar paella tradicional con un chef local.' }
        }
      }
    }
  }
};

export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(swaggerDocument);
