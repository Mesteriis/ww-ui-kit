---
id: ADR-0019
title: Theme Capability Matrix And DOM Backed Runtime
status: accepted
date: 2026-03-30
owners:
  - platform
tags:
  - themes
  - runtime
  - governance
relatedPackages:
  - @ww/themes
  - @ww/tokens
  - @ww/core
  - @ww/primitives
supersedes: []
supersededBy: []
---

# ADR-0019 Theme Capability Matrix And DOM Backed Runtime

## Context

The repository already had a canonical `ThemeName` and derived `ThemeType`, generated theme CSS, and subtree theming. Review follow-up showed two missing pieces:

- runtime consumers needed sanctioned ways to patch density, motion posture, and higher-level personality without creating a second theme registry
- docs and governance needed a transparent matrix of what theme sheets are actually allowed to override

Ad hoc runtime helpers, extra registries, or app-local theme objects would have broken the existing `tokens -> themes -> primitives -> core` split and weakened public API governance.

## Decision

Keep theme runtime state DOM-backed and extend the existing `@ww/themes` contract.

- `setTheme(themeName, target?)` remains the canonical helper for concrete theme selection.
- `patchThemeRuntime(patch, target?)`, `readThemeRuntime(target?)`, and `observeThemeRuntime(target, listener)` are public `@ww/themes` helpers.
- Runtime writes stay limited to `data-ui-theme`, `data-ui-density`, `data-ui-motion-profile`, and `data-ui-personality`.
- `data-ui-theme-type` stays derived from `ThemeName`; it is never authored as a separate free axis.
- Density, motion-profile, personality, and responsive overrides are generated into the existing theme CSS exports rather than a second runtime registry.
- A canonical capability matrix in `@ww/themes` documents the sanctioned override families for foundations, component styles, system styles, density, typography, motion, personality, responsive tokens, and runtime attributes.

## Consequences

- Consumers can theme a subtree or the root with one runtime contract and no parallel source of truth.
- Theme capabilities become explicit in code, docs, Storybook, playground, and governance manifests.
- Lower layers keep their responsibilities: raw contracts remain in `@ww/tokens`, generated overrides remain in `@ww/themes`, motion behavior remains in `@ww/primitives`, and styled usage stays in `@ww/core` and higher layers.
- Adding new theme capabilities now requires updating the matrix, docs, proofs, tests, and public-surface governance instead of slipping in undocumented token drift.

## Alternatives

- A separate runtime theme store would duplicate DOM state and drift from scoped subtree theming.
- App-local density or personality classes would fragment public theming behavior.
- Encoding responsive overrides in app code would break generated theme-sheet ownership and make proofs harder to govern.

## Migration / Rollout

- Consumers keep using `setTheme()` for basic theme changes.
- Consumers that need richer runtime changes move to `patchThemeRuntime()` and `readThemeRuntime()`.
- Storybook and playground expose the same runtime attributes and capability matrix as public proof.
- Governance manifests and docs treat the runtime helpers and capability matrix as part of the supported `@ww/themes` surface.

## Related artifacts

- [`packages/themes/src/runtime.ts`](../../packages/themes/src/runtime.ts)
- [`packages/themes/src/theme-maps.ts`](../../packages/themes/src/theme-maps.ts)
- [`packages/themes/src/create-theme-sheet.ts`](../../packages/themes/src/create-theme-sheet.ts)
- [`packages/themes/README.md`](../../packages/themes/README.md)
- [`docs/architecture/golden-path.md`](../architecture/golden-path.md)
- [`apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts`](../../apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts)
- [`apps/playground/src/testing/routes/TestingHarnessView.vue`](../../apps/playground/src/testing/routes/TestingHarnessView.vue)
- [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)
