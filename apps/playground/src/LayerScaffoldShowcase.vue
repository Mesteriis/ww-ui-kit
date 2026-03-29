<script setup lang="ts">
import { UiBadge, UiButton } from '@ww/core';
import {
  UiPageSection,
  UiPageTemplate
} from '@ww/page-templates';
import {
  RESERVED_WIDGET_NAMESPACES,
  UiWidgetShell
} from '@ww/widgets';
</script>

<template>
  <section class="playground__layer-stack">
    <UiPageTemplate
      title="Layer scaffold showcase"
      description="Widgets and page templates are now first-class layers between systems and apps."
      has-sidebar
      width="full"
    >
      <template #toolbar>
        <UiButton variant="secondary">Template action</UiButton>
        <UiBadge variant="brand">@ww/page-templates</UiBadge>
      </template>

      <UiPageSection
        title="Widget shell showcase"
        description="Future LoginWindow, DataTableWidget, and dashboard surfaces belong in @ww/widgets."
      >
        <div
          style="
            display: grid;
            gap: var(--ui-space-4);
            grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          "
        >
          <UiWidgetShell
            title="Widget shell"
            description="Black-box shell ready for composed UI surfaces."
            surface="elevated"
          >
            <template #actions>
              <UiButton variant="secondary">Refresh</UiButton>
            </template>

            <p style="margin: 0;">
              Use this layer for reusable composition blocks above core and optional systems.
            </p>

            <template #footer>
              Footer metadata, actions, and status can stay consistent here.
            </template>
          </UiWidgetShell>

          <UiWidgetShell title="Reserved placement" surface="subtle">
            <template #empty>
              <div class="ui-stack">
                <p style="margin: 0;">
                  Reserved namespaces are documented instead of shipping fake runtime components.
                </p>
                <div class="ui-cluster">
                  <code v-for="namespace in RESERVED_WIDGET_NAMESPACES" :key="namespace">
                    {{ namespace }}
                  </code>
                </div>
              </div>
            </template>
          </UiWidgetShell>
        </div>
      </UiPageSection>

      <UiPageSection
        title="Nested composition"
        description="Page templates compose widgets without becoming route pages or app-level orchestration shells."
      >
        <UiWidgetShell
          title="Widget inside template"
          description="A template can host a widget shell, but real data fetching still belongs in apps."
        >
          <p style="margin: 0;">
            This is the intended layer boundary for future reusable products like LoginWindow and DashboardSummaryWidget.
          </p>
        </UiWidgetShell>
      </UiPageSection>

      <template #sidebar>
        <UiPageSection
          title="Sidebar shell"
          description="Future AuthPageTemplate, WorkspacePageTemplate, and DashboardPageTemplate live here as reusable layouts."
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
</template>
