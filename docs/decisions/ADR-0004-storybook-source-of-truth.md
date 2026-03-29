---
id: ADR-0004
title: Storybook Source Of Truth
status: accepted
date: 2026-03-18
owners:
  - platform
tags:
  - docs
  - storybook
relatedPackages:
  - @ww/docs
  - @ww/core
supersedes: []
supersededBy: []
---

# ADR-0004 Storybook Source Of Truth

## Context

The foundation needs a practical way to document states, accessibility expectations, and usage examples without building a custom docs framework.

## Decision

Use Storybook as the primary source of truth for documented states and examples. Each public UI surface must have canonical stories that cover its required variants.

## Consequences

- Design and engineering review share the same examples.
- Regression triage gets faster because stories describe expected states.
- Story maintenance becomes part of public API work instead of optional polish.

## Alternatives

- Custom documentation pages would add unnecessary framework work.
- README-only examples would not exercise interactive states well enough.

## Migration / Rollout

Move canonical examples from ad hoc docs into stories when components evolve. Story requirements are now also enforced through the governance catalog.

## Related artifacts

- [`apps/docs`](../../apps/docs)
- [`tools/governance/checks/check-stories.mjs`](../../tools/governance/checks/check-stories.mjs)
- [`docs/architecture/docs-as-contract.md`](../architecture/docs-as-contract.md)
