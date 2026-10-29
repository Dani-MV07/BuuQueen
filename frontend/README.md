# BuuQueen - Alojamientos - Frontend React

Frontend React + Vite conectado a la API REST Express + MongoDB proporcionada.

## Requisitos
- Node.js 18+
- La API ejecutándose en `http://localhost:3000`

## Instalación y Ejecución

```bash
npm install
cp .env.example .env
npm run dev
```

La aplicación quedará disponible en `http://localhost:4200`.

## Configuración de la API
Por defecto usa:
```env
VITE_API_URL=http://localhost:3000/api
```
Puedes cambiarlo en `.env` si la API está en otro host/puerto.

## Funcionalidades
- Listado de alojamientos: `GET /api/accommodations`
- Detalle: `GET /api/accommodations/:id`
- Crear: `POST /api/accommodations`
- Editar: `PATCH /api/accommodations/:id`
- Eliminar: `DELETE /api/accommodations/:id`
- Formulario de alojamientos validado con Zod y selectores de categoría, ubicación y anfitrión cargados desde la API.
- Tabla de alojamientos, skeletons, gestión de errores y confirmación de acciones.
- Carga diferida de páginas para dividir el código por rutas.
- React Router para navegación.

## Estructura
```text
src/
  components/
    layout/
      Layout.jsx
    shared/
      DataTable.jsx
      ErrorBoundary.jsx
      ErrorState.jsx
      Skeleton.jsx
  context/
    AccommodationsContext.jsx
  features/
    accommodations/
      AccommodationForm.jsx
      accommodationSchema.js
  hooks/
    index.js
    useAccommodation.js
    useAccommodations.js
    useCategories.js
    useLocations.js
    useHosts.js
  pages/
    AccommodationList.jsx
    AccommodationDetail.jsx
    AccommodationCreate.jsx
    AccommodationEdit.jsx
  services/
    api.js
    accommodationService.js
    categoryService.js
    locationService.js
    hostService.js
  utils/
    SweetAlert.js
    errorHandler.js
  App.jsx
  main.jsx
  styles.css
```

## Build de producción
```bash
npm run build
npm run preview
```
