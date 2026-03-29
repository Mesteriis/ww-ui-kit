---
id: ADR-0006
title: Motion System
status: accepted
date: 2026-03-20
owners:
  - platform
tags:
  - motion
  - primitives
relatedPackages:
  - @ww/tokens
  - @ww/themes
  - @ww/primitives
  - @ww/core
supersedes: []
supersededBy: []
---

# ADR-0006 Motion System

## Context

The UI kit already needed restrained default motion for core components, but future custom compositions also need a reusable catalog of presets and CSS utilities.

## Decision

Keep the motion catalog in foundation:

- base motion tokens and semantic motion/elevation contracts live in `@ww/tokens`
- theme-agnostic motion/elevation values are emitted through `@ww/themes`
- preset registry, runtime helpers, presence management, and collapse runtime live in `@ww/primitives`
- transition classes and utility selectors live in `@ww/core/styles/motion.css`

Reduced motion is handled at two levels:

- CSS overrides for utility classes and shared transition classes
- runtime fallback in preset resolution and collapse execution

## Consequences

- Core components share one restrained motion baseline.
- Future custom sections can use the same registry without depending on core components.
- Motion tokens, runtime, and CSS utilities can evolve independently without duplicating preset names.

## Alternatives

- Embedding motion only in core components would make future custom compositions copy behavior.
- Keeping only CSS utilities would not cover preset resolution, presence management, or collapse runtime.
- Keeping only runtime helpers would fragment the visual utility layer.

## Migration / Rollout

Existing component transitions move onto semantic motion tokens and shared preset/runtime helpers. Legacy per-component ad hoc transition values should be removed instead of extended.

## Related artifacts

- [`packages/primitives/src/motion`](../../packages/primitives/src/motion)
- [`packages/core/src/styles/motion.css`](../../packages/core/src/styles/motion.css)
- [`docs/architecture/testing-architecture.md`](../architecture/testing-architecture.md)
