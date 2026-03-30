---
id: ADR-0003
title: Primitives Core Split
status: accepted
date: 2026-03-18
owners:
  - platform
tags:
  - primitives
  - core
relatedPackages:
  - @ww/primitives
  - @ww/core
supersedes: []
supersededBy: []
---

# ADR-0003 Primitives Core Split

## Context

Behavioral concerns such as portals, focus management, scroll locking, and roving focus are reused across multiple components.

The core layer now also carries a wider baseline surface beyond the first-wave buttons, inputs, overlays, and selection controls. Rich but still baseline controls such as avatars, numeric inputs, rich selects, autocomplete, menus, progress, steps, and simple tables need shared behavior without turning `@ww/core` into a layout, widget, or systems layer.

## Decision

Keep behavior-only building blocks in `@ww/primitives` and build styled user-facing components in `@ww/core`.

For later core waves:

- shared low-level behavior may move into `@ww/primitives` only when at least two families can reuse the same contract without product-specific assumptions
- styled baseline components remain in `@ww/core`, including richer collection and data-entry surfaces
- layout shells, page templates, widgets, router-aware navigation, and system-scale table/grid engines stay out of `@ww/core`

## Consequences

- Accessibility logic can be tested once and reused.
- Core components remain simpler and more consistent.
- Styling concerns stay out of primitives.
- Core can expand with baseline reusable controls without introducing parallel overlay, collection, or numeric helper runtimes.
- Structural layout shells remain in `@ww/page-templates`, while system-scale table behavior remains outside `@ww/core`.

## Alternatives

- Embedding every behavior directly in each component would duplicate logic.
- A single combined layer would make dependency direction harder to enforce.

## Migration / Rollout

When a core component contains reusable low-level behavior, extract it into primitives only if another component can consume the same contract without product-specific assumptions.

Second-wave core work should continue to follow the same split:

- sanctioned overlay behavior stays on the shared overlay path
- shared listbox, menu, typeahead, or numeric helpers only move down when they are truly behavior-level contracts
- composed shells and business widgets do not move into `@ww/core` just because they render baseline controls

## Related artifacts

- [`packages/primitives`](../../packages/primitives)
- [`packages/core`](../../packages/core)
- [`docs/architecture/layer-governance.md`](../architecture/layer-governance.md)
