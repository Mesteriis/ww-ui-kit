---
id: ADR-0029
title: Core Information And Result Surfaces
status: accepted
date: 2026-04-04
owners:
  - platform
tags:
  - components
  - display
  - feedback
  - governance
  - public-api
relatedPackages:
  - @ww/core
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0029 Core Information And Result Surfaces

## Context

The final second-wave `@ww/core` backlog row still covered six reusable surfaces that show or
capture information without introducing system-level orchestration:

- rating input for review and confidence scoring
- timeline rendering for milestone chronology
- descriptions layout for metadata blocks
- statistic display for values and countdowns
- result feedback for completed-state outcomes
- list rendering for repeatable item flows

Those contracts are broader than a single app proof but smaller than the ADR-first scopes such as
virtualized lists, alert dialogs, or product-specific dashboards. They must land on the governed
`@ww/core` path without adding a second source of truth for data orchestration, theme state, or
feedback systems.

## Decision

Add `UiRating`, `UiTimeline`, `UiDescriptions`, `UiStatistic`, `UiResult`, and `UiList` as
governed public `@ww/core` surfaces.

- `UiRating` lives in the field layer because it is an input contract with radiogroup keyboard and
  form integration semantics.
- `UiTimeline`, `UiDescriptions`, `UiStatistic`, and `UiList` live in the display layer because
  they present structured information without owning app-shell behavior or backend query state.
- `UiResult` lives in the feedback layer because it communicates an explicit outcome state with
  preset statuses and consumer-owned follow-up actions.
- The batch reuses existing tokens, feedback/display stylesheets, Storybook groups, playground
  harness coverage, public manifests, and core-only dependencies already sanctioned by ADR-0011.

## Consequences

- The second-wave `@ww/core` backlog is now fully implemented.
- Consumers get governed rating, metadata, metric, list, timeline, and result surfaces instead of
  app-local wrappers or duplicated feedback patterns.
- Accessibility, keyboard flow, loading states, pending states, and countdown behavior are now
  proven through the same docs, tests, and playground contours as the rest of `@ww/core`.
- Core still does not own virtualization, data fetching, analytics orchestration, route-level error
  systems, or imperative confirm APIs.

## Alternatives

- Leaving these surfaces app-local would fragment list pagination, rating keyboard behavior,
  metadata layout, and outcome presentation across products.
- Promoting them into a higher layer would overload widgets or page templates with generic baseline
  UI concerns.
- Extending an ADR-first scope such as virtual scroll or alert dialog just to ship these contracts
  would weaken governance boundaries and delay reusable baseline components unnecessarily.

## Migration / Rollout

- Export the six surfaces from `@ww/core`.
- Register them in the public surface manifest and the playground visual-surface manifest.
- Add Storybook coverage, themed proof, playground harness usage, docs, tests, ADR, and release
  metadata in the same delivery.
- Keep virtualization, alert-dialog confirm flows, icon pipeline work, and richer data/runtime
  scopes ADR-first and out of this decision.

## Related artifacts

- [`packages/core/src/components/fields/UiRating.vue`](../../packages/core/src/components/fields/UiRating.vue)
- [`packages/core/src/components/display/UiTimeline.vue`](../../packages/core/src/components/display/UiTimeline.vue)
- [`packages/core/src/components/display/UiDescriptions.vue`](../../packages/core/src/components/display/UiDescriptions.vue)
- [`packages/core/src/components/display/UiStatistic.vue`](../../packages/core/src/components/display/UiStatistic.vue)
- [`packages/core/src/components/display/UiList.vue`](../../packages/core/src/components/display/UiList.vue)
- [`packages/core/src/components/feedback/UiResult.vue`](../../packages/core/src/components/feedback/UiResult.vue)
- [`apps/docs/src/stories/Fields.stories.ts`](../../apps/docs/src/stories/Fields.stories.ts)
- [`apps/docs/src/stories/Display.stories.ts`](../../apps/docs/src/stories/Display.stories.ts)
- [`apps/docs/src/stories/Feedback.stories.ts`](../../apps/docs/src/stories/Feedback.stories.ts)
- [`apps/playground/src/testing/routes/TestingHarnessView.vue`](../../apps/playground/src/testing/routes/TestingHarnessView.vue)
- [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)
- [`tools/governance/catalog/playground-lab-manifest.mjs`](../../tools/governance/catalog/playground-lab-manifest.mjs)
