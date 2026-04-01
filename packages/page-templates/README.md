# @ww/page-templates

`@ww/page-templates` is the reusable page-shell and layout-composition layer above
`@ww/widgets`, `@ww/core`, and optional systems packages.

Page templates are:

- reusable page skeletons with named slots
- layout-focused rather than domain-focused
- safe to reuse across multiple apps or routes

Page templates are not:

- route pages
- backend-aware views
- product-specific screens
- a substitute for app routing

The canonical generic shell family is layout-first so named dashboard, marketing, workspace, and
settings templates can compose on top of it without leaking route semantics into the base layer.

## Public API

- `UiLayout`
- `UiVerticalLayout`
- `UiHorizontalLayout`
- `UiLayoutHeader`
- `UiLayoutSider`
- `UiLayoutContent`
- `UiLayoutFooter`
- `UiLayoutSection`
- `UiLayoutToolbar`
- `UiDashboardLayout`
- layout shell types and page-template layer contracts

Import the package styles explicitly:

```ts
import '@ww/page-templates/styles.css';
```

## Generic shell usage

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

## Flow layouts

`UiVerticalLayout` and `UiHorizontalLayout` are small structural wrappers inside the same shell
family. They stack default-slot content in one axis, accept a consumer-provided `gap`, shrink-wrap
to content by default, and only enable axis-specific scrolling when `scroll` is set.

```vue
<script setup lang="ts">
import { UiHorizontalLayout, UiVerticalLayout } from '@ww/page-templates';
</script>

<template>
  <UiVerticalLayout gap="var(--ui-space-3)">
    <div>Filters</div>
    <div>Approvals</div>
    <div>Escalations</div>
  </UiVerticalLayout>

  <div style="max-inline-size: 22rem;">
    <UiHorizontalLayout gap="var(--ui-space-3)" scroll>
      <div>North lane</div>
      <div>Bravo rollout</div>
      <div>Charlie review</div>
      <div>Delta archive</div>
    </UiHorizontalLayout>
  </div>
</template>
```

## Dashboard template

`UiDashboardLayout` is the reusable dashboard-like page shell in this package. It stays layout-only
and exposes the following slot contract:

- `aside-header`
- `aside-content`
- `aside-actions`
- `header`
- `header-actions`
- `default`

It renders one structural shell with:

- a full-height aside region split into `auto minmax(0, 1fr) auto`
- a main region with a header row and a content row
- a responsive fallback that stacks into one column on narrow viewports
- document scroll locked while the shell is mounted, because this template owns the full viewport

```vue
<script setup lang="ts">
import { UiButton, UiCard, UiDropdown } from '@ww/core';
import { UiDashboardLayout } from '@ww/page-templates';

const menuItems = [{ label: 'GitHub repository', href: 'https://github.com/Mesteriis/ww-ui-kit' }];
</script>

<template>
  <UiDashboardLayout>
    <template #aside-header>
      <div style="display: grid; gap: var(--ui-space-3);">
        <div
          style="
            display: inline-grid;
            place-items: center;
            inline-size: 2.75rem;
            block-size: 2.75rem;
            border-radius: var(--ui-radius-lg);
            background: color-mix(in srgb, var(--ui-surface-brand-soft) 70%, var(--ui-surface-default));
            font-weight: 700;
          "
        >
          WW
        </div>
        <div style="display: grid; gap: var(--ui-space-2);">
          <strong>Operations cockpit</strong>
          <p style="margin: 0; color: var(--ui-text-secondary);">
            Reusable dashboard shell above widgets and apps.
          </p>
        </div>
      </div>
    </template>

    <template #aside-content>
      <nav aria-label="Dashboard navigation" style="display: grid; gap: var(--ui-space-4);">
        <div style="display: grid; gap: var(--ui-space-2);">
          <strong>Dashboards</strong>
          <a href="#overview">Overview</a>
          <a href="#alerts">Alerts</a>
        </div>
      </nav>
    </template>

    <template #aside-actions>
      <div style="display: grid; gap: var(--ui-space-3);">
        <UiButton>Create insight</UiButton>
        <UiButton variant="secondary">Invite analyst</UiButton>
      </div>
    </template>

    <template #header>
      <UiCard>
        <div style="display: grid; gap: var(--ui-space-2);">
          <h1 style="margin: 0;">Quarterly delivery desk</h1>
          <p style="margin: 0; color: var(--ui-text-secondary);">
            Slot-driven dashboard framing without route, backend, or product state.
          </p>
        </div>
      </UiCard>
    </template>

    <template #header-actions>
      <UiDropdown :items="menuItems">
        <template #trigger>
          <UiButton variant="secondary">Dashboard workspace menu</UiButton>
        </template>
      </UiDropdown>
    </template>

    <UiCard>
      <template #header>Primary content</template>
      Placeholder cards, widgets, and sections live in the default slot.
    </UiCard>
  </UiDashboardLayout>
</template>
```

## Namespaces

- `auth`
  Future templates for auth-related shells such as entry, recovery, or password reset compositions.
- `workspace`
  Future templates for multi-panel workspace shells.
- `dashboard`
  `UiDashboardLayout` now occupies the default dashboard namespace for reusable dashboard-like
  screens. Future dashboard variants still belong here.
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
