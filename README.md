# Quiz de Sostenibilidad — Bienal de Arte Joven UNL 2026

Versión independiente de Jotform, preparada para publicar en GitHub Pages. Incluye seis preguntas, feedback educativo, puntaje final y envío de resultados a Supabase.

## Contenido
- `index.html`: estructura de la página.
- `styles.css`: diseño adaptable a celulares y computadoras.
- `app.js`: preguntas, navegación, respuestas y puntaje.
- `config.js`: configuración pública del proyecto Supabase.
- `supabase-schema.sql`: tabla y política para registrar participaciones.

## 1. Configurar la base de datos
1. Crear un proyecto en [Supabase](https://supabase.com/).
2. Abrir **SQL Editor**, pegar el contenido de `supabase-schema.sql` y ejecutar.
3. Ir a **Project Settings → API** (o Connect) y copiar la URL del proyecto y la clave pública `anon`/publishable.
4. Completar `supabaseUrl` y `supabaseAnonKey` en `config.js`.
5. Nunca usar la clave `service_role` en este sitio público.

La configuración por defecto permite que cualquier visitante inserte una participación, pero no lea los resultados mediante la API pública. Los resultados se consultan desde el panel autenticado de Supabase. Para un evento público con gran afluencia, conviene añadir protección contra spam (por ejemplo, Cloudflare Turnstile y una función serverless) antes de usarlo en producción.

## 2. Probar localmente
Abrí `index.html` en el navegador para probar el recorrido. Para probar el guardado real, completá la configuración de Supabase. Si el navegador bloquea peticiones desde `file://`, serví la carpeta con cualquier servidor estático local o usá GitHub Pages.

## 3. Publicar en GitHub Pages
1. Crear un repositorio público llamado `quiz-sostenibilidad-bienal-2026`.
2. Subir todos los archivos de esta carpeta a la raíz del repositorio.
3. En GitHub, abrir **Settings → Pages**.
4. En **Build and deployment**, seleccionar **Deploy from a branch**, elegir `main` y `/ (root)`, y guardar.
5. Esperar a que termine la publicación. La URL será similar a `https://USUARIO.github.io/quiz-sostenibilidad-bienal-2026/`.

## Importante antes de usarlo en la Bienal
- Verificar con el equipo que las preguntas, textos y respuestas correctas sean la versión final.
- Hacer una participación de prueba y confirmar que aparece en `quiz_responses`.
- Definir quién tendrá acceso al panel de Supabase y quién exportará resultados.
- Esta versión registra puntaje, opciones elegidas y fecha; no pide nombre, correo ni otros datos personales.
- La política de inserción pública reduce la exposición de datos, pero no evita por sí sola envíos automatizados o spam. Para uso público de alto volumen, agregar controles antiabuso.
