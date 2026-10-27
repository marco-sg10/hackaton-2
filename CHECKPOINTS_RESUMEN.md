# Resumen Técnico para Inspección CP3 - Reverse Mountain

## Checkpoint 1: Zarpar (Autenticación y Dashboard)

### Arquitectura de Autenticación

**AuthContext (`src/features/auth/AuthContext.tsx`)**
- Contexto global que gestiona el estado de autenticación
- Almacena: `user` (datos del equipo), `token` (JWT), `isLoading`, `isAuthenticated`
- Funciones: `login()`, `register()`, `logout()`
- **Restauración de sesión**: Al cargar la app, verifica si hay token en localStorage y llama a `getMe()` para validar la sesión con el servidor. Si el token es inválido, limpia localStorage y redirige al login.
- **Persistencia**: El token se guarda en localStorage tras login/registro exitoso

**API de Auth (`src/features/auth/api.ts`)**
- `register(teamName, email, password)`: POST `/auth/register` - Crea la tripulación
- `login(email, password)`: POST `/auth/login` - Inicia sesión
- `getMe(token)`: GET `/auth/me` - Valida el token y obtiene datos del usuario
- Manejo de errores: El servidor responde con `{ message, field }` para errores específicos por campo (email duplicado, nombre duplicado, datos inválidos)

**LoginPage (`src/features/auth/LoginPage.tsx`)**
- Formulario unificado con tabs para Login y Registro
- Muestra errores del servidor junto al campo correspondiente usando `error.field`
- **Redirección inteligente**: Después de login/registro exitoso, redirige a la ruta original que el usuario intentó acceder (guardada en `location.state.from`), o al dashboard por defecto
- Estados de loading y error visualmente claros

**ProtectedRoute (`src/features/auth/ProtectedRoute.tsx`)**
- Wrapper que protege rutas privadas
- Si `isLoading`: muestra loading screen (evita flash de login)
- Si no autenticado: redirige a `/login` guardando la ruta actual en `location.state`
- Si autenticado: renderiza los hijos

### Dashboard

**API de Dashboard (`src/features/dashboard/api.ts`)**
- `getDashboardSummary(token)`: GET `/dashboard/summary` - Métricas (totalWanted, confirmedWanted, totalNews, confirmedNews, totalSagas)
- `getLogPoseStatus(token)`: GET `/log-pose` - Estado del Log Pose (hasLogPose, unlockedAt)

**DashboardPage (`src/features/dashboard/DashboardPage.tsx`)**
- Carga datos en paralelo con `Promise.all()` para eficiencia
- Muestra 3 tarjetas de métricas con colores distintivos
- Indicador visual del estado del Log Pose (verde si activo, rojo si no)
- Navegación a otras secciones, deshabilitando las que requieren Log Pose
- Botón de logout que limpia sesión y redirige a login
- **Estados**: Loading, Error con botón de reintento, Empty states

### Configuración de Rutas (`App.tsx`)

- Rutas públicas: `/login`
- Rutas privadas: `/` (dashboard), `/wanted`, `/wanted/:id`
- Catch-all: `*` → NotFoundPage
- `AuthProvider` envuelve toda la app para acceso global al contexto

### Página 404

- NotFoundPage con diseño temático ("Esta isla no existe en el mapa")
- Botón para volver al dashboard

---

## Checkpoint 2: Carteles de "Se Busca"

### Arquitectura de Filtros en URL

**useWantedFilters Hook (`src/features/wanted/hooks/useWantedFilters.ts`)**
- **Estado en URL**: Todos los filtros se sincronizan con `useSearchParams()` de React Router
- Parámetros gestionados: `page`, `size`, `status`, `crewId`, `fruit`, `q` (búsqueda), `sort`
- **Sanitización de entrada**: Valida que los valores de la URL sean válidos antes de usarlos
  - `page`: debe ser >= 0, default 0
  - `size`: debe ser 10, 20 o 50, default 20
  - `status`: debe ser AT_LARGE, CAPTURED o MISSING
  - `fruit`: debe ser PARAMECIA, ZOAN, LOGIA o NONE
  - `sort`: debe ser bounty,desc | name,asc | updatedAt,desc, default bounty,desc
- **Reset de página**: Al cambiar cualquier filtro (excepto página), resetea a página 0
- **Funciones setter**: Cada filtro tiene su función que actualiza la URL

### Búsqueda con Debounce

**useDebounce Hook (`src/features/wanted/hooks/useDebounce.ts`)**
- Retrasa la actualización del valor por 350ms
- Evita hacer una request por cada tecla presionada
- Solo dispara la búsqueda cuando el usuario deja de escribir

**SearchBar Component**
- Usa `useDebounce` en el input de búsqueda
- Solo actualiza la URL después del delay

### Data Fetching con AbortController

**useWanted Hook (`src/features/wanted/hooks/useWanted.ts`)**
- **AbortController**: Cada request tiene su propio controller
- Al cambiar filtros, aborta la request anterior antes de iniciar la nueva
- **Regla del Log Pose**: "La consola nunca muestra un rumbo falso" - Si llega una respuesta antigua después de abortar, se ignora (verifica `err.name === 'AbortError'`)
- **Corrección de página**: Si el filtro reduce los resultados y la página actual excede el total disponible, corrige automáticamente a la última página válida
- **Retry**: Función `retry()` que incrementa un contador para forzar re-fetch

**Carga de Tripulaciones**
- Carga la lista de crews en paralelo con los carteles
- También usa AbortController para limpieza

### API de Wanted (`src/features/wanted/api.ts`)

- `getWantedPosters(token, params, signal)`: GET `/wanted` con query params
- `getWantedPosterById(token, id, signal)`: GET `/wanted/:id`
- `getCrews(token, signal)`: GET `/crews`
- Todas las funciones aceptan `AbortSignal` para cancelación
- Manejo robusto de errores con mensajes descriptivos

### Componentes UI

**WantedPage**
- Layout con header, buscador, filtros, grid y paginación
- Usa `useWantedFilters` para estado y `useWanted` para data
- Responsive design

**FilterPanel**
- Selects para: Status, Tripulación, Tipo de Fruta, Ordenamiento, Tamaño de página
- Botón de reset de filtros
- Loading state mientras cargan las tripulaciones

**WantedGrid**
- Grid de carteles con skeletons durante loading
- Estado de error con botón de reintento
- Estado vacío cuando no hay resultados
- Cada tarjeta es un Link a `/wanted/:id`

**WantedCard**
- Muestra: nombre, epíteto, recompensa, estado, tripulación, fruta del diablo
- Colores según estado (AT_LARGE: rojo, CAPTURED: verde, MISSING: gris)

**Pagination**
- Muestra: página actual, total de páginas, total de elementos
- Botones: anterior, siguiente, first, last
- Deshabilitado durante loading

### Detalle del Cartel

**WantedDetailPage**
- Carga detalle completo con `getWantedPosterById`
- Muestra información extendida: edad, altura, bio, última ubicación, historial de recompensas
- Link de vuelta al listado que preserva los filtros (usa `Link` con estado o URL)

### Protección contra URL inválidas

- Si la URL tiene valores inválidos (ej: `status=INVALID`), el hook `useWantedFilters` los ignora y usa valores por defecto
- La vista nunca se rompe por parámetros malformados

### Protección contra respuestas antiguas

- AbortController asegura que solo la última request actualiza el estado
- Si el usuario cambia filtros rápidamente, las requests intermedias se cancelan

---

## Preguntas Frecuentes y Respuestas

### CP1 - Autenticación

**P: ¿Por qué usas localStorage para el token?**
R: Para persistir la sesión entre recargas de página. Al cargar la app, verificamos el token con el servidor (`getMe`) para asegurar que sigue siendo válido. Si no lo es, limpiamos localStorage y redirigimos al login.

**P: ¿Cómo manejas la redirección después del login?**
R: `ProtectedRoute` guarda la ruta original en `location.state.from` antes de redirigir al login. Después de un login exitoso, `LoginPage` lee ese estado y redirige a esa ruta. Si no hay ruta guardada, va al dashboard por defecto.

**P: ¿Por qué muestras loading en ProtectedRoute?**
R: Para evitar un flash del login mientras se verifica la sesión. Si el usuario tiene un token válido, queremos mostrar el contenido protegido directamente sin que vea el formulario de login brevemente.

**P: ¿Cómo manejas errores del servidor en el registro?**
R: El servidor responde con `{ message, field }`. Mostramos el mensaje junto al campo específico (ej: "Email ya registrado" junto al input de email). Si el error no tiene campo, lo mostramos como mensaje general.

**P: ¿Qué pasa si el token expira mientras uso la app?**
R: Cualquier request fallará con 401. En una implementación completa, interceptaríamos ese error, limpiaríamos el token y redirigiríamos al login. Actualmente, el usuario vería un error de loading.

### CP2 - Carteles Se Busca

**P: ¿Por qué guardas los filtros en la URL?**
R: Para cumplir la "Regla de Nami": nada se cuenta dos veces. La URL es la fuente de verdad del estado. Permite: recargar la página y ver lo mismo, compartir la URL con filtros aplicados, usar atrás/adelante del navegador para navegar el historial de filtros.

**P: ¿Cómo sanitizas los parámetros de la URL?**
R: `useWantedFilters` valida cada parámetro contra listas de valores válidos (VALID_SIZES, VALID_STATUSES, etc.). Si un valor es inválido, lo ignora y usa el default. Así la vista nunca se rompe por URLs malformadas.

**P: ¿Por qué usas debounce en la búsqueda?**
R: Para evitar hacer una request por cada tecla. Sin debounce, escribir "Luffy" haría 5 requests. Con 350ms de delay, solo hace 1 request cuando el usuario deja de escribir.

**P: ¿Cómo evitas que respuestas antiguas sobrescriban datos nuevos?**
R: Usamos AbortController. Cada request tiene su controller. Al cambiar filtros, abortamos la request anterior. Si una respuesta antigua llega después de ser abortada, el hook la ignora (verifica `err.name === 'AbortError'`). Esto cumple la "Regla del Log Pose": la consola nunca muestra un rumbo falso.

**P: ¿Qué pasa si filtro y la página actual deja de existir?**
R: El hook `useWanted` valida si `page >= totalPages` después de recibir la respuesta. Si es así, llama a `onPageCorrection` para ajustar a la última página válida. Así el usuario nunca queda en una página inexistente.

**P: ¿Por qué reseteas la página al cambiar filtros?**
R: Porque los filtros cambian el total de resultados. Si estaba en página 5 con 50 resultados y filtro reduce a 10 resultados, página 5 ya no existe. Resetear a 0 asegura que el usuario siempre vea resultados válidos.

**P: ¿Cómo manejas el estado vacío?**
R: `WantedGrid` muestra un mensaje específico cuando no hay resultados ("No se encontraron carteles con estos filtros") con un botón para resetear filtros. Es diferente del estado de error.

**P: ¿Por qué cargas las tripulaciones en paralelo?**
R: Para eficiencia. `getCrews` y `getWantedPosters` son independientes, usamos `Promise.all` o useEffects separados para cargarlas simultáneamente en lugar de secuencialmente.

**P: ¿Cómo preservas los filtros al volver del detalle?**
R: Al ir al detalle usamos `Link` que mantiene la URL del listado. Al volver, la URL con los filtros sigue ahí, y `useWantedFilters` los restaura automáticamente desde los query params.

### Arquitectura General

**P: ¿Por qué separas la lógica en hooks personalizados?**
R: Para reutilización y testabilidad. `useWantedFilters` maneja solo la lógica de URL, `useWanted` maneja solo el fetching. Esto separa responsabilidades y hace el código más mantenible.

**P: ¿Cómo manejas TypeScript estricto?**
R: Definimos interfaces para todas las respuestas de la API (`WantedSummary`, `WantedDetail`, etc.). Usamos tipos estrictos para enums (`WantedStatus`, `FruitType`). No usamos `any`, todo está tipado.

**P: ¿Por qué no usas React Query o similar?**
R: No está permitido por las reglas del hackathon. Implementamos nuestro propio manejo de estado con hooks nativos de React.

---

## Conceptos de React Utilizados

### Hooks

**useState**
- Gestión de estado local en componentes (formularios, loading, error, datos)
- Ejemplos: `LoginPage` (form data), `DashboardPage` (summary, logPose), `useWanted` (data, isLoading, error)

**useEffect**
- Efectos secundarios: fetching de datos, suscripciones, limpieza
- Ejemplos: `AuthContext` (restauración de sesión), `useWanted` (fetch con AbortController), `useDebounce` (timer)

**useContext**
- Acceso a contexto global sin prop drilling
- Ejemplo: `useAuth()` para acceder a token y user desde cualquier componente

**useCallback**
- Memoización de funciones para evitar re-renders innecesarios
- Ejemplos: `useWantedFilters` (setters de filtros), `useWanted` (retry)

**useMemo**
- Memoización de valores computados
- Ejemplo: `useWantedFilters` (objeto filters desde URL)

**useRef**
- Referencias mutables que no trigger re-renders
- Ejemplo: `useWanted` (onPageCorrectionRef para mantener callback actual)

**useSearchParams** (React Router)
- Lectura y escritura de query params de la URL
- Ejemplo: `useWantedFilters` (sincronización de filtros con URL)

**useNavigate** (React Router)
- Navegación programática
- Ejemplos: `LoginPage` (redirección post-login), `DashboardPage` (logout)

**useLocation** (React Router)
- Acceso a location object (pathname, state)
- Ejemplo: `LoginPage` (leer ruta original para redirección)

### Rendering de Listas con map()

**WantedGrid**
- `.map()` sobre array de carteles para renderizar `WantedCard`
- Key prop usando el ID del cartel para optimización de React

**FilterPanel**
- `.map()` sobre array de crews para generar opciones del select
- `.map()` sobre arrays de valores válidos (statuses, fruits, sorts) para selects

**Pagination**
- Generación de números de página con `.map()` cuando hay pocas páginas

**DashboardPage**
- `.map()` sobre array de navegación para generar `NavLink`

### Conditional Rendering

**Operador ternario (?)**
- `LoginPage`: `isLogin ? 'Login' : 'Registro'` para tabs
- `DashboardPage`: `logPose?.hasLogPose ? verde : rojo` para estado Log Pose
- `WantedGrid`: `isLoading ? skeletons : error ? errorUI : grid`

**Operador lógico &&**
- `LoginPage`: `{!isLogin && <input teamName />}` solo muestra en modo registro
- `WantedPage`: `{data && <Pagination />}` solo si hay datos

**Early returns**
- `ProtectedRoute`: `if (isLoading) return loading; if (!isAuthenticated) return Navigate;`
- `DashboardPage`: `if (isLoading) return loading; if (error) return error;`

**Componentes condicionales**
- `WantedGrid`: Skeletons durante loading, error message en error, empty state sin resultados

### Props

**Props básicos**
- `WantedCard`: recibe `poster` (objeto) como prop
- `StatCard`: recibe `title`, `value`, `subtitle`, `color`
- `NavLink`: recibe `title`, `description`, `path`, `disabled`

**Props de función (callbacks)**
- `FilterPanel`: recibe `onStatusChange`, `onCrewChange`, etc. como funciones
- `SearchBar`: recibe `onSearch` callback
- `Pagination`: recibe `onPageChange` callback

**Props opcionales**
- `getWantedPosters`: `signal?: AbortSignal` es opcional
- Muchos componentes tienen props opcionales para flexibilidad

**Props con children**
- `ProtectedRoute`: recibe `children` para envolver rutas privadas
- `AuthProvider`: recibe `children` para proveer contexto a toda la app

### Component Composition

**Composición de componentes**
- `WantedPage` compone: `SearchBar` + `FilterPanel` + `WantedGrid` + `Pagination`
- `DashboardPage` compone: `StatCard` + `NavLink`
- `App.tsx` compone: `AuthProvider` + `BrowserRouter` + `Routes`

### Custom Hooks

**useWantedFilters**
- Encapsula lógica de sincronización URL ↔ estado
- Expone funciones setter y objeto filters

**useWanted**
- Encapsula lógica de fetching con AbortController
- Expone data, isLoading, error, retry, crews

**useDebounce**
- Hook reutilizable para cualquier valor que necesite delay
- Genérico con TypeScript: `useDebounce<T>(value, delay)`

### TypeScript con React

**Interfaces para props**
- `WantedFilterParams`, `DashboardSummary`, `AuthResponse`
- Tipado estricto para evitar errores en runtime

**Type guards**
- Verificación de `error.field` antes de mostrar error específico
- Validación de valores de URL contra arrays de valores válidos

## Decisiones Técnicas Claves

1. **URL como fuente de verdad**: Los filtros viven en la URL, no en estado local. Esto permite compartir, recargar y navegar el historial.

2. **AbortController para race conditions**: Previene que respuestas antiguas sobrescriban datos nuevos, cumpliendo la "Regla del Log Pose".

3. **Debounce para búsqueda**: Evita requests innecesarias y mejora la UX.

4. **Sanitización de input**: La vista es robusta ante URLs inválidas - nunca se rompe.

5. **Corrección automática de página**: Si un filtro reduce resultados, ajusta la página automáticamente para evitar páginas vacías.

6. **Contexto global para auth**: Permite acceso a la sesión desde cualquier componente sin prop drilling.

7. **LocalStorage para persistencia**: Permite recargar la página sin perder la sesión, validando con el servidor al inicio.

8. **Separación de concerns**: Hooks separados para filtros, fetching, debounce - cada uno con una responsabilidad clara.
