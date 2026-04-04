---
id: ADR-0028
title: Core Field Enrichment Surfaces
status: accepted
date: 2026-04-04
owners:
  - platform
tags:
  - components
  - fields
  - governance
  - public-api
relatedPackages:
  - @ww/core
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0028 Core Field Enrichment Surfaces

## Context

`@ww/core` already ships the baseline field layer: text, textarea, simple select, numeric input,
rich select, autocomplete, and slider surfaces. The remaining second-wave backlog still needed a
governed answer for four shallow field enrichments:

- grouped input seams with prepend and append addons
- password entry with explicit reveal state and optional guidance content
- tag-style string-array entry with duplicate and paste handling
- segmented one-time-code entry with focus and keyboard flow

Those needs are smaller than `UiForm / UiFormItem` scope and must not create a second validation or
form-state runtime inside `@ww/core`.

## Decision

Add `UiInputGroup`, `UiInputPassword`, `UiInputTag`, and `UiInputOtp` as governed public
`@ww/core` field surfaces.

- `UiInputGroup` stays structural and keeps grouped addon seams inside the existing field contract.
- `UiInputPassword` keeps reveal state explicit through props and events and allows optional
  strength and rule guidance without owning password-policy services.
- `UiInputTag` owns local string-array entry, duplicate policy, paste splitting, and removal flow.
- `UiInputOtp` owns segmented one-time-code entry with paste distribution, masking, and backspace
  navigation.
- The family reuses shared field context, input tokens, Storybook docs, the playground harness, and
  the governed public manifests.

## Consequences

- The second-wave field-enrichment backlog row is now closed without escalating into `UiForm`.
- Consumers get sanctioned grouped, password, tag, and OTP field surfaces instead of app-local
  wrappers.
- Accessibility, keyboard, focus, and field-label contracts stay centralized in `@ww/core`.
- Core still does not own form orchestration, cross-field validation, async password services, or
  authentication/session flows.

## Alternatives

- Leaving these controls app-local would fragment keyboard, labeling, and paste behavior across
  consumers.
- Folding them into a future `UiForm` scope would delay useful reusable surfaces and expand that
  future scope unnecessarily.
- Shipping product-specific password or tag workflows in core would weaken layer governance and pull
  domain logic into the reusable package.

## Migration / Rollout

- Export `UiInputGroup`, `UiInputPassword`, `UiInputTag`, and `UiInputOtp` from `@ww/core`.
- Register the family in the public surface manifest and the playground visual-surface manifest.
- Add Storybook coverage, themed proof, playground harness usage, docs, tests, ADR, and release
  metadata in the same delivery.
- Keep `UiForm / UiFormItem` ADR-first and out of scope for this surface family.

## Related artifacts

- [`packages/core/src/components/fields/UiInputGroup.vue`](../../packages/core/src/components/fields/UiInputGroup.vue)
- [`packages/core/src/components/fields/UiInputPassword.vue`](../../packages/core/src/components/fields/UiInputPassword.vue)
- [`packages/core/src/components/fields/UiInputTag.vue`](../../packages/core/src/components/fields/UiInputTag.vue)
- [`packages/core/src/components/fields/UiInputOtp.vue`](../../packages/core/src/components/fields/UiInputOtp.vue)
- [`packages/core/src/styles/input.css`](../../packages/core/src/styles/input.css)
- [`apps/docs/src/stories/Fields.stories.ts`](../../apps/docs/src/stories/Fields.stories.ts)
- [`apps/playground/src/testing/routes/TestingHarnessView.vue`](../../apps/playground/src/testing/routes/TestingHarnessView.vue)
- [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)
- [`tools/governance/catalog/playground-lab-manifest.mjs`](../../tools/governance/catalog/playground-lab-manifest.mjs)
