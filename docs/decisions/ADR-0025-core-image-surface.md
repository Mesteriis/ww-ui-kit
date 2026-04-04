---
id: ADR-0025
title: Core Image Surface
status: accepted
date: 2026-04-03
owners:
  - platform
tags:
  - components
  - governance
  - display
  - public-api
relatedPackages:
  - @ww/core
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0025 Core Image Surface

## Context

The second-wave backlog still had a gap for a governed base image surface. Consumers already need a reusable way to frame images inside cards, data summaries, and content sections without re-creating fallback markup, aspect-ratio handling, or caption treatment in local code.

The repository also already distinguishes base media display from richer overlay-driven behavior. Preview groups, zoom, rotate, gallery navigation, and image lightboxes remain explicit follow-up scope and must not leak into a simple display primitive.

## Decision

Add `UiImage` as a governed `@ww/core` display surface.

- `UiImage` owns the base contract for `src`, `alt`, optional caption, fallback rendering, fit, and sanctioned aspect-ratio presets.
- The component reuses existing theme tokens for surface, border, radius, and text treatment instead of creating new image-specific token maps.
- The public contract stays display-only: no preview overlays, gallery grouping, rotation, or transport workflow.
- Governance proof for the new public surface is mandatory in the same delivery: exports, manifests, Storybook coverage, themed proof, playground harness usage, lab schema, docs, tests, and release metadata.

## Consequences

- Consumers get a stable, typed image primitive that handles fallback and framing consistently across the kit.
- The core layer gains image display coverage without collapsing the separate scope reserved for preview and gallery overlays.
- Future image-preview work must build on `UiImage` where sensible, but it still needs its own scope and governance path before becoming public API.

## Alternatives

- Leaving image framing to app-local wrappers would fragment fallback handling and aspect treatment across stories and consumers.
- Folding preview behavior into the base image component would create a misleading public contract and mix display scope with overlay runtime concerns.
- Exporting an icon-or-avatar workaround instead of an image surface would keep a real platform gap open in the display layer.

## Migration / Rollout

- Export `UiImage` from `@ww/core`.
- Register the surface in the public surface manifest and playground lab manifest.
- Add Storybook coverage, theme proof, playground harness usage, docs, tests, and a changeset in the same delivery.
- Keep preview/gallery work out of the component until separate scope is approved.

## Related artifacts

- [`packages/core/src/components/display/UiImage.vue`](../../packages/core/src/components/display/UiImage.vue)
- [`packages/core/src/styles/display.css`](../../packages/core/src/styles/display.css)
- [`apps/docs/src/stories/Display.stories.ts`](../../apps/docs/src/stories/Display.stories.ts)
- [`apps/playground/src/testing/routes/TestingHarnessView.vue`](../../apps/playground/src/testing/routes/TestingHarnessView.vue)
- [`apps/playground/src/lab/schemas/ui-image.lab.ts`](../../apps/playground/src/lab/schemas/ui-image.lab.ts)
- [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)
- [`tools/governance/catalog/playground-lab-manifest.mjs`](../../tools/governance/catalog/playground-lab-manifest.mjs)
