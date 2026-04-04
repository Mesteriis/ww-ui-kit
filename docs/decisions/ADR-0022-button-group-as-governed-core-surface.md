---
id: ADR-0022
title: Button Group As Governed Core Surface
status: accepted
date: 2026-04-03
owners:
  - platform
tags:
  - components
  - governance
  - public-api
relatedPackages:
  - @ww/core
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0022 Button Group As Governed Core Surface

## Context

The repository already exposes `UiButton` and `UiIconButton` as governed public action surfaces. Consumers also need adjacent action clusters for cases such as release actions, stacked secondary actions, and full-width button rows.

Leaving those layouts as ad hoc wrappers in apps, stories, or playground harnesses would weaken the public API contract and duplicate seam, layout, and accessibility conventions. At the same time, this use case does not justify a new selection runtime, toolbar orchestration layer, or segmented-control abstraction.

## Decision

Add `UiButtonGroup` as a governed `@ww/core` public surface for structural button clustering.

- `UiButtonGroup` is a layout and accessibility wrapper for adjacent `UiButton` and `UiIconButton` instances.
- Its public API stays intentionally small and explicit: `orientation`, `attached`, `wrap`, `block`, `ariaLabel`, and `ariaLabelledby`.
- The component reuses the existing button family styling contract and sanctioned tokens instead of creating a new primitive or a second source of truth for action state.
- Public-surface governance for the component is mandatory in the same change: exports, Storybook, playground harness coverage, component lab metadata, docs, tests, and release metadata.
- The component explicitly does not own segmented selection, roving-focus toolbar behavior, or product-specific action bars.

## Consequences

- Consumers get a stable, documented way to compose adjacent actions without rebuilding button seam and layout behavior.
- The core buttons family expands while keeping state ownership inside existing button consumers rather than inside the group surface.
- Future grouped-action behavior that requires owned selection or toolbar semantics must justify a separate governed surface instead of growing `UiButtonGroup` beyond structural composition.

## Alternatives

- Keeping grouping as local app markup would weaken Storybook and playground contract coverage and lead to inconsistent seams and accessibility labels.
- Modeling the need as a segmented control or toolbar would overfit the current requirement and add behavior that the component does not need to own.
- Adding a new primitive-layer surface would duplicate existing button styling and interaction contracts without a clear boundary benefit.

## Migration / Rollout

- Export `UiButtonGroup` from `@ww/core`.
- Register the surface in the public surface manifest and playground lab manifest.
- Add canonical Storybook stories, themed proofs, playground testing usage, docs, tests, and a changeset in the same delivery.
- Keep existing `UiButton` and `UiIconButton` APIs unchanged; grouped layout remains opt-in for consumers.

## Related artifacts

- [`packages/core/src/components/buttons/UiButtonGroup.vue`](../../packages/core/src/components/buttons/UiButtonGroup.vue)
- [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)
- [`tools/governance/catalog/playground-lab-manifest.mjs`](../../tools/governance/catalog/playground-lab-manifest.mjs)
- [`apps/docs/src/stories/Buttons.stories.ts`](../../apps/docs/src/stories/Buttons.stories.ts)
- [`apps/playground/src/testing/routes/TestingHarnessView.vue`](../../apps/playground/src/testing/routes/TestingHarnessView.vue)
- [`apps/playground/src/lab/schemas/ui-button-group.lab.ts`](../../apps/playground/src/lab/schemas/ui-button-group.lab.ts)
