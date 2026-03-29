# DataTableWidget

`DataTableWidget` is a reusable black-box widget above `@ww/data-grid`.

It adds widget-layer value around the system package:

- consistent widget shell framing
- title, description, and header action affordances
- widget-level loading, empty, error, and no-results framing
- status and footer composition
- drop-in embedding inside page templates and dashboard-like surfaces

It does not add a second table engine.

## What it composes

- `UiWidgetShell` from `@ww/widgets`
- `UiDataGrid` from `@ww/data-grid`
- existing core affordances for badges, buttons, empty states, and loading

## Controlled contract

`DataTableWidget` reuses the controlled `@ww/data-grid` model instead of forking it:

- `rows`
- `columns`
- `query`
- `totalRows`
- `selectedRowIds`
- `filterDefinitions`

Events pass through unchanged:

- `update:query`
- `update:selectedRowIds`
- `rowClick`

## Slots

- `header-actions`
- `toolbar-start`
- `toolbar-end`
- `bulk-actions`
- `loading`
- `empty`
- `error`
- `status`
- `footer`

## Theming

The widget inherits the current theme and ThemeType through the shared token/theme system. Scoped subtree theming works because both the widget shell and nested grid surface consume the same theme variables.

## Out of scope

- backend fetching
- URL sync
- route-aware tables
- product-specific users/orders/invoices widgets
- export/import workflows
- virtualization or pinned-column suites

## Relation to page templates

Page templates may embed `DataTableWidget` as a reusable business block. They remain layout shells and do not absorb the widget or system responsibilities.
