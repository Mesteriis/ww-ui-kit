# @ww/page-templates

`@ww/page-templates` is the reusable page-shell and layout-composition layer above `@ww/widgets`, `@ww/core`, and optional systems packages.

Page templates are:

- reusable page skeletons with named slots
- layout-focused rather than domain-focused
- safe to reuse across multiple apps or routes

Page templates are not:

- route pages
- backend-aware views
- product-specific screens
- a substitute for app routing

The canonical generic shell family is layout-first so future dashboard, marketing, workspace, and settings templates can compose on top of it without leaking route semantics into the base layer.

## Public API

- `UiLayout`
- `UiLayoutHeader`
- `UiLayoutSider`
- `UiLayoutContent`
- `UiLayoutFooter`
- `UiLayoutSection`
- `UiLayoutToolbar`
- layout shell types and page-template layer contracts

Import the package styles explicitly:

```ts
import '@ww/page-templates/styles.css';
```

## Usage

```vue
<UiLayout width="full">
  <template #header>
    <UiLayoutHeader>
      <div style="display: grid; gap: var(--ui-space-2);">
        <h1 style="margin: 0;">Workspace shell</h1>
        <p style="margin: 0; color: var(--ui-text-secondary);">
          Structural layout primitives stay reusable across future named templates.
        </p>
      </div>
    </UiLayoutHeader>
  </template>

  <template #toolbar>
    <UiLayoutToolbar>
      <UiButton variant="secondary">Refresh</UiButton>
      <UiButton>Share</UiButton>
    </UiLayoutToolbar>
  </template>

  <UiLayoutContent :padded="false">
    <UiLayoutSection title="Overview">
      Main layout content
    </UiLayoutSection>
  </UiLayoutContent>

  <template #sider>
    <UiLayoutSider>
      <UiLayoutSection title="Sidebar">Sidebar content</UiLayoutSection>
    </UiLayoutSider>
  </template>

  <template #footer>
    <UiLayoutFooter>Route pages stay in apps.</UiLayoutFooter>
  </template>
</UiLayout>
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
