# Booking Accommodations API

API REST para la gestión de alojamientos. La API sigue la arquitectura routes → controllers → services → repositories → models.

## Modelos MongoDB

Los modelos están en `src/models` y representan las colecciones `accommodations`, `categories`, `hosts`, `images`, `locations`, `roles`, `users` y `variants`. Las relaciones usan IDs de tipo string para admitir los identificadores definidos en los JSON del esquema.

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

El recurso principal está disponible en `/api/accommodations`. Consulta `postman.md` para los endpoints y `http://localhost:3000/api-docs` para Swagger.
