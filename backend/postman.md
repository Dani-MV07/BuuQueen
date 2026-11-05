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

### Añadir una imagen

POST /api/images añade una imagen individual. Se puede asociar a Accommodation,
Category, Host, Location, User o Variant (los roles no admiten imágenes).

```json
{
  "entity_type": "Accommodation",
  "entity_id": "65001a000000000000000001",
  "url_image": "https://example.com/images/hotel.jpg"
}
```

### Añadir varias imágenes de una vez

POST /api/images/bulk crea un registro independiente por cada URL. Admite de 1 a 20
URLs HTTP/HTTPS por petición:

```json
{
  "entity_type": "Accommodation",
  "entity_id": "65001a000000000000000001",
  "urls": [
    "https://example.com/images/hotel-exterior.jpg",
    "https://example.com/images/hotel-habitacion.jpg"
  ]
}
```

Las entidades que admiten imágenes las devuelven en su propiedad images; también
se pueden consultar con GET /api/images?entity_type=Accommodation&entity_id=:id.
