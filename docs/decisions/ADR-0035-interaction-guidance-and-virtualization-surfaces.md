---
id: ADR-0035
title: Interaction Guidance And Virtualization Surfaces
status: accepted
date: 2026-04-04
owners:
  - platform
tags:
  - systems
  - virtualization
  - tour
relatedPackages:
  - @ww/interaction
  - @ww/core
  - @ww/primitives
supersedes: []
supersededBy: []
---

# ADR-0035 Interaction Guidance And Virtualization Surfaces

## Context

Virtualization and guided tours both require coordinated runtime state that outgrows baseline core
controls. The repo already has scroll and overlay utilities, but not a governed measurement engine,
infinite-loading contract, or spotlighted onboarding runtime.

## Decision

`UiVirtualScroll`, `UiVirtualList`, `UiInfiniteScroll`, and `UiTour` live in `@ww/interaction`.

Virtualization contract:

- one shared windowing engine with `itemSize`, `overscan`, viewport size, and total-count inputs
- `UiVirtualScroll` is the low-level scroller shell
- `UiVirtualList` is the consumer-facing item renderer
- `UiInfiniteScroll` composes the same engine with a load-more callback and sentinel state

Tour contract:

- `UiTour` composes over the existing overlay stack and spotlight mask
- steps are explicit objects with `target`, `title`, `description`, and optional action labels
- step index and open state are controlled-first with internal fallback
- focus restore, `Escape`, next/previous, and scroll-to-target behavior are structural

Async/data rules are explicit:

- virtualization never fetches; it only renders the viewport
- infinite scroll delegates loading to consumer callbacks
- tour does not own analytics, storage, or product onboarding policy

## Consequences

- One systems package owns high-frequency windowing and guided overlay behavior.
- Tree, transfer, and other dense collection surfaces can share the same virtualization engine.
- Core scroll utilities remain smaller and layout-focused.

## Alternatives

- Putting virtualization in `@ww/core` would force a stateful measurement engine into the baseline
  layer.
- Leaving tour behavior to apps would duplicate spotlight logic, focus restore, and overlay
  placement.
- Splitting tour and virtualization into separate packages now would add package overhead before the
  shared interaction package settles.

## Migration / Rollout

- Reuse existing scroll, anchor, and overlay foundations instead of creating parallel portals or
  observers.
- Keep infinite-load callbacks explicit and cancellable.
- Use the same virtualization primitives inside hierarchical collection surfaces.

## Related artifacts

- [`docs/architecture/placement-rules.md`](../architecture/placement-rules.md)
- [`docs/todo-components.md`](../todo-components.md)
