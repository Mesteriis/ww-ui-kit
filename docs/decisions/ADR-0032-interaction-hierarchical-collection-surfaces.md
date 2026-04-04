---
id: ADR-0032
title: Interaction Hierarchical Collection Surfaces
status: accepted
date: 2026-04-04
owners:
  - platform
tags:
  - systems
  - tree
  - collections
relatedPackages:
  - @ww/interaction
  - @ww/core
supersedes: []
supersededBy: []
---

# ADR-0032 Interaction Hierarchical Collection Surfaces

## Context

The repository already has flat option and menu behavior in `UiSelect`, `UiAutocomplete`,
`UiDropdown`, and `UiMenu`, but it has no governed hierarchical collection engine. Tree expansion,
check-state propagation, cascader path selection, transfer movement, and lazy loading are not
baseline control concerns.

## Decision

`UiTree`, `UiTreeSelect`, `UiCascader`, and `UiTransfer` live in `@ww/interaction`.

The family shares one normalized collection model:

- nodes expose `key`, `label`, `children`, `disabled`, `leaf`, and optional metadata
- expansion, checked state, selected state, and search results are derived from normalized keys
- lazy loading is opt-in through explicit consumer callbacks and never owns fetching beyond the
  callback contract
- tree-select and cascader compose over the shared hierarchical model plus core floating overlays
- transfer composes over the same collection/runtime helpers plus shared virtualization

Controlled vs uncontrolled rules are explicit:

- `expandedKeys`, `selectedKeys`, `checkedKeys`, `targetKeys`, and `searchValue` can be controlled
- missing controlled props fall back to internal refs seeded by corresponding defaults

Accessibility and keyboard rules are fixed:

- `UiTree` uses `role="tree"` / `treeitem"` / `group`
- arrow keys expand, collapse, and move focus
- `Space` toggles checks where enabled
- cascader and tree-select reuse combobox/listbox trigger semantics from governed overlay paths
- transfer exposes two labeled listboxes with keyboard move actions

## Consequences

- Hierarchical collection behavior has one system-layer home instead of leaking across core
  dropdowns and app-specific trees.
- Overlay-driven collection surfaces stay aligned with existing core portals and focus management.
- Virtualization can be shared with the same package instead of becoming per-surface scroll math.

## Alternatives

- Putting the family in `@ww/core` would mix higher-order collection state machines into the
  baseline layer.
- Splitting each surface into a separate package would multiply package overhead before the shared
  collection engine settles.
- Treating transfer as only app composition would duplicate selection and keyboard behavior.

## Migration / Rollout

- Introduce one normalized collection helper layer inside `@ww/interaction`.
- Reuse existing listbox and overlay patterns from `@ww/core` rather than forking them.
- Replace future ad-hoc hierarchical list implementations with this package instead of extending
  dropdown/menu internals.

## Related artifacts

- [`docs/architecture/placement-rules.md`](../architecture/placement-rules.md)
- [`docs/todo-components.md`](../todo-components.md)
