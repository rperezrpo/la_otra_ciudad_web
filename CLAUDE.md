# La Otra Ciudad — web

Astro 6 (`output: 'static'` con rutas bajo demanda) · Vercel · Sanity · Auth.js (Google) · Tailwind v4.
Sitio bilingüe: español en rutas sin prefijo, inglés bajo `/en`.

Este archivo recoge lo **operativo** — lo que no se deduce leyendo el código. Para el detalle de cada
variable de entorno, mira `.env.example`.

## Despliegue

`git push origin master` despliega a producción automáticamente (Vercel está conectado al repo).
No hay rama de staging: lo que entra en `master` sale al aire.

Proyecto en Vercel: **la-otra-ciudad-web**, equipo **laotraciudad**. Sanity: proyecto `nkzuaihq`, dataset `production`.

## Variables de entorno: dos mundos distintos

Es la fuente de errores más traicionera de este repo, porque los dos lados divergen en silencio.

- **En Vercel** viven las que consumen las rutas `/api/*` al ejecutarse: `SANITY_WRITE_TOKEN`,
  `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `WOMPI_*`.
- **En `.env`** viven las que usan los scripts de `scripts/`, que corren desde tu máquina.

Tener algo en `.env` **no** lo pone en Vercel. En julio de 2026 los dos editores llevaban tiempo sin
poder guardar porque `SANITY_WRITE_TOKEN` solo existía en local. Antes de desplegar algo que toque
`/api/*`:

```bash
npm run check:env
```

Tres detalles de Vercel que muerden:

1. **Cambiar una variable no basta: hay que redesplegar.** Las funciones solo recogen valores nuevos
   al construirse.
2. **Las variables añadidas por CLI quedan marcadas *Sensitive*** y ya no se pueden volver a leer
   (`vercel env pull` devuelve `[SENSITIVE]`). Para verificar un valor, sustitúyelo.
3. **Los valores se guardan tal cual se pegan**, comillas y espacios incluidos. `PUBLIC_SANITY_PROJECT_ID`
   acabó con espacio en blanco y tumbó `createClient` al importarse el módulo — ver `src/lib/sanityWrite.ts`,
   que ahora limpia los valores antes de usarlos.

## Límite de subida: 4,5 MB por petición

Vercel rechaza cualquier petición serverless que supere 4,5 MB, **antes** de que llegue a nuestro código:
el navegador recibe un 413 seco y ningún mensaje nuestro. Por eso los editores validan los tamaños en el
cliente antes de enviar. Los topes están centralizados en `src/lib/uploadLimits.ts` — no los subas sin
resolver antes la subida por partes.

La galería manda todas las imágenes nuevas en una sola petición, así que el total importa tanto como el
tamaño de cada archivo.

## Editores autogestionados

Rutas bajo `/editar` (`export const prerender = false`), con Google como identidad:

| Página | API | Quién entra |
|---|---|---|
| `/editar/proyectos` | `/api/proyectos/actualizar` | personas con `canEditProjects` en Sanity |
| `/editar/perfil` | `/api/equipo/actualizar` | cualquier persona del equipo, solo su ficha |

Los cambios se guardan en Sanity al instante, pero **la web pública no los muestra hasta el siguiente
despliegue** (el sitio se construye estático).

### Depurar un fallo al guardar

El navegador solo enseña `data.error` del JSON de respuesta; si la función revienta, no hay JSON y cae en
un mensaje genérico que no dice nada. La causa real está en **Vercel → Logs**, filtrando por la ruta:

| En el log | Significa |
|---|---|
| `SANITY_WRITE_TOKEN is not set` | Falta la variable, o falta redesplegar tras añadirla |
| `Sanity patch failed:` con 401/403 | El token no vale o es *Viewer* en vez de *Editor* |
| Excepción dentro de `createClient` | Algún `PUBLIC_SANITY_*` con basura; revienta al importar |
| Nada, y el navegador da 413 | La petición pasó de 4,5 MB |

Para probar permisos de escritura sin tocar datos, `client.patch(id).set(...).commit({ dryRun: true })`.

## Pendientes

- **Formulario de contacto roto en producción**: faltan `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y
  `CONTACT_FROM_EMAIL` en Vercel. `npm run check:env` lo señala.
- **Subida de imágenes**: hoy se limita a 4 MB y se pide subir en tandas. La solución de fondo es
  comprimir en el navegador (`browser-image-compression`) y subir de una en una.
