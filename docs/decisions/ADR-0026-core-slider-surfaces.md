---
id: ADR-0026
title: Core Slider Surfaces
status: accepted
date: 2026-04-04
owners:
  - platform
tags:
  - components
  - governance
  - fields
  - public-api
relatedPackages:
  - @ww/core
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0026 Core Slider Surfaces

## Context

The second-wave `@ww/core` backlog still had no governed slider surface. Consumers needed a sanctioned way to express bounded numeric adjustments and dual-thumb range selection without re-implementing keyboard flow, field wiring, marks, or min-gap rules in app code.

The gap also sat next to existing field surfaces such as `UiNumberInput`, `UiSelect`, and `UiAutocomplete`, so leaving sliders out would keep an obvious hole in the current public field cluster.

## Decision

Add `UiSlider` and `UiRangeSlider` as governed `@ww/core` field surfaces.

- `UiSlider` owns single-value numeric selection with `min`, `max`, `step`, `marks`, tooltip formatting, and optional numeric input proof.
- `UiRangeSlider` owns two-thumb bounded selection with the same numeric contract plus `minRange`.
- Both surfaces stay in the field layer, consume sanctioned theme tokens, and integrate with `UiField` ARIA wiring instead of introducing a second form runtime.
- The public contract is intentionally numeric-only. Date timelines, chart brushing, timeline orchestration, and product-specific analytics behaviors remain out of scope.
- Governance proof ships in the same delivery: exports, manifests, Storybook, playground harness, docs, tests, lab coverage where appropriate, and release metadata.

## Consequences

- `@ww/core` now covers baseline slider interactions without forcing consumers into ad hoc wrappers.
- `UiRangeSlider` keeps dual-thumb behavior inside a governed surface instead of drifting into local implementation variants.
- Future richer time or date selection still requires separate scope and must not piggyback on the numeric slider contract.

## Alternatives

- Deferring sliders further would keep a visible field-family gap and encourage unsanctioned local implementations.
- Shipping only `UiSlider` would leave range selection fragmented across apps.
- Treating sliders as overlay or chart infrastructure would misplace a basic field control into the wrong layer.

## Migration / Rollout

- Export `UiSlider` and `UiRangeSlider` from `@ww/core`.
- Register the new public surface in the public manifest and playground lab manifest.
- Add Storybook, themed proof, playground harness usage, docs, tests, and release metadata in the same pass.
- Keep non-numeric timeline/date semantics out of the slider family.

## Related artifacts

- [`packages/core/src/components/fields/UiSlider.vue`](../../packages/core/src/components/fields/UiSlider.vue)
- [`packages/core/src/components/fields/UiRangeSlider.vue`](../../packages/core/src/components/fields/UiRangeSlider.vue)
- [`packages/core/src/components/fields/slider.ts`](../../packages/core/src/components/fields/slider.ts)
- [`packages/core/src/styles/input.css`](../../packages/core/src/styles/input.css)
- [`apps/docs/src/stories/Fields.stories.ts`](../../apps/docs/src/stories/Fields.stories.ts)
- [`apps/playground/src/testing/routes/TestingHarnessView.vue`](../../apps/playground/src/testing/routes/TestingHarnessView.vue)
- [`apps/playground/src/lab/schemas/ui-slider.lab.ts`](../../apps/playground/src/lab/schemas/ui-slider.lab.ts)
- [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)
- [`tools/governance/catalog/playground-lab-manifest.mjs`](../../tools/governance/catalog/playground-lab-manifest.mjs)
