# Ejemplos de Peticiones

### GET /api/experiences
Obtener todas las experiencias.

### GET /api/experiences/:id
Obtener detalle de una experiencia.

### POST /api/experiences
Crear nueva experiencia.
Body (JSON):
```json
{
  "title": "Clase de cocina",
  "city": "Sevilla",
  "price": 40,
  "description": "Aprende a cocinar salmorejo."
}
```

### PATCH /api/experiences/:id
Actualizar experiencia.

### DELETE /api/experiences/:id
Eliminar experiencia.
