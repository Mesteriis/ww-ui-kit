# ADR-0009 Interactive Signal Graph UI

## Context

The repository already has a strong foundation for tokens, themes, motion, overlays, and baseline components. The next capability is a richer runtime surface where the UI itself can behave like a live graph of nodes, edges, and transient signals. This is more than a single core component, but it is not a generic editor framework.

## Decision

Interactive Signal Graph UI lives in a separate optional package: `@ww/signal-graph`.

- Vue Flow is used as an internal engine, not as the public API.
- The public surface is `UiSignalGraph` plus typed signal-graph model types.
- Node renderers are real Vue components supplied through `nodeDefinitions`.
- Signal runtime, focus/depth derivation, and viewport helpers are centralized inside the package.
- Theme, ThemeType, motion, and overlay systems are reused from the existing foundation.
- The first version is a runtime graph interface, not a graph editor.

## Consequences

- Product code does not import `@vue-flow/*` for baseline usage.
- `@ww/core` remains free of graph-engine dependencies.
- Rich node content can use existing UI kit primitives and core components.
- Scoped themes and overlays inside nodes continue to work through the existing theme-aware portal system.
- Future higher-level graph products can build on the same package without copying focus, signal, or theme logic.

## Alternatives

- Adding graph UI into `@ww/core` would turn a feature package into baseline component surface and pull vendor weight into the wrong layer.
- Exposing raw Vue Flow components and store directly would leak vendor knowledge into consumer apps.
- Building a generic editor framework now would overreach the first-version goal and create unnecessary abstraction cost.
- Replacing Vue Flow with a custom canvas engine would delay delivery and bypass the existing DOM/component strengths of the repo.

## Migration

- The package is additive and optional.
- Apps that do not use graph UI do not need the package.
- Consumer code should model nodes/edges/signals with `@ww/signal-graph` types instead of raw Vue Flow types.
