# Booking Experiences API

API REST para la gestión de experiencias y viajes basada en la arquitectura routes → controllers → services → repositories → models.

## Requisitos previos
- Node.js (v18+)
- MongoDB en ejecución (Local o MongoDB Atlas)

## Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Cargar datos de prueba (Seed):
```bash
npm run seed
```

4. Iniciar el servidor:
```bash
npm run dev
```

## Documentación
Accede a `http://localhost:3000/api-docs` para interactuar con la documentación Swagger.
