# Migración a Vite — Blanquería MyA

Esto reemplaza el índice viejo (un solo `index.html` con React + Babel + Tailwind
cargados en vivo desde CDN) por un proyecto que Vercel **compila una sola vez**
antes de servirlo. El resultado funcional es idéntico: mismo catálogo, mismo
admin, misma base de Firebase. Lo único que cambia es cómo se arma el sitio.

## Qué hay en esta carpeta
- `index.html` — nuevo, chico, solo el esqueleto + fuentes/Font Awesome.
- `src/App.jsx` — todo tu código de antes (productos, carrito, admin, etc.),
  tal cual, solo con imports en vez de globals.
- `src/firebase.js` — inicializa Firebase (misma base de datos de siempre).
- `src/main.jsx` — monta la app.
- `src/index.css` — Tailwind + tus estilos propios (trama textil, botones, etc.).
- `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js` —
  configuración del build.

## Pasos (hacelo en una rama nueva, sin tocar `main`)

1. En GitHub, andá al repo → botón de ramas (donde dice "main") → escribí un
   nombre nuevo, por ejemplo `migracion-vite` → "Create branch".
2. Parado en esa rama nueva:
   - **Borrá** el `index.html` viejo (el enorme) del repo.
   - Subí TODOS los archivos y carpetas de este zip a la raíz del repo,
     respetando las carpetas (o sea, `src/App.jsx` tiene que quedar
     dentro de una carpeta `src`, no suelto). En GitHub: "Add file" →
     "Upload files" y arrastrás la carpeta entera (o los archivos
     de a uno, recreando `src/` con "create new file" y escribiendo
     `src/App.jsx` como nombre).
3. Commiteá los cambios en esa rama (no en `main`).
4. Anda al dashboard de Vercel: como el repo ya está conectado, Vercel arma
   solo una URL de "preview" para esta rama nueva. Buscala en la pestaña
   "Deployments" del proyecto (aparece con el nombre de la rama).
5. Abrí esa URL de preview en el celu y probá TODO: catálogo, agregar al
   carrito, abrir el admin, cargar un pedido. El sitio real
   (`blanqueria-mya.vercel.app`) sigue andando como siempre mientras tanto.
6. Si en la preview anda todo bien: mergeá la rama `migracion-vite` a `main`
   desde GitHub ("Pull request" → "Merge"). Ahí sí se actualiza el sitio real.
7. Si algo no anda: no mergees. Avisame qué falló y lo vemos antes de tocar
   el sitio real.

## Nota sobre Firebase
`src/firebase.js` ya tiene la config de tu base de datos actual
(`blanqueriamya-default-rtdb`). Es la misma de siempre, no hay que crear nada
nuevo ni migrar datos.
