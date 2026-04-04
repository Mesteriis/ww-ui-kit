---
id: ADR-0037
title: Core Media Preview Watermark And Icon Surfaces
status: accepted
date: 2026-04-04
owners:
  - platform
tags:
  - core
  - display
  - icon
relatedPackages:
  - @ww/core
  - @ww/primitives
supersedes: []
supersededBy: []
---

# ADR-0037 Core Media Preview Watermark And Icon Surfaces

## Context

The repo already has `UiImage` as the governed base media surface, but preview, watermark, and icon
behavior are still absent or scattered. Raw glyph strings and inline SVGs across components weaken
the public contract and complicate adoption.

## Decision

`UiImagePreview`, `UiImagePreviewGroup`, `UiWatermark`, and `UiIcon` land in `@ww/core`.

`UiIcon` becomes the single canonical icon surface:

- built-in named registry with token-driven sizing and tone
- decorative icons default to `aria-hidden`
- semantic icons require explicit labels
- internal component implementations render icons through `UiIcon` instead of inline SVG markup

`UiImagePreview` / `UiImagePreviewGroup` contract:

- modal overlay preview over governed `UiImage`
- zoom, rotate, previous/next, and grouped navigation
- controlled-first `open` and `activeIndex`
- grouped previews share one runtime instead of separate per-image dialogs

`UiWatermark` contract:

- display utility that repeats text or image marks over slot content
- canvas/SVG generation is internal and token-driven
- no DRM or anti-screenshot claims in the public contract

## Consequences

- The display layer gets one canonical icon path and one preview runtime.
- Existing components can stop scattering inline SVG or raw glyph wrappers.
- `UiImage` remains the base display surface while preview behavior composes above it without
  requiring a new package.

## Alternatives

- Treating icon work as app-local would keep raw icon behavior duplicated across core surfaces.
- Moving preview into a systems package would separate a reusable media display extension from the
  base image layer unnecessarily.
- Treating watermark as product security tooling would overstate its real reusable scope.

## Migration / Rollout

- Add a governed icon registry and adopt it across existing icon-bearing components.
- Wire preview group support into `UiImage` without creating a second image source of truth.
- Keep watermark rendering optional and slot-based so it composes with existing display surfaces.

## Related artifacts

- [`packages/core`](../../packages/core)
- [`docs/todo-components.md`](../todo-components.md)
