# Pase

App unificada de cocina y eventos del Seda Club Hotel (Granada): horarios, eventos e inventario en un solo lugar.
Sustituye de forma gradual a Oído Cocina; los proyectos anteriores quedan como están.

## Estado
Base de interfaz lista. Pendiente: datos (Supabase), login por rol y pantallas.

## Archivos
- `pase-ui.css` — sistema de estilos: tokens, botones, formularios, tarjetas, tablas, acordeón, calendario, modo cocina e impresión.
- `pase-calendar.js` — calendario mensual sin dependencias (`PaseCalendar.mount`).
- `pase-ui-demo.html` — muestra de todos los componentes. Ábrela en el navegador.
- `icon.svg` — icono (gorro de chef, dorado sobre negro).

## Reglas de diseño
- Texto mínimo de 12 px (cuerpo de 15 px).
- Objetivos táctiles de 44 px o más (56 px en `modo-cocina`).
- Sin estilos en línea: todo va por clases.
- Todo texto de usuario se inserta con `textContent`, nunca con `innerHTML`.
