---
id: ADR-0001
title: Monorepo
status: accepted
date: 2026-03-18
owners:
  - platform
tags:
  - repo
  - workspace
relatedPackages:
  - @ww/tokens
  - @ww/themes
  - @ww/primitives
  - @ww/core
supersedes: []
supersededBy: []
---

# ADR-0001 Monorepo

## Context

The UI kit foundation spans shared tokens, themes, behavior primitives, styled components, and consumer-facing validation apps. These concerns must evolve together without hiding package boundaries.

## Decision

Use a pnpm workspace monorepo with separate packages for each layer and shared config packages for TypeScript and ESLint.

## Consequences

- Cross-package boundaries stay explicit.
- Tooling and release management can be centralized.
- Build, typecheck, and test order must respect the dependency graph.

## Alternatives

- A single package with folders would reduce setup but blur package contracts.
- Multiple repositories would isolate concerns but slow down coordinated changes.

## Migration / Rollout

This was the initial repository shape. Future packages must join the same workspace instead of creating parallel repos for foundational UI layers.

## Related artifacts

- [`pnpm-workspace.yaml`](../../pnpm-workspace.yaml)
- [`docs/architecture/layer-governance.md`](../architecture/layer-governance.md)
