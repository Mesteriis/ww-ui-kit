# @ww/page-templates

`@ww/page-templates` is the layout and page-shell layer above `@ww/widgets`, `@ww/core`, and optional systems packages.

Page templates are:

- reusable page skeletons with named slots
- layout-focused rather than domain-focused
- safe to reuse across multiple apps or routes

Page templates are not:

- route pages
- backend-aware views
- product-specific screens
- a substitute for app routing

This scaffold release adds only shell-level infrastructure and reserved namespaces.

## Public API

- `UiPageTemplate`
- `UiPageHeader`
- `UiPageBody`
- `UiPageSidebar`
- `UiPageSection`
- `UiPageToolbar`
- page-template shell types and layer contracts

Import the package styles explicitly:

```ts
import '@ww/page-templates/styles.css';
```

## Usage

```vue
<UiPageTemplate title="Workspace" description="Reusable page shell" has-sidebar>
  <template #toolbar>
    <UiButton variant="secondary">Refresh</UiButton>
  </template>

  <UiPageSection title="Overview">
    Main page content
  </UiPageSection>

  <template #sidebar>
    Sidebar content
  </template>
</UiPageTemplate>
```

## Reserved namespaces

- `auth`
  Future templates for auth-related shells such as entry, recovery, or password reset compositions.
- `workspace`
  Future templates for multi-panel workspace shells.
- `dashboard`
  Future templates for dashboard page compositions.
- `marketing`
  Future templates for brand or marketing page shells.
- `settings`
  Future templates for settings and account-management layouts.

## Layer rules

- Page templates compose widgets, systems, and core components.
- Page templates must not fetch domain data directly.
- Page templates must not become route pages.
- Apps own routing, backend integration, and route-level orchestration.
- Widgets belong inside page templates or apps, not the other way around.
