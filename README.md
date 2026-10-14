# Quiz de Sostenibilidad — Bienal de Arte Joven UNL 2026

Versión independiente de Jotform, preparada para publicar en GitHub Pages. Incluye seis preguntas, feedback educativo, puntaje final y envío de resultados a Supabase.

## Contenido
- `index.html`: estructura de la página.
- `styles.css`: diseño adaptable a celulares y computadoras.
- `app.js`: preguntas, navegación, respuestas y puntaje.
- `config.js`: configuración pública del proyecto Supabase.
- `supabase-schema.sql`: tabla y políticas para registrar y leer participaciones.
- `dashboard.html` / `dashboard.css` / `dashboard.js`: panel para visualizar los resultados.

## 1. Configurar la base de datos
1. Crear un proyecto en [Supabase](https://supabase.com/).
2. Abrir **SQL Editor**, pegar el contenido de `supabase-schema.sql` y ejecutar.
3. Ir a **Project Settings → API** (o Connect) y copiar la URL del proyecto y la clave pública `anon`/publishable.
4. Completar `supabaseUrl` y `supabaseAnonKey` en `config.js`.
5. Nunca usar la clave `service_role` en este sitio público.

La configuración por defecto permite que cualquier visitante inserte y lea participaciones mediante la API pública, pero no modificarlas ni borrarlas.

## 2. Ver los resultados (dashboard)
1. Ejecutá `supabase-schema.sql` en el SQL Editor de Supabase (es idempotente: sirve tanto para crear la tabla como para agregar la política de lectura si ya existía).
2. Abrí `dashboard.html` en el navegador o publicalo con el resto del sitio: `https://hh-unl.github.io/Quiz-Bienal-2026/dashboard.html`.
3. El panel muestra participaciones, puntaje promedio, % de aciertos globales, distribución de puntajes 0–6, aciertos por pregunta, las participaciones recientes y un botón para exportar CSV. Se actualiza solo cada minuto.

El dashboard no tiene contraseña: cualquiera con la URL puede ver los resultados (no se registran datos personales). No lo enlaces desde el quiz si querés mantenerlo discreto.

## 3. Probar localmente
Abrí `index.html` en el navegador para probar el recorrido. Para probar el guardado real, completá la configuración de Supabase. Si el navegador bloquea peticiones desde `file://`, serví la carpeta con cualquier servidor estático local o usá GitHub Pages.

## 4. Publicar en GitHub Pages
1. Crear un repositorio público (en este caso: `HH-UNL/Quiz-Bienal-2026`).
2. Subir todos los archivos de esta carpeta a la raíz del repositorio.
3. En GitHub, abrir **Settings → Pages**.
4. En **Build and deployment**, seleccionar **Deploy from a branch**, elegir `main` y `/ (root)`, y guardar.
5. Esperar a que termine la publicación. URL actual: `https://hh-unl.github.io/Quiz-Bienal-2026/` y el dashboard en `https://hh-unl.github.io/Quiz-Bienal-2026/dashboard.html`.

## Importante antes de usarlo en la Bienal
- Verificar con el equipo que las preguntas, textos y respuestas correctas sean la versión final.
- Hacer una participación de prueba y confirmar que aparece en `quiz_responses`.
- Definir quién tendrá acceso al panel de Supabase y quién exportará resultados.
- Esta versión registra puntaje, opciones elegidas y fecha; no pide nombre, correo ni otros datos personales.
- La política de inserción pública reduce la exposición de datos, pero no evita por sí sola envíos automatizados o spam. Para uso público de alto volumen, agregar controles antiabuso.
