<script setup lang="ts">
import { UiBadge, UiButton } from '@ww/core';
import { UiPageSection, UiPageTemplate } from '@ww/page-templates';
import { RESERVED_WIDGET_NAMESPACES, UiWidgetShell } from '@ww/widgets';
</script>

<template>
  <section
    id="testing-composition"
    class="playground__layer-stack"
    data-playground-scenario="composition"
  >
    <section id="testing-widgets" data-playground-scenario="widgets">
      <UiPageTemplate
        title="Widget shell showcase"
        description="Widgets stay black-box and reusable. They compose core and optional systems without becoming route pages."
        has-sidebar
        width="full"
      >
        <template #toolbar>
          <UiButton variant="secondary">Refresh surface</UiButton>
          <UiBadge variant="brand">@ww/widgets</UiBadge>
        </template>

        <UiPageSection
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
        </UiPageSection>

        <template #sidebar>
          <UiPageSection
            title="Reserved widget namespaces"
            description="Reserved namespaces document placement without shipping fake runtime components."
          >
            <div class="ui-cluster">
              <code v-for="namespace in RESERVED_WIDGET_NAMESPACES" :key="namespace">
                {{ namespace }}
              </code>
            </div>
          </UiPageSection>
        </template>

        <template #footer>
          <span>Widgets = reusable black-box surfaces above core and systems.</span>
        </template>
      </UiPageTemplate>
    </section>

    <section id="testing-page-templates" data-playground-scenario="page-templates">
      <UiPageTemplate
        title="Page-template shell showcase"
        description="Page templates provide reusable layout skeletons for auth, workspace, dashboard, settings, and future product areas."
        has-sidebar
        width="full"
      >
        <template #toolbar>
          <UiButton variant="secondary">Template action</UiButton>
          <UiBadge variant="brand">@ww/page-templates</UiBadge>
        </template>

        <UiPageSection
          title="Workspace proof"
          description="A workspace template can host multiple widgets without becoming a route page or owning domain fetch logic."
        >
          <UiWidgetShell
            title="Workspace activity widget"
            description="Templates can host widgets, but apps still own routing, product-specific data loading, and backend concerns."
          >
            <p style="margin: 0">
              This is the intended composition path for future reusable admin and dashboard shells.
            </p>
          </UiWidgetShell>
        </UiPageSection>

        <UiPageSection
          title="Settings proof"
          description="Settings templates can frame filters, sidebars, and shell actions without hardcoding a product-specific settings flow."
        >
          <UiWidgetShell
            title="Settings panel shell"
            description="Composed settings widgets can stay reusable and still sit inside a canonical template."
            surface="subtle"
          >
            <p style="margin: 0">
              Route pages stay in apps. Page templates remain layout shells, not route
              implementations.
            </p>
          </UiWidgetShell>
        </UiPageSection>

        <template #sidebar>
          <UiPageSection
            title="Template placement"
            description="Future AuthPageTemplate, WorkspacePageTemplate, and DashboardPageTemplate live here."
          >
            <div class="ui-stack">
              <UiBadge variant="brand">AuthPageTemplate</UiBadge>
              <UiBadge>WorkspacePageTemplate</UiBadge>
              <UiBadge>DashboardPageTemplate</UiBadge>
              <UiBadge>Route pages stay in apps</UiBadge>
            </div>
          </UiPageSection>
        </template>

        <template #footer>
          <span>Layer order: core + systems → widgets → page-templates → apps</span>
        </template>
      </UiPageTemplate>
    </section>
  </section>
</template>
