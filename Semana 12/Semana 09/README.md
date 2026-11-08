# LAB 09 — Next.js + Galería NOVAFLIX

Incluye los ejercicios de Pokémon CSR/SSR, Dashboard híbrido del clima y la tarea integradora (OMDb).

## Instrucciones

1. Instala Node.js 20.9 o superior (recomendado 22).
2. Ejecuta `npm install` en la carpeta del proyecto.
3. Solicita tu clave gratuita de OMDb en https://www.omdbapi.com/apikey.aspx (activa la clave desde tu correo).
4. Copia `.env.example` con el nombre `.env.local`, reemplaza `TU_CLAVE_AQUI` por tu clave real.
5. Inicia `npm run dev` y abre http://localhost:3000.

## Rutas
- `/` — Tarea integradora: catálogo SSR, búsqueda CSR y detalles en modal.
- `/pokemon-csr` — Pokémon CSR.
- `/pokemon-ssr` — Pokémon SSR.
- `/weather` — Dashboard de clima híbrido.

## Verificaciones
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Seguridad y diseño
La clave OMDb se almacena solo en el servidor (`OMDB_API_KEY`), nunca en variables `NEXT_PUBLIC_`. La ruta `/api/omdb` valida parámetros y reenvía las consultas. Las búsquedas tienen espera de 400 ms para evitar peticiones por cada pulsación. Las imágenes ausentes muestran una tarjeta alternativa.

## Subida a GitHub
No subas `.env.local`, `node_modules` ni `.next` (ignorados con `.gitignore`).

## SSR vs CSR
- SSR: `app/page.tsx` obtiene el catálogo en el servidor usando `async/await`, antes de servir la página.
- CSR: `components/CinemaApp.tsx` usa `'use client'`, `useState` y `useEffect` para buscar y actualizar resultados sin refrescar. También abre detalles mediante una solicitud desde el navegador.

Nota: la sección de destacados es una selección editorial de títulos conocidos, no un ranking real de popularidad, porque OMDb no ofrece un endpoint oficial de tendencias.

## GitHub y seguridad

`.env.local` contiene una credencial privada: NO lo subas. `.gitignore` ya incluye `.env*` y permite `.env.example`. Tras clonar, crea un nuevo `.env.local` desde el ejemplo. Si filtraste la clave públicamente, regenera tu clave de OMDb.
