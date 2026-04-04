---
id: ADR-0023
title: Floating Overlay Specializations In Core
status: accepted
date: 2026-04-03
owners:
  - platform
tags:
  - components
  - governance
  - overlays
  - public-api
relatedPackages:
  - @ww/core
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0023 Floating Overlay Specializations In Core

## Context

The repository already exposes a governed floating overlay runtime through `UiTooltip`, `UiPopover`, and `UiDropdown`. Consumers also need two narrowly scoped overlay specializations that keep showing up in real UI flows:

- inline confirmation at a trigger without escalating to a modal dialog
- contextual action menus anchored to pointer coordinates instead of trigger bounds

Leaving these needs to app-local wrappers would fragment focus handling, dismissal rules, menu semantics, and portal governance. At the same time, neither use case justifies a new package, a second floating runtime, or product-owned orchestration inside `@ww/core`.

## Decision

Add `UiPopconfirm` and `UiContextMenu` as governed `@ww/core` overlay surfaces built on the shared floating overlay runtime.

- `UiPopconfirm` specializes the popover path with explicit title, optional description, icon, confirm/cancel actions, and confirm-first focus management.
- `UiContextMenu` specializes the menu/dropdown path with pointer anchoring, keyboard invocation (`ContextMenu` and `Shift+F10`), and scroll/resize dismissal.
- Both surfaces reuse sanctioned overlay positioning, portal targeting, motion presets, and tokenized styling instead of creating new runtime branches.
- Both surfaces must ship with synchronized exports, manifests, Storybook stories, themed proofs, playground harness coverage, docs, tests, and release metadata.
- Product-specific orchestration, async mutation state, nested submenu systems, and domain workflows remain out of scope.

## Consequences

- Consumers get governed confirmation and context-menu primitives without rebuilding overlay semantics in apps.
- The overlay family expands while preserving one focus, dismissal, and layering model across tooltip, popover, dropdown, popconfirm, context menu, dialog, drawer, and toast.
- Future richer confirm flows or multi-level context navigation must justify separate governed surfaces instead of stretching these contracts beyond their current scope.

## Alternatives

- Keeping both patterns as app-local wrappers would weaken Storybook, playground, and manifest governance while duplicating accessibility behavior.
- Adding more branching props to `UiPopover` or `UiDropdown` would blur public contracts and make unrelated surfaces harder to reason about.
- Escalating confirmation to `UiDialog` by default would overfit lightweight trigger-adjacent actions and break expected floating behavior.

## Migration / Rollout

- Export `UiPopconfirm` and `UiContextMenu` from `@ww/core`.
- Register both surfaces in the public surface manifest and playground lab manifest.
- Add canonical Storybook stories, themed proofs, playground testing usage, docs, unit tests, browser tests, and a changeset in the same delivery.
- Keep the existing popover, dropdown, and menu contracts stable; new behavior remains opt-in through the new surfaces.

## Related artifacts

- [`packages/core/src/components/overlay/UiPopconfirm.vue`](../../packages/core/src/components/overlay/UiPopconfirm.vue)
- [`packages/core/src/components/overlay/UiContextMenu.vue`](../../packages/core/src/components/overlay/UiContextMenu.vue)
- [`packages/core/src/components/overlay/useFloatingSurface.ts`](../../packages/core/src/components/overlay/useFloatingSurface.ts)
- [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)
- [`tools/governance/catalog/playground-lab-manifest.mjs`](../../tools/governance/catalog/playground-lab-manifest.mjs)
- [`apps/docs/src/stories/Overlay.stories.ts`](../../apps/docs/src/stories/Overlay.stories.ts)
- [`apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts`](../../apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts)
- [`apps/playground/src/testing/routes/TestingHarnessView.vue`](../../apps/playground/src/testing/routes/TestingHarnessView.vue)
