---
id: ADR-0030
title: Core Date And Calendar Surfaces
status: accepted
date: 2026-04-04
owners:
  - platform
tags:
  - core
  - fields
  - calendar
relatedPackages:
  - @ww/core
  - @ww/primitives
  - @ww/themes
supersedes: []
supersededBy: []
---

# ADR-0030 Core Date And Calendar Surfaces

## Context

The repository already has governed field, overlay, and scroll foundations, but it does not have a
canonical date or time family. Shipping date behavior as ad-hoc input masks, modal calendars, or
route-level helpers would create parallel parsing and accessibility contracts.

## Decision

`UiCalendar`, `UiDatePicker`, `UiDateRangePicker`, and `UiTimePicker` land in `@ww/core`.

The public contract is intentionally narrow:

- date values use canonical local strings in `YYYY-MM-DD`
- date ranges use `[start, end]` tuples where each value is `string | null`
- time values use canonical `HH:mm` strings
- locale affects display labels only and is driven by `locale` props with `Intl` formatting
- parsing accepts only the canonical public formats instead of arbitrary locale-specific free text
- `UiCalendar` is the inline engine and keyboard grid contract
- `UiDatePicker` and `UiDateRangePicker` compose over `UiCalendar` plus the shared floating overlay
  runtime
- `UiTimePicker` stays list/spinbox driven and does not invent a second calendar engine

State ownership is controlled-first with optional uncontrolled fallback through missing `modelValue`
props. Min/max, disabled dates, and disabled times are consumer-provided predicates or scalar bounds.

Accessibility and keyboard rules are structural:

- `UiCalendar` uses `role="grid"` / `gridcell` with roving focus
- arrow keys move by day, `Home`/`End` by week edge, `PageUp`/`PageDown` by month, and
  `Shift+PageUp` / `Shift+PageDown` by year
- `Enter` / `Space` select the active day
- picker triggers expose `aria-haspopup="dialog"` and keep focus restore on close
- `UiTimePicker` exposes combobox/listbox semantics with arrow, `Home`, `End`, and typeahead

Async data is out of scope. Consumers may disable dates or times from async data, but the family
does not fetch or own timezone backends.

## Consequences

- Date and time surfaces stay in the reusable baseline layer beside the rest of the field family.
- The repo gets one calendar engine, one parsing contract, and one display-format path.
- Locale display stays flexible without making parsing ambiguous.
- Apps keep ownership of timezone policy, booking rules, and domain-specific validation.

## Alternatives

- Putting the family in a systems package would overstate the baseline scope and duplicate existing
  field and overlay ownership already present in `@ww/core`.
- Using native date inputs as the only public contract would fail the repo's overlay, theming, and
  keyboard-grid consistency goals.
- Accepting arbitrary locale-typed input would create unstable parsing behavior and a second source
  of truth for formatting policy.

## Migration / Rollout

- Add one shared calendar utility module inside `@ww/core`.
- Compose the picker overlays over the existing floating overlay runtime instead of adding a new
  portal or modal path.
- Keep downstream form orchestration outside this ADR; later `UiForm` work consumes the pickers
  through normal field binding.

## Related artifacts

- [`packages/core`](../../packages/core)
- [`docs/todo-components.md`](../todo-components.md)
- [`docs/architecture/placement-rules.md`](../architecture/placement-rules.md)
