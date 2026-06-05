# Forti — Sistema de Gestión de Obras

**Back-office interno para Aberturas Forti.**

> Reemplaza el flujo de planillas Excel por una única fuente de verdad web:
> desde la carga de cada abertura hasta el pedido de perfiles, vidrios y herrajes.

---

## El problema

Forti gestiona cada obra con al menos seis archivos Excel distintos y desconectados:
`PLANILLA DE CARGA`, `PRESUPUESTO`, `PEDIDO DE PERFILES`, `PEDIDO DE VIDRIOS`, `V103` (planilla de corte), y una gran planilla de estado de obras manual.

Cualquier cambio en las medidas o especificaciones de una abertura requiere actualizar varios archivos a mano, lo que genera errores, reprocesos y pérdida de tiempo.

## La propuesta

Una aplicación web interna (back-office) con una sola fuente de datos:

1. Se cargan las características de cada abertura una sola vez.
2. Los pedidos de perfiles, vidrios y herrajes se generan automáticamente.
3. El estado de la obra se actualiza en un solo lugar.
4. Si la carga difiere del presupuesto original, el sistema lanza una alerta.

---

## Flujo completo (ARBOL GENERAL)

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | **Planilla de Entrada** | Carga de características: línea, tipología, medidas, mosquitero, herrajes, observaciones |
| 2 | **Presupuesto** | Cotización automática; alerta si la carga difiere del presupuesto original |
| 3 | **Planilla Complementaria** | Resumen de características de la obra |
| 4 | **Planilla de Corte** | Desglose de perfilería y vidrios con dimensiones de corte por perfil |
| 5 | **Planilla de Vistas** | Vista interior de las carpinterías (para aprobación del cliente y guía de operarios) |
| 6 | **Pedido de Perfiles** | Cantidades por código, optimizadas según largo de compra; stock vs. a comprar |
| 7 | **Pedido de Vidrios** | Lista de vidrios con composición, dimensiones y filtros técnicos |
| 8 | **Pedido de Herrajes** | Resumen de herrajes internos y accesorios por abertura |
| 9 | **Estado de Obra** | Seguimiento: cargada → material pedido → producción → corte → entrega |

---

## MVP — Fase 1 (marcados en verde por Luis Fernando)

Luis Fernando Pita tomó una obra real y la simplificó a dos ventanas de ejemplo para esta prueba.
Los módulos marcados en verde son los prioritarios:

| # | Módulo | Prioridad |
|---|--------|-----------|
| **1** | **Planilla de Entrada** | ✅ Verde — HACER |
| **2** | **Presupuesto** | ✅ Verde — HACER |
| 3 | Planilla Complementaria | — siguiente fase |
| **4** | **Planilla de Corte** | ✅ Verde — HACER |
| 5 | Planilla de Vistas | — siguiente fase |
| 6 | Pedido de Perfiles | — siguiente fase |
| **7** | **Pedido de Vidrios** | ✅ Verde — HACER |
| 8 | Pedido de Herrajes | — siguiente fase |
| 9 | Estado de Obra | — siguiente fase |

> _"Te pido que en lugar de llenarte ahora con toda la descripción, me comentes qué otra data te vendría bien tener."_ — Luis Fernando Pita, audio 18/05/2026

El MVP cubre los módulos **1, 2, 4 y 7**.

### Entidades

#### Obra
| Campo | Tipo | Notas |
|-------|------|-------|
| nombre | texto | Ej: CASA FAIRWAY |
| dirección | texto | |
| cliente | texto | |
| presupuesto_nro | texto | Ej: PF 1045.10 |
| teléfono | texto | |
| email | texto | |
| tratamiento | texto | Ej: MICROTEXTURADO NEGRO |
| línea | texto | Ver catálogo de líneas |
| notas | texto largo | Observaciones generales de obra |
| estado | enum | CARGADA / MATERIAL PEDIDO / PRODUCCIÓN / CORTE / ENTREGADA |
| fecha | fecha | |

#### Abertura (por obra)
| Campo | Tipo | Notas |
|-------|------|-------|
| denominación | texto | Código, Ej: V103, V205 |
| ubicación | texto | Ej: PLANTA BAJA, SUBSUELO |
| local | texto | Ej: BAÑO, DORMITORIO 1 |
| línea | texto | Ej: ALUWIND ENKEL / HOJA OCULTA |
| tipo_abertura | texto | Ej: OSCILOBATIENTE + PAÑO FIJO INFERIOR |
| vidrio | texto | Composición DVH |
| mosquitero | texto | SI-FIJO / SI-3ERA GUÍA / NO |
| mano | enum | DERECHA / IZQUIERDA |
| suplemento_lateral | número (mm) | |
| suplemento_superior | número (mm) | |
| tapajuntas | booleano | |
| manija | texto | Ej: OCULTA HADES STAC |
| altura_manija | número (mm) | Desde filo inferior |
| umbral | texto | Ej: SEMI E-30mm |
| observaciones | texto | |
| cantidad | número entero | |
| ancho_fab | número (mm) | Medida de fabricación |
| alto_fab | número (mm) | Medida de fabricación |

### Líneas de carpintería (~15)
`CORREDIZA 2H / 3H / 4H / 5H / 6H / 7H / 8H / 9H / 10H`, `HA62`, `62RPT`, `HA110`, `110RPT`, `HA135`, `135RPT`, `ENKEL`, `HOJA OCULTA`, `HOJA OCULTA RPT`, `IMPERIA`, `IMPERIA RPT`, `A30`, `A40`, `A40 RPT`, `MODENA`

### Tipologías (~9)
`OSCILOBATIENTE`, `CORREDIZA`, `BATIENTE`, `BANDEROLA`, `PROYECTANTE`, `DESPLAZABLE`, `FIJO`, `PUERTA`, `PUERTA DOBLE`

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | FastAPI (Python 3.11+), SQLModel, SQLite |
| Auth | Password simple (MVP) |
| Frontend | React 18 + Vite 5 + TypeScript 5 |
| Deploy | Local (fábrica) — Railway + Vercel (futuro) |

Puertos: backend `:8000`, frontend `:5173`

---

## Estructura de carpetas

```
Forti/
├── README.md
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── config.py
│       ├── database.py
│       ├── models/
│       │   ├── obra.py
│       │   └── abertura.py
│       └── routers/
│           ├── obras.py
│           └── aberturas.py
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── pages/
        │   ├── Obras.tsx        — lista de obras
        │   ├── ObraDetalle.tsx  — detalle + aberturas de una obra
        │   └── AberturaForm.tsx — formulario de carga
        └── components/
```

---

## Cómo correrlo

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Roadmap

### MVP (Fase 1) — Este sprint
- [ ] CRUD de Obras
- [ ] Carga de Aberturas por obra (formulario completo)
- [ ] Lista de aberturas por obra con tabla resumida
- [ ] Estado de obra con selector de etapa
- [ ] Alerta si la carga difiere del presupuesto original

### Fase 2
- [ ] Presupuesto automático (cálculo de precios por línea + vidrio + herrajes)
- [ ] Planilla de corte automática (perfiles por abertura con dimensiones)
- [ ] Pedido de perfiles optimizado por largo de compra (6000mm)
- [ ] Stock de fábrica: "en fábrica" vs. "a comprar"

### Fase 3
- [ ] Pedido de vidrios con composición automática
- [ ] Pedido de herrajes
- [ ] Planilla de vistas (renderizado SVG de carpinterías)
- [ ] Exportar a PDF / Excel

---

## Cliente

**Aberturas Forti**
- Showroom: Holmberg 4091, Saavedra / Av. Gmo. Udaondo 1322, CABA
- Fábrica: Beaucheff 4977, Malvinas Argentinas
- Web: [forti.com.ar](https://www.forti.com.ar)
- Contacto: Luis Fernando Pita

---

_Desarrollo: José Tabuyo — 2026_
