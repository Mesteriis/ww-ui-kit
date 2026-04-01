<script setup lang="ts">
import { computed } from 'vue';

import { UiBadge, UiButton, UiCard, UiDropdown } from '@ww/core';
import { UiDashboardLayout } from '@ww/page-templates';
import { UiWidgetShell } from '@ww/widgets';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';

defineOptions({ name: 'DashboardLayoutLabPreview' });

const dashboardMenuItems = [
  { label: 'GitHub repository', href: 'https://github.com/Mesteriis/ww-ui-kit' },
];

const dashboardNavigationGroups = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    items: ['Executive summary', 'Delivery desk', 'Incident review'],
  },
  {
    id: 'teams',
    title: 'Teams',
    items: ['Platform', 'Revenue', 'Operations'],
  },
  {
    id: 'views',
    title: 'Saved views',
    items: ['Quarter close', 'On-call week', 'Launch readiness'],
  },
] as const;

const dashboardPanels = [
  {
    title: 'Release health',
    value: '96%',
    description: 'Placeholder panel for rollout, audit, and regression indicators.',
  },
  {
    title: 'Analyst queue',
    value: '18',
    description: 'Placeholder panel for approvals, escalations, and follow-up work.',
  },
  {
    title: 'Escalations',
    value: '3',
    description: 'Placeholder panel for risk review and cross-team handoff.',
  },
] as const;

const dashboardSignals = ['Stable slots', 'Route-agnostic', 'Widget-ready'] as const;

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      wrapperAttrs?: Record<string, unknown>;
      productTitle: string;
      slogan: string;
      headerTitle: string;
      headerDescription: string;
      primaryActionLabel: string;
      showSecondaryAction: boolean;
    }
);
</script>

<template>
  <div class="lab-preview lab-preview--layout" data-lab-preview-canvas="dashboard-layout">
    <section class="lab-preview__layout-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <UiDashboardLayout>
        <template #aside-header>
          <div style="display: grid; gap: var(--ui-space-4)">
            <div
              style="
                display: inline-grid;
                place-items: center;
                inline-size: 3rem;
                block-size: 3rem;
                border-radius: var(--ui-radius-lg);
                border: 1px solid var(--ui-border-subtle);
                background: color-mix(
                  in srgb,
                  var(--ui-surface-brand-soft) 62%,
                  var(--ui-surface-default)
                );
                font-weight: 700;
              "
            >
              WW
            </div>

            <div style="display: grid; gap: var(--ui-space-2)">
              <strong>{{ resolved?.productTitle }}</strong>
              <p style="margin: 0; color: var(--ui-text-secondary)">
                {{ resolved?.slogan }}
              </p>
            </div>
          </div>
        </template>

        <template #aside-content>
          <nav aria-label="Dashboard navigation" style="display: grid; gap: var(--ui-space-5)">
            <div
              v-for="group in dashboardNavigationGroups"
              :key="group.id"
              style="display: grid; gap: var(--ui-space-3)"
            >
              <strong
                style="font-size: var(--ui-text-font-size-sm); color: var(--ui-text-secondary)"
              >
                {{ group.title }}
              </strong>
              <div style="display: grid; gap: var(--ui-space-2)">
                <div
                  v-for="item in group.items"
                  :key="item"
                  style="
                    padding: var(--ui-space-3) var(--ui-space-4);
                    border: 1px solid var(--ui-border-subtle);
                    border-radius: var(--ui-radius-lg);
                    background: color-mix(in srgb, var(--ui-surface-default) 94%, transparent);
                  "
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </nav>
        </template>

        <template #aside-actions>
          <div style="display: grid; gap: var(--ui-space-3)">
            <UiButton>{{ resolved?.primaryActionLabel }}</UiButton>
            <UiButton v-if="resolved?.showSecondaryAction" variant="secondary">
              Invite analyst
            </UiButton>
          </div>
        </template>

        <template #header>
          <UiCard>
            <template #header>
              <div style="display: grid; gap: var(--ui-space-2)">
                <UiBadge variant="brand">UiDashboardLayout</UiBadge>
                <h1 style="margin: 0">{{ resolved?.headerTitle }}</h1>
                <p style="margin: 0; color: var(--ui-text-secondary)">
                  {{ resolved?.headerDescription }}
                </p>
              </div>
            </template>

            <div class="ui-cluster">
              <UiBadge v-for="signal in dashboardSignals" :key="signal">
                {{ signal }}
              </UiBadge>
            </div>
          </UiCard>
        </template>

        <template #header-actions>
          <UiDropdown :items="dashboardMenuItems">
            <template #trigger>
              <UiButton variant="secondary">Dashboard workspace menu</UiButton>
            </template>
          </UiDropdown>
        </template>

        <div class="ui-stack" style="gap: var(--ui-space-5)">
          <div style="display: grid; gap: var(--ui-space-2)">
            <h2 style="margin: 0">Dashboard panels</h2>
            <p style="margin: 0; color: var(--ui-text-secondary)">
              Maintainer preview keeps the main slot proof structural and route-agnostic.
            </p>
          </div>

          <div
            style="
              display: grid;
              gap: var(--ui-space-4);
              grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
            "
          >
            <UiCard v-for="panel in dashboardPanels" :key="panel.title">
              <template #header>
                <div style="display: grid; gap: var(--ui-space-2)">
                  <span
                    style="font-size: var(--ui-text-font-size-sm); color: var(--ui-text-secondary)"
                  >
                    {{ panel.title }}
                  </span>
                  <strong style="font-size: var(--ui-font-size-2xl); line-height: 1">
                    {{ panel.value }}
                  </strong>
                </div>
              </template>

              <p style="margin: 0; color: var(--ui-text-secondary)">
                {{ panel.description }}
              </p>
            </UiCard>
          </div>

          <UiWidgetShell
            title="Lab composition proof"
            description="Maintainers can tune a realistic dashboard shell without inventing a second runtime."
            surface="subtle"
          >
            <template #actions>
              <UiBadge variant="brand">Consumer proof</UiBadge>
            </template>

            <div
              style="
                display: grid;
                gap: var(--ui-space-4);
                grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
              "
            >
              <UiCard>
                <template #header>Signals</template>
                Default-slot content remains consumer-owned and route-agnostic.
              </UiCard>
              <UiCard>
                <template #header>Widgets</template>
                Lower-layer surfaces can compose inside the layout without changing the shell API.
              </UiCard>
            </div>
          </UiWidgetShell>
        </div>
      </UiDashboardLayout>
    </section>
  </div>
</template>
