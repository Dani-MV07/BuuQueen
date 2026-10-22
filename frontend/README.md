# Airbnb Experiences - Frontend React

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
- Listado de experiencias: `GET /api/experiences`
- Detalle: `GET /api/experiences/:id`
- Crear: `POST /api/experiences`
- Editar: `PATCH /api/experiences/:id`
- Eliminar: `DELETE /api/experiences/:id`
- Formulario reutilizable de creación y edición validado con Zod.
- Tabla de experiencias, skeletons, gestión de errores y confirmación de acciones.
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
    ExperiencesContext.jsx
  features/
    experiences/
      ExperienceForm.jsx
      experienceSchema.js
  hooks/
    index.js
    useExperience.js
    useExperiences.js
  pages/
    ExperienceList.jsx
    ExperienceDetail.jsx
    ExperienceCreate.jsx
    ExperienceEdit.jsx
  services/
    api.js
    experienceService.js
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
