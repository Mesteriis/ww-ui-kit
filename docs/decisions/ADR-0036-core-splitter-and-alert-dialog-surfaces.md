---
id: ADR-0036
title: Core Splitter And Alert Dialog Surfaces
status: accepted
date: 2026-04-04
owners:
  - platform
tags:
  - core
  - overlay
  - layout
relatedPackages:
  - @ww/core
  - @ww/primitives
supersedes: []
supersededBy: []
---

# ADR-0036 Core Splitter And Alert Dialog Surfaces

## Context

The repo has modal and drawer overlays plus layout utilities, but it does not have a governed
resizable split-pane surface or a dedicated destructive modal confirmation surface. Ad-hoc splitter
math and ad-hoc confirm dialogs would drift from the shared accessibility and motion contracts.

## Decision

`UiSplitter` and `UiAlertDialog` land in `@ww/core`.

`UiSplitter` contract:

- pane group with controlled-first `sizes`
- horizontal and vertical orientation
- draggable and keyboard-resizable separators
- optional collapsible panes through explicit pane props

`UiAlertDialog` contract:

- composes over `UiDialog`
- dedicated destructive/important confirmation semantics
- controlled-first `open`
- explicit title, description, tone, confirm/cancel labels, and default-focus target
- no hidden business logic inside the component

Imperative API decision:

- export `confirmAlertDialog(options): Promise<boolean>`
- implement it as a thin programmatic composition over `UiAlertDialog`
- keep the imperative helper opt-in and promise-based instead of introducing a global service store

Accessibility and keyboard rules are structural:

- splitter separators use `role="separator"` with `aria-valuenow`, `aria-valuemin`, and
  `aria-valuemax`
- alert dialog keeps `role="alertdialog"`, trapped focus, `Escape`, and focus restore

## Consequences

- Resizable layout behavior and critical confirmation dialogs stay inside the baseline reusable
  layer.
- The imperative confirm helper has one canonical path instead of copy-pasted programmatic dialogs.
- `UiPopconfirm` remains the lightweight inline confirm surface while `UiAlertDialog` owns modal
  confirmation.

## Alternatives

- Putting splitter in a systems package would overstate a reusable structural layout surface.
- Reusing plain `UiDialog` composition only would leave alert-dialog semantics and imperative confirm
  flows duplicated in apps.
- Adding a global confirm manager store would create unnecessary runtime ownership.

## Migration / Rollout

- Compose alert dialog over the existing modal overlay runtime.
- Adopt the new confirm helper where destructive flows currently hand-roll `UiDialog` composition.
- Keep splitter persistence consumer-owned.

## Related artifacts

- [`packages/core`](../../packages/core)
- [`docs/todo-components.md`](../todo-components.md)
