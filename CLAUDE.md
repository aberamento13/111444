# NEMAPA — Supermapa Ontológico

## Qué es este proyecto

nemapa.com es un supermapa ontológico/metafísico interactivo — una visualización de una cosmovisión completa, navegable en un canvas infinito. No es una red social ni un portfolio. Es un mapa vivo de ideas, conceptos y dinámicas que abarca absolutamente todo: metafísica, biología, tiempo, identidad, chakras, elementos, sistemas de conocimiento, neurociencia, automatismo, determinismo, y más.

## Estructura visual

- **Personaje simple** en el centro del canvas — representa el punto de experiencia local, el organismo de expresión, no un yo fijo sino el nodo donde el sistema se vuelve consciente de sí mismo
- **Círculos concéntricos** alrededor del personaje — no jerarquía sino capas de distancia/resonancia
- **Cuatro ejes direccionales** (arriba/abajo/izquierda/derecha) que organizan los nodos espacialmente
- **Nodos** distribuidos en el espacio según su naturaleza — cada nodo tiene título, descripción corta, y color según categoría
- **Conexiones** entre nodos relacionados — líneas animadas con etiquetas
- **Canvas infinito** con zoom y pan
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

- **Arriba**: Campo base / lo metafísico (más abstracto, más lejano del cuerpo)
- **Derecha**: Mecanismos del personaje
- **Izquierda**: Tiempo y movimiento
- **Abajo**: Cuerpo y lo biológico
- **Arriba-derecha**: Sistemas de referencia
- **Arriba-izquierda**: Dominios de conocimiento
- **Abajo-derecha**: Pilares ilusorios
- **Abajo-izquierda**: Lo social y cultural

## Arquitectura técnica

- React + Vite + TypeScript
- Tailwind CSS
- Supabase (conectado pero sin UI de auth por ahora — para futura funcionalidad comunitaria)
- Canvas propio con CSS transforms (sin ReactFlow)
- Vercel deployment automático desde GitHub

## Archivos clave

- `src/data/nodes.ts` — definición de todos los nodos
- `src/data/connections.ts` — definición de conexiones entre nodos
- `src/components/Supermapa.tsx` — canvas principal con pan/zoom
- `src/components/NodeCard.tsx` — tarjeta de nodo individual
- `src/components/SidePanel.tsx` — panel lateral al hacer click en un nodo

## Modos de observación futuros (NO implementados aún)

En el futuro habrá filtros que muestren subconjuntos del mapa. Cada nodo tiene un array `modes` indicando en qué modos aparece. Por ahora todos los modos están activos:
- metafisico, temporal, energetico, logico, sistemico, cultural

## Paleta

```
--bg: #08090c
--fg: #eae6dd
--gold: #d4a843
```
