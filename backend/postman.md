# Ejemplos de peticiones

### GET /api/accommodations
Obtener todos los alojamientos.

### GET /api/accommodations/:id
Obtener el detalle de un alojamiento.

### POST /api/accommodations
Crear un alojamiento.

```json
{
  "title": "Hotel Vista al Mar",
  "category_id": "65001a000000000000000001",
  "location_id": "65002b000000000000000001",
  "host_id": "65009i000000000000000001"
}
```

### PATCH /api/accommodations/:id
Actualizar los campos del alojamiento.

### DELETE /api/accommodations/:id
Eliminar un alojamiento de forma lógica.

### PATCH /api/accommodations/:id/restore
Restaurar un alojamiento eliminado.

### GET /api/accommodations/deleted
Listar alojamientos eliminados.
