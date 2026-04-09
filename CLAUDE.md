# NEMAPA — Supermapa Ontológico

## Qué es este proyecto

nemapa.com es un supermapa ontológico/metafísico interactivo — una visualización de una cosmovisión completa, navegable en un canvas infinito. No es una red social ni un portfolio. Es un mapa vivo de ideas, conceptos y dinámicas que abarca absolutamente todo: metafísica, biología, tiempo, identidad, chakras, elementos, sistemas de conocimiento, neurociencia, automatismo, determinismo, y más.

## Estructura visual

- **Personaje simple** en el centro del canvas — representa el punto de experiencia local, el organismo de expresión, no un yo fijo sino el nodo donde el sistema se vuelve consciente de sí mismo. Es un SVG minimalista de palitos, dorado, parado sobre el horizonte.
- **Horizonte visual**: fondo de atardecer con degradado índigo → violeta → naranja → tierra oscura. Línea de horizonte luminosa en `CENTER_Y = 2000`. Círculo grande (radio 1300px) centrado en el personaje que representa el arco cielo/tierra.
- **Círculos concéntricos** alrededor del personaje — no jerarquía sino capas de distancia/resonancia
- **Cuatro ejes direccionales** (arriba/abajo/izquierda/derecha) que organizan los nodos espacialmente
- **Nodos** distribuidos en el espacio según su naturaleza — cada nodo tiene título, descripción corta, y color según categoría
- **Conexiones** entre nodos relacionados — líneas animadas con etiquetas (SVG con stroke-dasharray animado)
- **Canvas infinito** con zoom (scroll/pinch) y pan (drag), implementado con CSS transforms sobre un div de 4400×4000px
- **Todo visible junto** por ahora — sin filtros por modo todavía

## Categorías y colores

| Categoría | Color |
|-----------|-------|
| CAMPO BASE | `#d4a843` (dorado) |
| PILARES ILUSORIOS | `#c45c4a` (rojo) |
| MECANISMOS DEL PERSONAJE | `#4a8ec4` (azul) |
| TIEMPO Y MOVIMIENTO | `#4ac4b0` (cyan) |
| EL CUERPO Y LO BIOLÓGICO | `#5ab878` (verde) |
| SISTEMAS DE REFERENCIA | `#d4a843` (dorado) |
| LO SOCIAL Y CULTURAL | `#9b6fd4` (violeta) |
| DOMINIOS DE CONOCIMIENTO | `#e07c3a` (naranja) |

## Layout espacial

- **Arriba**: Campo base / lo metafísico (más abstracto, más lejano del cuerpo) — en el cielo del atardecer
- **Derecha**: Mecanismos del personaje
- **Izquierda**: Tiempo y movimiento
- **Abajo**: Cuerpo y lo biológico — debajo del horizonte, en la tierra
- **Arriba-derecha**: Sistemas de referencia
- **Arriba-izquierda**: Dominios de conocimiento
- **Abajo-derecha**: Pilares ilusorios
- **Abajo-izquierda**: Lo social y cultural

## Nodos existentes

### CAMPO BASE (dorado)
Lo innombrable · Lo pre-simbólico · El campo · La totalidad · El fractal · La continuidad · Los límites · La separación como dinámica generadora · La doble negación · El techo conceptual · La omnipotencialidad · El estado seminal

### PILARES ILUSORIOS (rojo)
Identidad · Importancia · Propósito · Decisión · Posesión · Libre albedrío · Determinismo

### MECANISMOS DEL PERSONAJE (azul)
Conciencia · Automatismo · Memoria · Lenguaje · Frecuencia anímica · Programas · Creencias · Paradigmas · Interpretación · Percepción · Narración retroactiva · Microinclinación · Recursividad

### TIEMPO Y MOVIMIENTO (cyan)
Tiempo circular/remolino · Pasado como sesgo geométrico · Futuro como cortinas que se abren · Determinismo mágico · Posibilidades infinitas · Ritmo · Ciclos espiralados · La plantilla triádica (generativo/entrópico/recombinatorio)

### EL CUERPO Y LO BIOLÓGICO (verde)
35 billones de células · Neurocircuitos · ADN no codificante · La decisión 7 segundos antes · Chakras · Energía arriba/abajo · Set and setting

### SISTEMAS DE REFERENCIA (dorado)
Cuadrado de Pierce · Carta natal · Cuatro elementos · Siete chakras · Eneagrama · Enteógenos · Gnosis/Demiurgo · VALIS · Nahual · Markov/Gödel · Ouroboros · La barrera frecuencial

### LO SOCIAL Y CULTURAL (violeta)
Estatus · Supervivencia · Espiritualidad como camuflaje del ego · La careta sincera · Programación declarada vs interna · El colectivo como sistema nervioso planetario

### DOMINIOS DE CONOCIMIENTO (naranja)
Metafísica · Ontología · Epistemología · Psicología · Neurociencia · Robótica · IA · Enteogenia · Geometría sagrada · Resonancia/armonía

## Arquitectura técnica

- **React + Vite + TypeScript**
- **Tailwind CSS**
- **Supabase** — conectado (lib/supabase.ts) pero sin UI de auth visible por ahora. Los componentes de auth/contexto existen en el código pero no se muestran. Están preparados para la futura funcionalidad comunitaria.
- **Canvas propio** con CSS transforms (sin ReactFlow). El mundo es un div absoluto de 4400×4000px transformado con `translate + scale`. Pan con pointer events, zoom con wheel y pinch.
- **Vercel** — deployment automático desde GitHub (rama main)
- **GitHub**: repositorio `aberamento13/111444`, rama de desarrollo activa `claude/spanish-greeting-Ouxs4`

## Archivos clave

- `src/data/nodes.ts` — definición de todos los nodos (id, título, descripción, categoría, posición x/y, modes[])
- `src/data/connections.ts` — definición de conexiones entre nodos (from, to, label)
- `src/components/Supermapa.tsx` — canvas principal con pan/zoom, personaje SVG, horizonte, conexiones SVG
- `src/components/NodeCard.tsx` — tarjeta de nodo individual (color por categoría, hover glow)
- `src/components/SidePanel.tsx` — panel lateral al hacer click en un nodo
- `src/lib/supabase.ts` — cliente Supabase (no borrar)
- `src/contexts/AuthContext.tsx` — contexto de auth (no borrar, se usará para colaboración)

## Constantes del canvas (Supermapa.tsx)

```ts
WORLD_W = 4400
WORLD_H = 4000
CENTER_X = 2000   // posición del personaje en x
CENTER_Y = 2000   // posición del personaje en y (= horizonte)
MIN_SCALE = 0.15
MAX_SCALE = 2.5
scale inicial = 0.72
```

## Horizonte visual (implementado)

- Fondo degradado en el div mundo: `#090618 → #170838 → #32104e → #6a1e62 → #b83820 → #e87010 (horizonte) → #3a1206 → #08090c`
- Línea de horizonte: `y = CENTER_Y`, color `#e87010`, con banda de glow `linearGradient`
- Círculo arco cielo/tierra: `r=1300`, centrado en `(CENTER_X, CENTER_Y)`, stroke doble (fino + halo)
- Personaje: pies en `top: CENTER_Y - 70` (feet at exactly y=2000)

## Sistema de colaboración social (FUTURO — no implementado)

El objetivo a largo plazo es que nemapa.com tenga una capa comunitaria donde múltiples usuarios puedan:
- Crear sus propios nodos y conexiones sobre el mapa base
- Proponer expansiones al mapa canónico
- Ver anotaciones de otros usuarios
- Colaborar en la construcción colectiva de la cosmovisión

La infraestructura base (Supabase, AuthContext) ya está en el proyecto. Cuando llegue el momento, activar auth implica:
1. Mostrar UI de login/registro (componente `Auth.tsx` ya existe)
2. Conectar el contexto de usuario al canvas
3. Diseñar esquema de tablas en Supabase para nodos/conexiones de usuario
4. Implementar permisos (qué puede editar cada usuario)

**No implementar esto hasta que el mapa base esté completo y estable.**

## Modos de observación futuros (NO implementados aún)

En el futuro habrá filtros que muestren subconjuntos del mapa. Cada nodo tiene un array `modes` indicando en qué modos aparece. Por ahora todos los modos están activos:
- `metafisico` — campo base, ontología, lo innombrable
- `temporal` — tiempo y movimiento, ciclos, determinismo
- `energetico` — chakras, frecuencia anímica, cuerpo
- `logico` — Pierce, Gödel, lenguaje, paradigmas
- `sistemico` — automatismo, programas, recursividad
- `cultural` — social, estatus, careta sincera

## Estado actual del proyecto

- [x] Canvas infinito con pan/zoom
- [x] Personaje SVG en el centro
- [x] Nodos distribuidos espacialmente por categoría
- [x] Conexiones animadas entre nodos
- [x] Panel lateral al hacer click
- [x] Horizonte visual de atardecer
- [x] Círculo arco cielo/tierra
- [x] Personaje parado sobre el horizonte
- [ ] Filtros por modo de observación
- [ ] Partículas de fondo
- [ ] Más nodos y conexiones
- [ ] Sistema de colaboración / auth

## Paleta

```
--bg: #08090c
--fg: #eae6dd
--gold: #d4a843
--red: #c45c4a
--blue: #4a8ec4
--cyan: #4ac4b0
--green: #5ab878
--violet: #9b6fd4
--orange: #e07c3a
```

## Convenciones de desarrollo

- No usar ReactFlow — canvas propio con CSS transforms
- No mostrar UI de auth al usuario hasta que esté listo el sistema comunitario
- Cada nodo tiene `modes: string[]` aunque por ahora no se filtran
- Los cambios van a rama de desarrollo, nunca directo a main
- Vercel hace deploy automático de main — mergear solo cuando esté estable
