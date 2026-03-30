<script setup lang="ts">
import { UiBadge, UiButton } from '@ww/core';
import {
  UiLayout,
  UiLayoutContent,
  UiLayoutFooter,
  UiLayoutHeader,
  UiLayoutSection,
  UiLayoutSider,
  UiLayoutToolbar,
} from '@ww/page-templates';
import { RESERVED_WIDGET_NAMESPACES, UiWidgetShell } from '@ww/widgets';
</script>

<template>
  <section
    id="testing-composition"
    class="playground__layer-stack"
    data-playground-scenario="composition"
  >
    <section id="testing-widgets" data-playground-scenario="widgets">
      <UiLayout width="full">
        <template #header>
          <UiLayoutHeader>
            <div style="display: grid; gap: var(--ui-space-2)">
              <h1 style="margin: 0">Widget shell showcase</h1>
              <p style="margin: 0; color: var(--ui-text-secondary)">
                Widgets stay black-box and reusable. They compose core and optional systems without
                becoming route pages.
              </p>
            </div>
            <UiBadge variant="brand">@ww/widgets</UiBadge>
          </UiLayoutHeader>
        </template>

        <template #toolbar>
          <UiLayoutToolbar>
            <UiButton variant="secondary">Refresh surface</UiButton>
            <UiBadge variant="brand">Widget layer</UiBadge>
          </UiLayoutToolbar>
        </template>

        <UiLayoutContent :padded="false">
          <UiLayoutSection
            title="Auth / dashboard widget proof"
            description="Future LoginWindow and DashboardSummaryWidget belong here, not in core and not inside route pages."
          >
            <div
              style="
                display: grid;
                gap: var(--ui-space-4);
                grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
              "
            >
              <UiWidgetShell
                title="Login window shell"
                description="A future auth widget can own its shell, actions, and empty/error/loading treatment without owning routing or backend flows."
                surface="elevated"
              >
                <template #actions>
                  <UiButton variant="secondary">Need help</UiButton>
                </template>

                <p style="margin: 0">
                  The widget layer is where black-box composed surfaces start. App-level auth
                  orchestration still stays in apps.
                </p>

                <template #footer>
                  Footer metadata, status, and actions stay consistent here.
                </template>
              </UiWidgetShell>

              <UiWidgetShell
                title="Dashboard summary shell"
                description="Future chart, badge, and activity summaries compose here above systems packages."
                surface="subtle"
              >
                <div class="ui-cluster">
                  <UiBadge variant="brand">Chart adapter</UiBadge>
                  <UiBadge>Signal graph</UiBadge>
                  <UiBadge>Core controls</UiBadge>
                </div>
                <p style="margin: 0">
                  Widgets can consume systems, but should not become backend-aware orchestration
                  containers.
                </p>
              </UiWidgetShell>
            </div>
          </UiLayoutSection>
        </UiLayoutContent>

        <template #sider>
          <UiLayoutSider>
            <UiLayoutSection
              title="Reserved widget namespaces"
              description="Reserved namespaces document placement without shipping fake runtime components."
            >
              <div class="ui-cluster">
                <code v-for="namespace in RESERVED_WIDGET_NAMESPACES" :key="namespace">
                  {{ namespace }}
                </code>
              </div>
            </UiLayoutSection>
          </UiLayoutSider>
        </template>

        <template #footer>
          <UiLayoutFooter>
            Widgets = reusable black-box surfaces above core and systems.
          </UiLayoutFooter>
        </template>
      </UiLayout>
    </section>

    <section id="testing-page-templates" data-playground-scenario="page-templates">
      <div class="ui-stack" style="gap: var(--ui-space-6)">
        <UiLayout width="full">
          <template #header>
            <UiLayoutHeader>
              <div style="display: grid; gap: var(--ui-space-2)">
                <h1 style="margin: 0">Dashboard operations shell</h1>
                <p style="margin: 0; color: var(--ui-text-secondary)">
                  Generic layout primitives can frame workspace and dashboard flows without
                  smuggling route or product state into the shell.
                </p>
              </div>
              <UiBadge variant="brand">@ww/page-templates</UiBadge>
            </UiLayoutHeader>
          </template>

          <template #toolbar>
            <UiLayoutToolbar>
              <UiButton variant="secondary">Template action</UiButton>
              <UiBadge variant="brand">Dashboard-like</UiBadge>
            </UiLayoutToolbar>
          </template>

          <UiLayoutContent :padded="false">
            <UiLayoutSection
              title="Workspace proof"
              description="A dashboard-style shell can host multiple widgets without becoming a route page or owning domain fetch logic."
            >
              <UiWidgetShell
                title="Workspace activity widget"
                description="Templates can host widgets, but apps still own routing, product-specific data loading, and backend concerns."
              >
                <p style="margin: 0">
                  This is the intended composition path for future reusable admin and dashboard
                  templates.
                </p>
              </UiWidgetShell>
            </UiLayoutSection>

            <UiLayoutSection
              title="Shared shell contract"
              description="Toolbar and section helpers stay reusable across consumer styles."
            >
              <div class="ui-cluster">
                <UiBadge variant="brand">Layout-first</UiBadge>
                <UiBadge>Route-agnostic</UiBadge>
                <UiBadge>Widget-ready</UiBadge>
              </div>
            </UiLayoutSection>
          </UiLayoutContent>

          <template #sider>
            <UiLayoutSider>
              <UiLayoutSection
                title="Operations rail"
                description="Future dashboard templates can attach filters, summaries, and shell metadata here."
              >
                <div class="ui-stack">
                  <UiBadge variant="brand">Filters</UiBadge>
                  <UiBadge>Saved views</UiBadge>
                  <UiBadge>Route pages stay in apps</UiBadge>
                </div>
              </UiLayoutSection>
            </UiLayoutSider>
          </template>

          <template #footer>
            <UiLayoutFooter>
              Layout primitives stay generic so named dashboard templates can be added later without
              changing the base shell contract.
            </UiLayoutFooter>
          </template>
        </UiLayout>

        <UiLayout>
          <template #header>
            <UiLayoutHeader>
              <div style="display: grid; gap: var(--ui-space-2)">
                <h1 style="margin: 0">Marketing campaign shell</h1>
                <p style="margin: 0; color: var(--ui-text-secondary)">
                  The same UiLayout family can frame a lighter marketing flow with hero, proof, and
                  CTA regions.
                </p>
              </div>
              <UiBadge variant="brand">Marketing-like</UiBadge>
            </UiLayoutHeader>
          </template>

          <template #toolbar>
            <UiLayoutToolbar>
              <UiButton>Launch campaign</UiButton>
              <UiButton variant="secondary">Download brief</UiButton>
            </UiLayoutToolbar>
          </template>

          <UiLayoutContent :padded="false">
            <UiLayoutSection
              title="Hero narrative"
              description="Named marketing templates stay future work; the shell primitive remains structural."
            >
              <p style="margin: 0">
                Campaign copy, social proof, and CTA blocks can sit here without introducing router
                dependencies or product orchestration.
              </p>
            </UiLayoutSection>

            <UiLayoutSection
              title="Proof points"
              description="Reusable shell sections can support both business and marketing compositions."
            >
              <div
                style="
                  display: grid;
                  gap: var(--ui-space-4);
                  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
                "
              >
                <UiBadge variant="brand">Conversion-ready</UiBadge>
                <UiBadge>Story-driven</UiBadge>
                <UiBadge>Future namespace: marketing</UiBadge>
              </div>
            </UiLayoutSection>
          </UiLayoutContent>

          <template #footer>
            <UiLayoutFooter>
              Future dashboard and marketing templates are composed above UiLayout rather than
              replacing it.
            </UiLayoutFooter>
          </template>
        </UiLayout>
      </div>
    </section>
  </section>
</template>
