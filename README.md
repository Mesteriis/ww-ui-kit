# Belovodye UiKit Monorepo

Production-grade Vue 3 + TypeScript foundation for Belovodye UiKit. The current scope covers tokens, themes, primitives, core components, motion foundation, overlay/layer foundation, optional feature adapters, widget shells, and page-template shells.

## Architecture

The repository is a pnpm workspace with strict layer boundaries:

1. `@ww/tokens`
   Defines typed base, semantic, component, motion, elevation, and layer contracts.
2. `@ww/themes`
   Maps theme-specific semantic and component values onto `light`, `dark`, and `belovodye`.
3. `@ww/primitives`
   Exposes low-level behavior, motion runtime, portal resolution, and overlay stack management.
4. `@ww/core`
   Exposes styled components that consume semantic/component variables and shared primitives.
5. `systems`
   Optional larger subsystems such as `@ww/charts-apex` and `@ww/signal-graph`.
6. `@ww/widgets`
   Black-box composition layer for reusable UI blocks above core and systems.
7. `@ww/page-templates`
   Layout shell layer for reusable page compositions. These are not route pages.
8. `@ww/docs`
   Storybook source of truth for states, motion catalog demos, and overlay behavior.
9. `@ww/playground`
   Real consumer app for end-to-end integration checks.

Core CSS only consumes semantic and component variables. Raw palette values, easing curves, and z-index numbers do not belong in components.

## Packages

- `@ww/tokens`
- `@ww/themes`
- `@ww/primitives`
- `@ww/core`
- `@ww/charts-apex`
- `@ww/signal-graph`
- `@ww/widgets`
- `@ww/page-templates`
- `@ww/eslint-config`
- `@ww/tsconfig`
- `@ww/docs`
- `@ww/playground`

## Available themes

- `light`
  Type: `light`. Neutral light baseline for general product surfaces.
- `dark`
  Type: `dark`. High-contrast dark baseline for low-light interfaces.
- `belovodye`
  Type: `light`. A cool premium light theme with white-stone surfaces, slate-blue text, restrained river-blue accents, and soft overlay depth.

## Dependency graph

```text
@ww/tokens
  -> @ww/themes
  -> @ww/core

vue
  -> @ww/primitives
  -> @ww/core

@ww/primitives
  -> @ww/core

systems
  = @ww/charts-apex, @ww/signal-graph, and future larger subsystems

@ww/core + systems
  -> @ww/widgets

@ww/core + systems + optionally @ww/widgets
  -> @ww/page-templates

apps/*
  -> @ww/core
  -> systems
  -> @ww/widgets
  -> @ww/page-templates
```

Current scaffold keeps `@ww/page-templates` shell-only and independent from `@ww/widgets` at the package level until a real reusable template needs a hard dependency.

## Motion system

Motion is a first-class foundation layer:

- token contracts live in `@ww/tokens`
- theme-agnostic semantic motion/elevation values are emitted by `@ww/themes`
- preset registry, runtime helpers, presence management, and collapse runtime live in `@ww/primitives`
- shared transition CSS utilities live in `@ww/core/styles/motion.css`

Public motion API from `@ww/primitives`:

- `MOTION_PRESETS`
- `MOTION_PRESET_NAMES`
- `MOTION_TAXONOMY`
- `prefersReducedMotion()`
- `resolveMotionPreset()`
- `resolveTransitionMotionPreset()`
- `resolveCollapseMotionPreset()`
- `applyTransitionMotionVariables()`
- `clearTransitionMotionVariables()`
- `createTransitionGroupMotionStyle()`
- `useMotionPresence()`
- `runCollapseMotion()`

Example:

```ts
import {
  applyTransitionMotionVariables,
  clearTransitionMotionVariables,
  resolveTransitionMotionPreset
} from '@ww/primitives';

const preset = resolveTransitionMotionPreset('modal-fade-scale');
applyTransitionMotionVariables(element, preset, 'enter');
clearTransitionMotionVariables(element);
```

Utility motion is available through `data-ui-motion`:

- `lift-xs`, `lift-sm`
- `ring-focus-soft`, `ring-focus-strong`
- `underline-slide`
- `loading-shimmer`, `loading-sweep`
- `glow-accent`, `pulse-soft`, `shake-error-sm`

Future components and hero sections should consume the preset registry and utility CSS instead of re-authoring ad hoc transitions.

## Overlay and layer system

Overlay behavior is centralized in `@ww/primitives`:

- `readOverlayLayerScale()`
- `resolveOverlayLayerSlots()`
- `ensureOverlayPortalRoot()`
- `registerOverlay()`
- `useOverlaySurface()`

The stack manager owns:

- deterministic z-index allocation from `--ui-z-*`
- nested overlay ordering
- topmost-only `Escape` dismiss
- topmost-only outside interaction dismiss
- focus containment
- centralized scroll lock

### Theme-aware portal mounting

Overlays do not always mount into `document.body`.

- If the opener lives under a scoped `[data-ui-theme]` container, the portal root is created inside that subtree.
- If there is no scoped theme container, a global body portal root is used.
- `UiDialog` and `UiDrawer` also support an optional `portalTarget` prop for explicit mounting.

This keeps overlay surfaces inheriting the correct CSS custom properties, `data-ui-theme`, `data-ui-theme-type`, and browser `color-scheme` behavior even when themes are applied to arbitrary subtree containers.

## Using themes

### ThemeName vs ThemeType

- `ThemeName` is a concrete theme such as `light`, `dark`, or `belovodye`.
- `ThemeType` is derived metadata and is only `light` or `dark`.
- Each theme has exactly one canonical type.
- Theme type is not a second free axis. `belovodye + dark` is not a valid state.
- The canonical source of truth lives in `@ww/themes`.

Public helpers:

- `THEMES`
- `THEME_NAMES`
- `THEME_TYPES`
- `getThemeMeta(themeName)`
- `getThemeType(themeName)`
- `getThemesByType(themeType)`
- `isLightTheme(themeName)`
- `isDarkTheme(themeName)`
- `setTheme(themeName, target?)`

Import the theme sheets you need:

```ts
import '@ww/themes/theme-light.css';
import '@ww/themes/theme-dark.css';
import '@ww/themes/theme-belovodye.css';
```

Apply a theme globally:

```ts
import { getThemeMeta, setTheme } from '@ww/themes';

setTheme('belovodye');

const theme = getThemeMeta('belovodye');
console.log(theme.type); // "light"
```

Apply a theme to a subtree container:

```html
<section data-ui-theme="belovodye" data-ui-theme-type="light">
  <!-- scoped theme -->
</section>
```

Or with the helper:

```ts
import { setTheme } from '@ww/themes';

setTheme('belovodye', containerElement);
```

Filter themes by family:

```ts
import { getThemesByType } from '@ww/themes';

const lightThemes = getThemesByType('light');
const darkThemes = getThemesByType('dark');
```

Scoped overlays keep inheriting the same theme because dialog and drawer portal roots resolve inside the nearest themed container unless an explicit `portalTarget` is supplied. The portal contract preserves both `data-ui-theme` and `data-ui-theme-type`, so browser `color-scheme` and scoped theme variables stay aligned.

## Optional charts adapter

`@ww/charts-apex` is an optional vendor-backed package. It is intentionally separate from `@ww/core`.

- `@ww/core` stays free of chart-library dependencies
- consumers use `UiApexChart` instead of raw Apex setup
- no global `app.use()` registration is required
- consumer code does not import vendor feature entries or vendor CSS directly

Usage:

```ts
import '@ww/charts-apex/styles.css';
import { UiApexChart } from '@ww/charts-apex';
```

```vue
<UiApexChart
  type="line"
  :series="series"
  :options="options"
  title="Traffic"
  description="Theme-aware Apex adapter"
/>
```

The adapter reads the nearest themed container, derives chart defaults from the active theme and `ThemeType`, respects reduced motion, and exposes loading, empty, and error states without leaking vendor setup into apps.

License note:

`@ww/charts-apex` wraps ApexCharts. Consumers should verify that the ApexCharts license is suitable for their use case.

## Optional signal graph package

`@ww/signal-graph` is an optional feature package for interactive graph UI. It is intentionally separate from `@ww/core`.

- Vue Flow is used as an internal engine, not as the public API
- the public surface is a black-box `UiSignalGraph`
- nodes are real Vue components supplied through `nodeDefinitions`
- signals, focus/depth, viewport helpers, and subtree theming are handled inside the package

Usage:

```ts
import '@ww/signal-graph/styles.css';
import { UiSignalGraph } from '@ww/signal-graph';
```

```vue
<UiSignalGraph
  :nodes="nodes"
  :edges="edges"
  :node-definitions="nodeDefinitions"
  :signals="signals"
  depth-mode="full"
  show-background
  show-controls
/>
```

Each node maps `node.type` to a renderer declared in `nodeDefinitions`:

```ts
import { createSignalGraphNodeDefinition } from '@ww/signal-graph';

const nodeDefinitions = {
  service: createSignalGraphNodeDefinition({
    component: ServiceNode,
    label: 'Service',
    glass: true,
  }),
};
```

Signals can come from the controlled `signals` prop or from the exposed handle:

```ts
graphRef.value?.emitSignal({
  id: 'sig-1',
  edgeId: 'gateway-pipeline',
  variant: 'success',
  direction: 'forward',
  intensity: 'md',
});
```

The package reads the nearest themed container, respects `ThemeType`, works in scoped subtrees, keeps overlays opened from node content inside the correct theme scope, and softens pulse travel when reduced motion is active.

## Widgets and page templates

`@ww/widgets` and `@ww/page-templates` add the next reusable layers above the base foundation.

- `@ww/widgets`
  Use this layer for black-box UI blocks such as future `LoginWindow`, `DataTableWidget`, `DashboardSummaryWidget`, or `ActivityFeedWidget`.
- `@ww/page-templates`
  Use this layer for reusable page shells such as future `AuthPageTemplate`, `WorkspacePageTemplate`, or `DashboardPageTemplate`.
- `apps/*`
  Real route pages still live here. They own routing, domain orchestration, and backend integration.

### Shell usage

```ts
import '@ww/widgets/styles.css';
import '@ww/page-templates/styles.css';
```

```vue
<UiPageTemplate
  title="Workspace"
  description="Reusable page shell"
  has-sidebar
>
  <template #toolbar>
    <UiButton variant="secondary">Refresh</UiButton>
  </template>

  <UiPageSection title="Primary content">
    <UiWidgetShell title="Summary widget">
      Widget content goes here.
    </UiWidgetShell>
  </UiPageSection>

  <template #sidebar>
    Sidebar content
  </template>
</UiPageTemplate>
```

### Placement guide

- `LoginWindow` -> `@ww/widgets`
- `DataTableWidget` -> `@ww/widgets`
- `AuthPageTemplate` -> `@ww/page-templates`
- `DashboardPageTemplate` -> `@ww/page-templates`
- actual route page -> `apps/*`

## Commands

- `pnpm install`
- `pnpm dev:docs`
- `pnpm dev:playground`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm changeset`
- `make docs`
- `make playground`

## Layer rules

- Tokens are the source of truth for names and contracts.
- Themes only own theme-specific colors, surfaces, borders, and component mappings.
- Motion and layer semantics remain theme-agnostic.
- Primitives own behavior, runtime, and portal/layer management.
- Core components use shared foundation defaults instead of local ad hoc overlay or transition logic.
- Consumers must use package exports, not deep imports into source files.

## Add a new component

1. Add new semantic or component tokens only if the existing contracts are insufficient.
2. Extend the theme maps when the component needs new theme-specific values.
3. Add reusable low-level behavior to `@ww/primitives` only if it is genuinely foundational.
4. Choose the right layer:
   universal control -> `@ww/core`
   subsystem or vendor-backed engine -> systems package
   black-box composed block -> `@ww/widgets`
   reusable page shell -> `@ww/page-templates`
   real route page -> `apps/*`
5. Use motion presets or utilities instead of local transition literals.
6. Add Storybook stories and behavior tests.

## Add a new theme

1. Add the theme map in `packages/themes/src/theme-maps.ts`.
2. Register the theme in the canonical `THEMES` metadata with its required `type`.
3. Generate the CSS sheet with `createThemeSheet()`.
4. Export the CSS file from `@ww/themes`.
5. Apply it with `setTheme('theme-name', target)` or matching `data-ui-theme` and `data-ui-theme-type` attributes.
6. Re-run docs and playground to verify scoped overlays and motion/elevation still inherit correctly.
