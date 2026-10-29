# Booking Accommodations API

API REST para la gestión de alojamientos. La API sigue la arquitectura routes → controllers → services → repositories → models.

## Modelos MongoDB

Los modelos están en `src/models` y representan las colecciones `accommodations`, `categories`, `hosts`, `images`, `locations`, `roles`, `users` y `variants`. Las relaciones se almacenan como referencias ObjectId de MongoDB. Los repositorios de `src/repositories` usan `populate` para devolver las relaciones directas e inversas de cada modelo.

## Requisitos previos
- Node.js (v18+)
- MongoDB en ejecución (local o MongoDB Atlas)

## Instalación y ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno copiando `.env.example` a `.env`.

3. Cargar los datos iniciales de roles, usuarios, categorías, ubicaciones, anfitriones, alojamientos, variantes e imágenes:
```bash
npm run seed
```

4. Iniciar el servidor:
```bash
npm run dev
```

## API

Los recursos están disponibles en:

- `/api/accommodations`
- `/api/categories`
- `/api/hosts`
- `/api/images`
- `/api/locations`
- `/api/roles`
- `/api/users`
- `/api/variants`

Cada recurso ofrece listado de activos (`GET /`), listado de eliminados (`GET /deleted`), consulta por slug (`GET /slug/:slug`) o ID (`GET /:id`), creación (`POST /`), actualización (`PATCH /:id`), cambio de estado activo (`PATCH /:id/is-active`), cambio de estado (`PATCH /:id/status`), restauración (`PATCH /:id/restore`) y borrado lógico (`DELETE /:id`). Los listados aceptan filtros exactos mediante parámetros de consulta. Los slugs se generan automáticamente a partir de los datos propios de cada recurso. Consulta `postman.md` y `http://localhost:3000/api-docs` para más información.
