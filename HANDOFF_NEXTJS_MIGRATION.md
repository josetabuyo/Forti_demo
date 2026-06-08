# Handoff — Migración Forti a Next.js full-stack

## Prompt de apertura (pegalo tal cual en la nueva sesión)

```
Leé este archivo completo antes de hacer cualquier cosa:
/Users/josetabuyo/Development/Forti/HANDOFF_NEXTJS_MIGRATION.md

Sos Opus. Tu único trabajo en este turno es producir el Plan de Migración
detallado (ver sección "Rol de Opus" más abajo). No escribas código todavía.
El plan debe ser lo suficientemente granular para que Haiku pueda ejecutar
cada tarea sin contexto adicional.
```

---

## Objetivo

Migrar **Forti** de un stack separado (FastAPI backend + Vite frontend)
a **Next.js 15 full-stack**, con un único proyecto desplegable en Vercel.

Repo actual: https://github.com/josetabuyo/Forti_demo  
Working dir: `/Users/josetabuyo/Development/Forti`

Al terminar debe existir **un solo proyecto Next.js** en la raíz del repo,
que reemplaza por completo las carpetas `backend/` y `frontend/`.
El stack actual queda eliminado.

---

## Contexto del proyecto

**Forti** es un back-office web para una fábrica de aberturas (ventanas/puertas
de aluminio y PVC) en Argentina. El sistema gestiona Obras y sus Aberturas.

### Modelo de datos actual

**Obra**
```
id, nombre, direccion, cliente, presupuesto_nro, telefono, email,
tratamiento, linea, notas,
estado: CARGADA | MATERIAL_PEDIDO | PRODUCCION | CORTE | ENTREGADA,
fecha (date), created_at
```

**Abertura** (pertenece a una Obra)
```
id, obra_id (FK),
denominacion, ubicacion, local, linea, tipo_abertura, vidrio,
mosquitero, mano, suplemento_lateral (float), suplemento_superior (float),
tapajuntas (bool), manija, altura_manija (float), umbral, observaciones,
cantidad (int), ancho_fab (float), alto_fab (float), created_at
```

### Auth actual
- Un único password de toda la app (env: `APP_PASSWORD`)
- Login devuelve un JWT firmado con `SECRET_KEY`
- Token guardado en localStorage, enviado como `Authorization: Bearer`

### API actual (FastAPI → migrar a Next.js API Routes)
```
POST   /auth/login          { password } → { token }
GET    /obras               → Obra[]
POST   /obras               → Obra
GET    /obras/{id}          → Obra + aberturas[]
PUT    /obras/{id}          → Obra
DELETE /obras/{id}
GET    /obras/{id}/aberturas → Abertura[]
POST   /obras/{id}/aberturas → Abertura
GET    /aberturas/{id}      → Abertura
PUT    /aberturas/{id}      → Abertura
DELETE /aberturas/{id}
```

### Páginas actuales (React → Next.js)
- `/login` — formulario de password
- `/obras` — tabla con todas las obras + badge de estado
- `/obras/nueva` — formulario de alta
- `/obras/:id` — detalle con lista de aberturas
- `/obras/:id/editar` — editar obra
- `/aberturas/nueva?obra_id=X` — alta de abertura
- `/aberturas/:id/editar` — editar abertura

### UI/CSS
El frontend actual tiene CSS propio en `frontend/src/index.css` y `App.css`.
Mantener el mismo look & feel. **No introducir Tailwind ni librerías UI** salvo
que el plan justifique claramente el cambio.

---

## Stack objetivo

| Rol | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript |
| ORM | Drizzle ORM |
| Base de datos | Vercel Postgres (Neon) — `postgres://` |
| Auth | `jose` library (JWT en cookies HttpOnly) |
| Tests unitarios | Vitest |
| Tests e2e | Playwright (con playwright-cli ya instalado globalmente) |
| Deploy | Vercel — 1 solo proyecto, root en `/` |

### Decisiones de arquitectura
- **App Router** con Server Components donde no haya interactividad
- **Route Handlers** (`app/api/`) reemplazan a los routers FastAPI
- **JWT en cookie HttpOnly** en lugar de localStorage (más seguro)
- **Drizzle** por su schema TypeScript-first y excelente integración con Neon
- **`POSTGRES_URL`** como variable de entorno (Vercel la inyecta automáticamente)
- Sin `CORS_EXTRA_ORIGINS` — ya no aplica (mismo origen)

---

## Workflow de agentes

### Opus — Planificación (primer turno) y Revisión final (último turno)
- Lee este documento
- Produce un plan con tareas numeradas y atómicas
- Cada tarea debe ser ejecutable por Haiku sin contexto adicional
- Especifica qué archivos crear/modificar en cada tarea
- Especifica qué tests escribir en cada tarea
- **No escribe código**
- Al final, cuando Sonnet declare "migración completa", Opus hace una
  revisión integral: correctitud, seguridad, tests, deploy readiness

### Haiku — Ejecución
- Toma una tarea del plan a la vez
- Escribe el código y los tests correspondientes
- Reporta "tarea N completa" con un diff breve de lo que hizo
- No toma decisiones de arquitectura; si hay ambigüedad, la escala

### Sonnet — Revisión iterativa
- Después de cada tarea de Haiku, revisa:
  - Correctitud funcional (¿hace lo que la tarea pedía?)
  - Tests presentes y con lógica real (no triviales)
  - Ningún `any` sin justificación, no hay TODOs silenciosos
  - Seguridad básica (auth guards, validación de inputs)
- Si algo está mal: devuelve a Haiku con instrucción específica
- Si está bien: aprueba y pasa a la siguiente tarea
- Cuando todas las tareas están aprobadas: declara "migración completa"

### Regla de distribución de trabajo
```
Opus   → planificar + revisar final (NO codifica)
Haiku  → implementar (TODO el código, TODO lo ordinario)
Sonnet → revisar + aprobar cada tarea (itera con Haiku)
```

---

## Restricciones y requisitos no negociables

1. **Tests obligatorios**: cada Route Handler debe tener tests unitarios con Vitest.
   Al menos un test e2e de flujo completo (login → crear obra → ver obra).
2. **No romper la DB en producción**: el schema Drizzle debe generar las mismas
   tablas que el modelo SQLModel actual (mismos nombres de columnas).
3. **Variables de entorno mínimas** en Vercel:
   - `POSTGRES_URL` (auto-inyectada por Vercel Postgres)
   - `SECRET_KEY`
   - `APP_PASSWORD`
4. **El repo debe quedar deployable** al final: `vercel --prod` desde la raíz
   debe funcionar sin configuración manual adicional.
5. **Sin migraciones pendientes al deployar**: Drizzle `push` o `migrate` debe
   ejecutarse como parte del build o como step documentado.

---

## Estado actual del repo

```
Forti/
├── backend/           ← FastAPI (Python) — ELIMINAR al final
│   ├── app/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/obra.py
│   │   ├── models/abertura.py
│   │   ├── routers/auth.py
│   │   ├── routers/obras.py
│   │   ├── routers/aberturas.py
│   │   └── schemas/
│   ├── api/index.py   ← entrypoint Vercel Python (ya no aplica)
│   ├── vercel.json    ← eliminar
│   ├── main.py
│   └── requirements.txt
└── frontend/          ← React + Vite — ELIMINAR al final
    ├── src/
    │   ├── App.tsx
    │   ├── api.ts
    │   ├── types.ts
    │   ├── contexts/AuthContext.tsx
    │   ├── pages/Login.tsx
    │   ├── pages/Obras.tsx
    │   ├── pages/ObraDetalle.tsx
    │   ├── pages/ObraForm.tsx
    │   └── pages/AberturaForm.tsx
    ├── index.css / App.css  ← preservar estilos
    └── vercel.json
```

---

## Referencia rápida de estilos CSS existentes

Clases CSS relevantes del frontend actual (mantener compatibilidad):
`badge badge-{estado}`, `btn btn-primary`, `btn btn-ghost btn-sm`,
`card`, `table-wrap`, `page-header`, `page-title`, `page-subtitle`,
`loading-page`, `spinner`, `error-msg`, `empty-state`, `td-muted`,
`td-mono`, `count-chip`, `link-cell`

Los estilos están en `frontend/src/index.css` y `frontend/src/App.css`.
Deben migrarse a la nueva estructura Next.js (globals.css + modules o lo
que el plan decida, con tal de preservar el resultado visual).

---

## Notas de seguridad

- El JWT actual usa `python-jose`. En Next.js usar `jose` (npm).
- Cambiar de `localStorage` a cookie `HttpOnly; Secure; SameSite=Strict`
  para guardar el token. Esto implica:
  - `POST /api/auth/login` setea la cookie en la respuesta
  - `POST /api/auth/logout` limpia la cookie
  - Middleware de Next.js valida la cookie en rutas protegidas
- Los Route Handlers privados deben verificar el JWT antes de operar.

---

*Documento generado el 2026-06-08. Working dir: `/Users/josetabuyo/Development/Forti`*
