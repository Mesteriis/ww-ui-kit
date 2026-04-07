import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { UiBadge, UiButton, UiCard, UiDropdown } from '@ww/core';
import { UiDashboardLayout } from '@ww/page-templates';
import { UiWidgetShell } from '@ww/widgets';

const repositoryMenuItems = [
  { label: 'GitHub repository', href: 'https://github.com/Mesteriis/ww-ui-kit' },
];

const dashboardNavigationGroups = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    items: ['Executive summary', 'Delivery desk', 'Incident review', 'Launch radar'],
  },
  {
    id: 'teams',
    title: 'Teams',
    items: ['Platform', 'Revenue', 'Operations', 'Enablement'],
  },
  {
    id: 'views',
    title: 'Saved views',
    items: ['Quarter close', 'On-call week', 'Launch readiness', 'Audit backlog'],
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

const deliverySignals = ['Stable slots', 'Route-agnostic', 'Widget-ready'] as const;

const dashboardSidebarNotes = [
  'Escalation inbox',
  'Audit handoff',
  'Runbook sync',
  'Capacity queue',
  'Launch readiness',
  'Partner asks',
  'Weekly review',
  'Exception triage',
] as const;

const dashboardActivityLog = [
  'Quarter close review deck',
  'Change approval queue',
  'Partner launch readiness',
  'Incident replay timeline',
  'Executive follow-up digest',
  'Open release blockers',
  'Rollback decision log',
  'Audit sampling queue',
  'Vendor handoff notes',
  'Launch exception register',
] as const;

const meta = {
  title: 'Page Templates/Scenarios/Dashboard Layout',
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiDashboardLayout>;

export default meta;

function createDashboardRender(options: {
  productTitle: string;
  slogan: string;
  title: string;
  description: string;
  eyebrow: string;
  actionLabel: string;
  widgetTitle: string;
  widgetDescription: string;
  theme?: 'inherit' | 'belovodye';
}) {
  return () => ({
    components: {
      UiBadge,
      UiButton,
      UiCard,
      UiDashboardLayout,
      UiDropdown,
      UiWidgetShell,
    },
    setup() {
      return {
        dashboardNavigationGroups,
        dashboardActivityLog,
        dashboardPanels,
        dashboardSidebarNotes,
        deliverySignals,
        options,
        repositoryMenuItems,
        themeAttrs:
          options.theme === 'belovodye'
            ? {
                'data-ui-theme': 'belovodye',
                'data-ui-theme-type': 'dark',
              }
            : {},
      };
    },
    template: `
      <div v-bind="themeAttrs">
        <UiDashboardLayout>
          <template #aside-header>
            <div style="display: grid; gap: var(--ui-space-4);">
              <div
                style="
                  display: inline-grid;
                  place-items: center;
                  inline-size: 3rem;
                  block-size: 3rem;
                  border-radius: var(--ui-radius-lg);
                  border: 1px solid var(--ui-border-subtle);
                  background: color-mix(in srgb, var(--ui-surface-brand-soft) 62%, var(--ui-surface-default));
                  font-weight: 700;
                "
              >
                WW
              </div>

              <div style="display: grid; gap: var(--ui-space-2);">
                <strong>{{ options.productTitle }}</strong>
                <p style="margin: 0; color: var(--ui-text-secondary);">
                  {{ options.slogan }}
                </p>
              </div>
            </div>
          </template>

          <template #aside-content>
            <div style="display: grid; gap: var(--ui-space-5);">
              <nav aria-label="Dashboard navigation" style="display: grid; gap: var(--ui-space-5);">
                <div
                  v-for="group in dashboardNavigationGroups"
                  :key="group.id"
                  style="display: grid; gap: var(--ui-space-3);"
                >
                  <strong style="font-size: var(--ui-text-font-size-sm); color: var(--ui-text-secondary);">
                    {{ group.title }}
                  </strong>

                  <div style="display: grid; gap: var(--ui-space-2);">
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

              <div
                data-ui-proof="dashboard-aside-scroll-content"
                style="display: grid; gap: var(--ui-space-3);"
              >
                <strong style="font-size: var(--ui-text-font-size-sm); color: var(--ui-text-secondary);">
                  Shift ledger
                </strong>

                <div style="display: grid; gap: var(--ui-space-2);">
                  <div
                    v-for="item in dashboardSidebarNotes"
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
            </div>
          </template>

          <template #aside-actions>
            <div style="display: grid; gap: var(--ui-space-3);">
              <UiButton>{{ options.actionLabel }}</UiButton>
              <UiButton variant="secondary">Invite analyst</UiButton>
            </div>
          </template>

          <template #header>
            <UiCard>
              <template #header>
                <div
                  style="
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: var(--ui-space-4);
                    flex-wrap: wrap;
                  "
                >
                  <div style="display: grid; gap: var(--ui-space-2);">
                    <UiBadge variant="brand">{{ options.eyebrow }}</UiBadge>
                    <h1 style="margin: 0;">{{ options.title }}</h1>
                    <p style="margin: 0; color: var(--ui-text-secondary);">
                      {{ options.description }}
                    </p>
                  </div>
                </div>
              </template>

              <div class="ui-cluster">
                <UiBadge v-for="signal in deliverySignals" :key="signal">
                  {{ signal }}
                </UiBadge>
              </div>
            </UiCard>
          </template>

          <template #header-actions>
            <UiDropdown :items="repositoryMenuItems">
              <template #trigger>
                <UiButton variant="secondary">Dashboard workspace menu</UiButton>
              </template>
            </UiDropdown>
          </template>

          <div class="ui-stack" style="gap: var(--ui-space-5);">
            <div style="display: grid; gap: var(--ui-space-2);">
              <h2 style="margin: 0;">Dashboard panels</h2>
              <p style="margin: 0; color: var(--ui-text-secondary);">
                Placeholder cards and widgets prove the main content slot without hardcoding product behavior.
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
                  <div style="display: grid; gap: var(--ui-space-2);">
                    <span style="font-size: var(--ui-text-font-size-sm); color: var(--ui-text-secondary);">
                      {{ panel.title }}
                    </span>
                    <strong style="font-size: var(--ui-font-size-2xl); line-height: 1;">
                      {{ panel.value }}
                    </strong>
                  </div>
                </template>

                <p style="margin: 0; color: var(--ui-text-secondary);">
                  {{ panel.description }}
                </p>
              </UiCard>
            </div>

            <UiWidgetShell
              :title="options.widgetTitle"
              :description="options.widgetDescription"
              surface="subtle"
            >
              <template #actions>
                <UiBadge variant="brand">Widget composition</UiBadge>
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
                  Cross-team placeholders remain in the consumer proof, not in the public template.
                </UiCard>
                <UiCard>
                  <template #header>Pipeline</template>
                  Consumers can compose widgets or system packages in the default slot.
                </UiCard>
              </div>
            </UiWidgetShell>

            <div
              data-ui-proof="dashboard-content-scroll-list"
              style="display: grid; gap: var(--ui-space-3);"
            >
              <h3 style="margin: 0;">Activity log</h3>
              <div
                v-for="item in dashboardActivityLog"
                :key="item"
                style="
                  padding: var(--ui-space-4);
                  border: 1px solid var(--ui-border-subtle);
                  border-radius: var(--ui-radius-lg);
                  background: color-mix(in srgb, var(--ui-surface-default) 94%, transparent);
                "
              >
                {{ item }}
              </div>
            </div>
          </div>
        </UiDashboardLayout>
      </div>
    `,
  });
}

export const Overview: StoryObj<typeof UiDashboardLayout> = {
  render: createDashboardRender({
    productTitle: 'Willow Works Analytics',
    slogan: 'Governed dashboard shell for operations, rollout, and review work.',
    title: 'Operations cockpit',
    description:
      'Slot-driven dashboard framing with a persistent aside, structured header, and pure layout-only composition.',
    eyebrow: 'UiDashboardLayout',
    actionLabel: 'Create insight',
    widgetTitle: 'Delivery watchlist',
    widgetDescription:
      'Reusable widget content can sit inside the dashboard shell without owning routes.',
  }),
};

export const Composition: StoryObj<typeof UiDashboardLayout> = {
  render: createDashboardRender({
    productTitle: 'Willow Works Analytics',
    slogan: 'Reusable template above widgets, systems, and app orchestration.',
    title: 'Quarter close workspace',
    description:
      'The named dashboard surface composes lower layers while keeping navigation state, routing, and backend concerns out of the template.',
    eyebrow: 'Composed dashboard proof',
    actionLabel: 'Create report',
    widgetTitle: 'Team coverage panels',
    widgetDescription:
      'One dashboard surface can host multiple widget or core panels without turning into an app page.',
  }),
};

export const Theming: StoryObj<typeof UiDashboardLayout> = {
  render: createDashboardRender({
    productTitle: 'Belovodye operations deck',
    slogan: 'Scoped theming stays on the existing theme contract.',
    title: 'Release readiness board',
    description:
      'The dashboard template inherits subtree theme styling without inventing a second theming surface.',
    eyebrow: 'Scoped theme proof',
    actionLabel: 'Open release plan',
    widgetTitle: 'Readiness snapshot',
    widgetDescription:
      'Dashboard composition remains reusable when the shell is rendered inside a themed subtree.',
    theme: 'belovodye',
  }),
};
