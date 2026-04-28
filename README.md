# WEB BOLERA

Sitio estático (HTML/CSS/JS) para la **carta** de Bolera Contrastes.

## Ver en local

Desde esta carpeta:

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000`.

## Publicar en Vercel

No puedo iniciar sesión/crear el proyecto por ti desde aquí, pero te dejo el proyecto listo y estos pasos son 2 minutos:

1) Instala Vercel CLI (una vez): `npm i -g vercel`
2) Entra en la carpeta: `cd "WEB BOLERA"`
3) Publica: `vercel --prod`

En el asistente elige:
- Framework: `Other`
- Output/public directory: `.` (punto)

Para dominio propio: en Vercel → Project → Settings → Domains (ahí te dirá qué DNS poner en tu registrador).

## Imágenes de productos

- Guardar fotos en `WEB BOLERA/assets/productos/` (carpeta ya creada).
- Más adelante: miniaturas + modal + canvas (si decidís usar imágenes renderizadas/optimizadas).

## Próximo paso

- Completar el menú (faltan secciones/productos si no están en las capturas).
- Añadir enlaces (WhatsApp/Instagram/teléfono) si queréis que aparezcan en la carta.
