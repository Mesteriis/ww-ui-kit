---
id: ADR-0027
title: Core Scroll And Anchor Utilities
status: accepted
date: 2026-04-04
owners:
  - platform
tags:
  - components
  - governance
  - layout
  - navigation
  - public-api
relatedPackages:
  - @ww/core
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0027 Core Scroll And Anchor Utilities

## Context

The remaining second-wave backlog still had no governed answer for sticky utility content, explicit scroll regions, return-to-top affordances, or section-anchor navigation.

Those needs were already appearing beside the newly added layout utilities, but they are not page-template shells and they do not justify a separate system package. Leaving them as app-local wrappers would fragment scroll semantics, sticky behavior, active-section tracking, and Storybook proof across consumers.

## Decision

Add `UiAffix`, `UiScrollArea`, `UiScrollTop`, and `UiAnchor` as governed `@ww/core` utilities.

- `UiAffix` owns sticky utility framing with explicit top/bottom offsets and stuck-state events.
- `UiScrollArea` owns reusable scroll-region semantics, tokenized scrollbar styling, orientation, sizing, and imperative viewport helpers.
- `UiScrollTop` owns threshold-driven return-to-top affordances against a known target.
- `UiAnchor` owns section-link navigation, active-section tracking, offsets, and smooth scrolling.
- The family stays in `@ww/core` because it serves reusable composition work inside cards, dashboards, docs-like panes, and forms without becoming route-aware shell infrastructure.
- Governance proof ships in the same delivery: exports, manifests, Storybook, themed proof, playground harness coverage, lab coverage where appropriate, docs, tests, and release metadata.

## Consequences

- Consumers now have a sanctioned scroll and section-navigation baseline without rebuilding the same target-resolution and scroll math in app code.
- The core layer grows utility scroll behavior while preserving the boundary that keeps shell orchestration and route-level scroll ownership out of `@ww/core`.
- Future needs such as virtual scrolling, document viewers, or rich knowledge-base navigation still require separate scope and must not piggyback on this utility family.

## Alternatives

- Keeping scroll helpers app-local would weaken public-surface governance and encourage multiple incompatible sticky/anchor contracts.
- Pushing the family into page templates would blur the line between reusable utility behavior and shell ownership.
- Deferring the work would leave an obvious hole next to the newly shipped layout utility row.

## Migration / Rollout

- Export `UiAffix`, `UiScrollArea`, `UiScrollTop`, and `UiAnchor` from `@ww/core`.
- Register the family in the public surface manifest and the playground lab manifest.
- Add Storybook, themed proof, playground harness usage, docs, tests, and release metadata in the same pass.
- Keep route-level scroll orchestration and virtualized/document-viewer concerns out of this family.

## Related artifacts

- [`packages/core/src/components/layout/UiAffix.vue`](../../packages/core/src/components/layout/UiAffix.vue)
- [`packages/core/src/components/layout/UiScrollArea.vue`](../../packages/core/src/components/layout/UiScrollArea.vue)
- [`packages/core/src/components/layout/UiScrollTop.vue`](../../packages/core/src/components/layout/UiScrollTop.vue)
- [`packages/core/src/components/navigation/UiAnchor.vue`](../../packages/core/src/components/navigation/UiAnchor.vue)
- [`packages/core/src/components/shared/scroll.ts`](../../packages/core/src/components/shared/scroll.ts)
- [`packages/core/src/styles/layout.css`](../../packages/core/src/styles/layout.css)
- [`packages/core/src/styles/navigation.css`](../../packages/core/src/styles/navigation.css)
- [`apps/docs/src/stories/Layout.stories.ts`](../../apps/docs/src/stories/Layout.stories.ts)
- [`apps/docs/src/stories/Navigation.stories.ts`](../../apps/docs/src/stories/Navigation.stories.ts)
- [`apps/playground/src/testing/routes/TestingHarnessView.vue`](../../apps/playground/src/testing/routes/TestingHarnessView.vue)
- [`apps/playground/src/lab/schemas/ui-scroll-area.lab.ts`](../../apps/playground/src/lab/schemas/ui-scroll-area.lab.ts)
- [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)
- [`tools/governance/catalog/playground-lab-manifest.mjs`](../../tools/governance/catalog/playground-lab-manifest.mjs)
