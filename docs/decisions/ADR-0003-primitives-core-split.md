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

## Decision

Keep behavior-only building blocks in `@ww/primitives` and build styled user-facing components in `@ww/core`.

## Consequences

- Accessibility logic can be tested once and reused.
- Core components remain simpler and more consistent.
- Styling concerns stay out of primitives.

## Alternatives

- Embedding every behavior directly in each component would duplicate logic.
- A single combined layer would make dependency direction harder to enforce.

## Migration / Rollout

When a core component contains reusable low-level behavior, extract it into primitives only if another component can consume the same contract without product-specific assumptions.

## Related artifacts

- [`packages/primitives`](../../packages/primitives)
- [`packages/core`](../../packages/core)
- [`docs/architecture/layer-governance.md`](../architecture/layer-governance.md)

