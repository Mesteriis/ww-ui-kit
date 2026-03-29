---
id: ADR-0002
title: Token Theme Split
status: accepted
date: 2026-03-18
owners:
  - platform
tags:
  - tokens
  - themes
relatedPackages:
  - @ww/tokens
  - @ww/themes
supersedes: []
supersededBy: []
---

# ADR-0002 Token Theme Split

## Context

The system needs stable token contracts while still allowing multiple runtime themes and future additions.

## Decision

Separate token contracts from theme values. `@ww/tokens` owns typed token names and base scales. `@ww/themes` maps semantic and component variables onto theme-specific values and exports CSS plus runtime helpers.

## Consequences

- Components stay unaware of concrete theme names.
- Adding themes does not require component rewrites.
- Theme drift is easier to detect because contracts live in one package.

## Alternatives

- Embedding theme values in components would speed up early work but break scalability.
- Using only base tokens in component CSS would couple visuals to raw scales.

## Migration / Rollout

If existing component styles referenced raw palette values, replace them with semantic or component variables first, then map those variables inside themes.

## Related artifacts

- [`packages/tokens`](../../packages/tokens)
- [`packages/themes`](../../packages/themes)
- [`docs/architecture/public-api-discipline.md`](../architecture/public-api-discipline.md)

