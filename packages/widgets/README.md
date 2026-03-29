# @ww/widgets

`@ww/widgets` is the black-box composition layer above `@ww/core` and optional systems packages.

Widgets are:

- reusable between multiple apps and route pages
- composed from core components and optional systems
- presentation- and interaction-focused
- independent from backend clients, routing, and domain data fetching

Widgets are not:

- core primitives or baseline controls
- route pages
- graph engines, grid engines, or other systems packages
- API clients or auth backends

`@ww/widgets` ships shell infrastructure and real reusable widget surfaces that compose systems packages without reimplementing them.

## Public API

- `UiWidgetShell`
- `UiWidgetHeader`
- `UiWidgetBody`
- `UiWidgetFooter`
- `DataTableWidget`
- layer contracts and shell types

Import the package styles explicitly. The widget style entry includes the data-grid system styles it composes over:

```ts
import '@ww/widgets/styles.css';
```

## Usage

```vue
<DataTableWidget
  title="Accounts"
  description="Reusable widget framing above @ww/data-grid"
  :rows="rows"
  :columns="columns"
  :query="query"
  :total-rows="totalRows"
  :selected-row-ids="selectedRowIds"
  :filter-definitions="filterDefinitions"
  @update:query="query = $event"
  @update:selected-row-ids="selectedRowIds = $event"
>
  <template #header-actions>
    <UiButton variant="secondary">Refresh widget</UiButton>
  </template>

  <template #footer>
    Widget footer metadata stays outside backend orchestration.
  </template>
</DataTableWidget>
```

`DataTableWidget` is:

- a widget-layer black-box business/admin block
- composed above `@ww/data-grid`
- controlled by the consumer for rows, query, totals, and selection

`DataTableWidget` is not:

- the grid engine itself
- a backend-aware users/orders/products table
- a route page or page template

## Remaining reserved namespaces

- `auth/login-window`
  Future black-box auth surface. It may assemble fields, actions, and feedback, but it must not own backend auth flow or routing.
- `dashboard`
  Future dashboard-level black-box widgets.
- `entity`
  Future entity summary/detail widgets.
- `feedback`
  Future activity, notification, and stateful feedback widgets.

## Layer rules

- Widgets may compose `@ww/core` and optional systems packages.
- Widgets must not fetch data directly.
- Widgets must not perform route navigation.
- Widgets must not expose vendor-specific APIs from systems packages as their primary surface.
- Table widgets must compose `@ww/data-grid`; they must not duplicate query, search, filter, sort, pagination, or selection logic.
- Apps remain responsible for real route pages, backend integration, and domain logic.
