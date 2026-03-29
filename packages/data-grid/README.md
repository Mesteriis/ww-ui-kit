# @ww/data-grid

`@ww/data-grid` is a feature-first systems package for dense business and admin table surfaces.

It owns:

- grid UI composition
- controlled query orchestration
- sorting, search, filters, pagination, selection, and column visibility
- theme, motion, and overlay-aware table surfaces

It does not own:

- backend fetching
- routing
- product-specific table semantics
- domain logic
- widget or page-template composition

`@ww/data-grid` is a systems package, not a core component, not a widget, and not a page template.

## Public API

- `UiDataGrid`
- `UiDataGridToolbar`
- `UiDataGridSearch`
- `UiDataGridFilters`
- `UiDataGridTable`
- `UiDataGridPagination`
- `UiDataGridBulkActions`
- `UiDataGridColumnVisibility`
- `DataGridQuery`
- `DataGridSort`
- `DataGridPagination`
- `DataGridSelectionState`
- `DataGridColumn`
- `DataGridFilterDefinition`
- `DataGridFilterValue`
- `DataGridRowId`
- `DataGridDensity`
- `createDataGridColumn`
- `normalizeDataGridQuery`

Import styles explicitly:

```ts
import '@ww/data-grid/styles.css';
```

## Controlled model

```vue
<UiDataGrid
  :rows="rows"
  :columns="columns"
  :query="query"
  :total-rows="totalRows"
  :selected-row-ids="selectedRowIds"
  :filter-definitions="filters"
  @update:query="query = $event"
  @update:selected-row-ids="selectedRowIds = $event"
/>
```

`query` is serializable and controlled-friendly:

```ts
type DataGridQuery = {
  search: string;
  filters: Record<string, unknown>;
  sort: Array<{
    id: string;
    direction: 'asc' | 'desc';
  }>;
  pagination: {
    page: number;
    pageSize: number;
  };
  columnVisibility?: Record<string, boolean>;
};
```

## Theming

`@ww/data-grid` uses the existing token and theme system. It respects:

- `ThemeName`
- `ThemeType`
- subtree theming via `data-ui-theme` and `data-ui-theme-type`
- reduced motion defaults from the shared motion foundation

## Storybook and playground

- Storybook is the public state contract for `@ww/data-grid`
- playground proves real consumer-style query and selection flows

## Relation to widgets

Future table widgets must compose over `@ww/data-grid`.

`data/data-table-widget` in `@ww/widgets` is a future black-box composition wrapper. The table engine and state orchestration live here in `@ww/data-grid`.

## Explicit v1 out of scope

- backend fetching hooks
- route-aware table behavior
- virtualization
- column pinning and resize suites
- inline cell editing
- tree data and grouping
- product-specific `UsersTable` / `OrdersTable` components
