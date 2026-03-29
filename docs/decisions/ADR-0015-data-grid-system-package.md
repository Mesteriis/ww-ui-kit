---
id: ADR-0015
title: Data Grid System Package
status: accepted
date: 2026-03-29
owners:
  - platform
tags:
  - systems
  - data-grid
relatedPackages:
  - @ww/data-grid
  - @ww/widgets
  - @ww/page-templates
  - @ww/core
supersedes: []
supersededBy: []
---

# ADR-0015 Data Grid System Package

## Context

Dense business and admin table surfaces need more than a single table component. They require coordinated search, filters, sorting, pagination, selection, column visibility, states, theming, and accessibility. Putting this orchestration into `@ww/core` would blur the boundary between baseline controls and higher-order systems. Putting it into widgets or page templates would leak reusable engine logic into composition layers.

## Decision

`@ww/data-grid` is added as a dedicated systems package.

Its contract is feature-first and controlled:

- consumers provide `rows`, `columns`, `query`, `totalRows`, and optionally controlled selection
- the package renders dense grid UI and emits query and selection updates
- the package does not fetch data, own routing, or encode domain semantics

`@ww/data-grid` is not classified as:

- `@ww/core`
  because the scope is a higher-order system, not a baseline control
- `@ww/widgets`
  because widgets compose over the grid engine rather than define it
- `@ww/page-templates`
  because templates stay layout-first and route-agnostic
- `third-party-adapter`
  because the public contract is feature-first rather than vendor-first

Future `DataTableWidget` work belongs above this package and composes over it.

## Consequences

- Dense admin table behavior has one canonical reusable home.
- Core components remain smaller and more universal.
- Widgets can wrap `@ww/data-grid` without duplicating search, selection, and column orchestration.
- Apps keep ownership of backend fetching, domain filters, permissions, and route synchronization.

## Alternatives

- Putting the grid in `@ww/core` would overload the foundation layer with system-scale behavior.
- Putting the grid in `@ww/widgets` would make the underlying table engine harder to reuse directly.
- Treating the package as a third-party adapter would misrepresent its public contract even if a vendor engine is adopted internally later.

## Migration / Rollout

- The package starts as an incubating system package.
- Future table widgets should compose over `@ww/data-grid`.
- Domain-specific tables should live in apps or widgets above the system package, not inside `@ww/data-grid`.
- v1 intentionally excludes virtualization, inline editing, grouping, route sync, and backend fetch orchestration.

## Related artifacts

- [`packages/data-grid`](../../packages/data-grid)
- [`packages/widgets/src/data/data-table-widget/README.md`](../../packages/widgets/src/data/data-table-widget/README.md)
- [`docs/architecture/placement-rules.md`](../architecture/placement-rules.md)
