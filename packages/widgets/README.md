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

This scaffold release adds only shell-level infrastructure and reserved namespaces.

## Public API

- `UiWidgetShell`
- `UiWidgetHeader`
- `UiWidgetBody`
- `UiWidgetFooter`
- layer contracts and shell types

Import the package styles explicitly:

```ts
import '@ww/widgets/styles.css';
```

## Usage

```vue
<UiWidgetShell
  title="Traffic summary"
  description="Reusable black-box widget shell"
  surface="elevated"
>
  <template #actions>
    <UiButton variant="secondary">Refresh</UiButton>
  </template>

  <p>Widget body content.</p>

  <template #footer>
    Last synced 2 minutes ago
  </template>
</UiWidgetShell>
```

## Reserved namespaces

- `auth/login-window`
  Future black-box auth surface. It may assemble fields, actions, and feedback, but it must not own backend auth flow or routing.
- `data/data-table-widget`
  Future composition wrapper over a data-grid/system package. It is not the grid engine itself.
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
- Apps remain responsible for real route pages, backend integration, and domain logic.
