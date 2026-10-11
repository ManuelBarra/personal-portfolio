# Portfolio Manuel Barra — CLAUDE.md

## Proyecto
Portfolio interactivo personal de Manuel Barra Lazo. SPA de una sola página (`src/app/page.tsx`) organizada en 7 "rooms" horizontales navegables con scroll/teclado/swipe, más una ruta `/cv` con el mismo contenido en formato documento imprimible.

## Stack
- **Framework:** Next.js 14.2 (App Router), fijado a `^14.2.14` en `package.json` (no v15)
- **Lenguaje:** TypeScript strict
- **Estilos:** Tailwind CSS v4 + `@theme` en `src/styles/globals.css` (sin `tailwind.config.*`)
- **3D:** React Three Fiber + @react-three/drei + @react-three/postprocessing (instalados, pero actualmente sin uso activo en la app — ver sección "Componentes 3D")
- **Animaciones:** GSAP + ScrollTrigger + Framer Motion
- **Estado:** Zustand (store sin uso activo) + hooks locales de React
- **Datos:** JSON estático en `src/data/resume.json` (source of truth), bilingüe ES/EN
- **Package manager:** pnpm 9.15.0 (ver sección "Comandos")

## Tema Visual "MANU.OS — Cyberpunk"
Definido en `@theme` dentro de `src/styles/globals.css`:
```
--color-bg-0:      #03060d  (fondo principal)
--color-bg-1:      #0a0f1e
--color-bg-2:       #111827
--color-bg-card:   #0d1321
--color-neon:      #3DDCFF  (acento primario)
--color-indigo:    #5B7CFF
--color-magenta:   #FF3CAC
--color-green:     #00FF88
--color-amber:     #FFB800
--color-red:       #FF4757
--color-text-primary:   #E8ECF4
--color-text-secondary: #8892A8
--color-text-muted:     #6E7F99
```
El tema "Phoenician" (naranja/azul/dorado) de versiones anteriores ya no existe en el código.

## Tipografía
Cargadas vía `next/font/google` en `src/app/layout.tsx`, expuestas como CSS vars en `globals.css`:
- `--font-body` → Space Grotesk
- `--font-display` (headings) → Syne, con fallback a Space Grotesk
- `--font-mono` → JetBrains Mono
- `--font-crt` (HUD/boot/números decorativos) → VT323

## Arquitectura — "Rooms" + HUD
`src/app/page.tsx` es un client component que orquesta 7 rooms en un contenedor `.world` desplazado con `translate3d` (no es scroll-snap nativo). Navegación por teclado (flechas, números 1-7, Esc), rueda del ratón y swipe táctil. Cada room se envuelve en `RoomChrome` (grid decorativo, esquinas, tag, número).

| Room | Ruta |
|---|---|
| RoomChrome (wrapper decorativo compartido) | `src/components/rooms/RoomChrome.tsx` |
| HeroRoom | `src/components/rooms/HeroRoom.tsx` |
| AboutRoom | `src/components/rooms/AboutRoom.tsx` |
| ExperienceRoom | `src/components/rooms/ExperienceRoom.tsx` |
| EducationRoom | `src/components/rooms/EducationRoom.tsx` |
| SkillsRoom | `src/components/rooms/SkillsRoom.tsx` |
| ProjectsRoom (galería 3D "coverflow" en CSS, cards en abanico con perspectiva, usa `next/image`) | `src/components/rooms/ProjectsRoom.tsx` |
| ContactRoom (CTA "Download CV" que descarga el PDF LaTeX según idioma) | `src/components/rooms/ContactRoom.tsx` |

HUD (overlay fijo sobre las rooms):

| Componente | Ruta |
|---|---|
| HudTop (barra superior) | `src/components/hud/HudTop.tsx` |
| HudBottom (minimapa de navegación) | `src/components/hud/HudBottom.tsx` |
| NavArrows | `src/components/hud/NavArrows.tsx` |
| CustomCursor | `src/components/hud/CustomCursor.tsx` |
| BootOverlay (pantalla de arranque tipo terminal) | `src/components/hud/BootOverlay.tsx` |
| ThemeProvider | `src/components/ThemeProvider.tsx` |
| JsonLd (datos estructurados SEO) | `src/components/JsonLd.tsx` |

## Componentes 3D
| Componente | Ruta | Estado |
|---|---|---|
| HeroMesh (grid de wireframe animado en `<canvas>` 2D, reacciona al cursor) | `src/components/3d/HeroMesh.tsx` | **Activo**, usado en `HeroRoom` vía `page.tsx` |
| Scene (Canvas de React Three Fiber) | `src/components/3d/Scene.tsx` | Sin uso — no se importa en ningún sitio |
| FireSphere (placeholder Phoenix, esfera de fuego con partículas) | `src/components/3d/FireSphere.tsx` | Sin uso — solo referenciada desde `Scene.tsx` |
| Phoenix (fallback abstracto, geometrías animadas en espera del GLB) | `src/components/3d/Phoenix.tsx` | Sin uso — no se importa en ningún sitio |

`HeroMesh` es Canvas API 2D pura (sin Three.js) y es el efecto visual realmente activo en el Hero. `Scene`/`FireSphere`/`Phoenix` siguen usando la paleta "Phoenician" antigua (`#FF6B35`, `#F7B32B`) y no están conectados a la app.

## Página /cv
`src/app/cv/page.tsx` es un Server Component que renderiza `resume.json` como documento plano imprimible/ATS-friendly (fondo claro, sin 3D ni cursor custom), con idioma vía `?lang=es|en`.

| Componente | Ruta |
|---|---|
| CvPage (Server Component) | `src/app/cv/page.tsx` |
| CvToolbar (cliente: selector de idioma + botón `window.print()`) | `src/app/cv/CvToolbar.tsx` |
| CvViewportFix (cliente: revierte el `overflow: hidden` global de las rooms mientras esta ruta está montada) | `src/app/cv/CvViewportFix.tsx` |

## CV en PDF (LaTeX)
El botón "Download CV" de ContactRoom descarga un PDF compilado desde LaTeX, no la ruta `/cv`:
- ES/CA → `public/cv/Manuel_Barra_Lazo_CV_2026.pdf` (fuente `cv-latex/Manuel_Barra_Lazo_CV_ES.tex`)
- EN → `public/cv/Manuel_Barra_Lazo_Resume_2026_EN.pdf` (fuente `cv-latex/Manuel_Barra_Lazo_CV_EN.tex`)
Al cambiar `resume.json`, actualiza también los `.tex` y recompila con `pdflatex` (ver `cv-latex/README.md`).

## Datos del resume
- Archivo maestro: `src/data/resume.json`
- Tipos TypeScript: `src/types/resume.ts` (incluye `LocalizedText { es, en }` para todos los campos bilingües)
- Hook de carga: `src/hooks/useResume.ts` — importa el JSON de forma dinámica, persiste un borrador en `localStorage` (`resume_draft`) y descarta drafts guardados antes de la migración a i18n (guarda por `typeof personal.title === 'object'`)
- `useResume` solo reutiliza un borrador de `localStorage` si su `metadata.version` coincide con la de `resume.json`: sube la versión al cambiar contenido.
- Store Zustand: `src/stores/resumeStore.ts` — existe pero no se usa en ningún componente actualmente; la app usa `useResume.ts` directamente
- i18n:
  - `src/lib/i18n.ts` — función pura `t(text, locale)` que resuelve `LocalizedText`, con fallback `es → en → ''`. Server-safe (sin `'use client'`), pensada para usarse desde Server Components como `cv/page.tsx`
  - `src/hooks/useLocale.tsx` — Context de React (`LocaleProvider`/`useLocale`), persiste el locale en `localStorage`. Re-exporta `t` de `lib/i18n.ts` por comodidad de los client components

## Comandos
pnpm no está instalado globalmente en Windows y `corepack` falla con `EPERM` en `Program Files`. Para ejecutar scripts:
```
npx --yes pnpm@9.15.0 dev
npx --yes pnpm@9.15.0 build
npx --yes pnpm@9.15.0 type-check
```
Scripts disponibles (`package.json`): `dev`, `build`, `start`, `lint`, `lint:fix`, `type-check`, `format`, `format:check`.

## Convenciones
- Estilos inline con CSS variables para componentes 3D/canvas (no mezclar Tailwind ahí)
- Tailwind solo para componentes UI convencionales
- `gsap.context()` siempre con cleanup `ctx.revert()` en `useEffect`
- `'use client'` solo donde se usen hooks/DOM/Three.js/Canvas
- Todo texto visible al usuario que provenga de `resume.json` debe tiparse como `LocalizedText` y resolverse con `t()`, nunca como string plano

## Pendientes conocidos
- Falta `eslint.config.*` en la raíz — `next lint` cae al asistente interactivo en vez de ejecutar
- Falta el modelo 3D real: `public/models/` solo contiene `.gitkeep`, sin `phoenix.glb`
- `Scene.tsx`, `FireSphere.tsx`, `Phoenix.tsx` y `resumeStore.ts` son código sin uso activo (candidatos a eliminar o a conectar, según se decida)

## Documentación
Ver `/docs/` para documentación de diseño y arquitectura original del proyecto (puede estar desactualizada respecto al código actual; este archivo es la referencia viva).
