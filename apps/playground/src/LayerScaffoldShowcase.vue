<script setup lang="ts">
import { UiBadge, UiButton, UiCard, UiDropdown } from '@ww/core';
import {
  UiDashboardLayout,
  UiHorizontalLayout,
  UiLayout,
  UiLayoutContent,
  UiLayoutFooter,
  UiLayoutHeader,
  UiLayoutSection,
  UiLayoutSider,
  UiLayoutToolbar,
  UiVerticalLayout,
} from '@ww/page-templates';
import { RESERVED_WIDGET_NAMESPACES, UiWidgetShell } from '@ww/widgets';

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
const verticalItems = ['Filters', 'Approvals', 'Escalations'] as const;
const verticalScrollItems = [
  'Daily ops review',
  'Revenue handoff',
  'Launch audit',
  'Incident follow-up',
  'Quarter close',
  'Vendor sync',
] as const;
const horizontalItems = ['North lane', 'Bravo lane', 'Charlie lane'] as const;
const horizontalScrollItems = [
  'Executive summary',
  'Delivery desk',
  'Incident review',
  'Quarter close',
  'Launch readiness',
  'Archive queue',
] as const;
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
                <strong>Willow Works Analytics</strong>
                <p style="margin: 0; color: var(--ui-text-secondary)">
                  Governed dashboard shell for operations, rollout, and review work.
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
              <UiButton>Create insight</UiButton>
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
                  <div style="display: grid; gap: var(--ui-space-2)">
                    <UiBadge variant="brand">UiDashboardLayout</UiBadge>
                    <h1 style="margin: 0">Operations cockpit</h1>
                    <p style="margin: 0; color: var(--ui-text-secondary)">
                      Slot-driven dashboard framing with a persistent aside, structured header, and
                      pure layout-only composition.
                    </p>
                  </div>
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
                Placeholder cards and widgets prove the main content slot without hardcoding product
                behavior.
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
                      style="
                        font-size: var(--ui-text-font-size-sm);
                        color: var(--ui-text-secondary);
                      "
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
              title="Delivery watchlist"
              description="Reusable widget content can sit inside the dashboard shell without owning routes."
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
                  Cross-team placeholders stay in the consumer proof, not in the public template.
                </UiCard>
                <UiCard>
                  <template #header>Pipeline</template>
                  Consumers can compose widgets or system packages in the default slot.
                </UiCard>
              </div>
            </UiWidgetShell>
          </div>
        </UiDashboardLayout>

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
              UiLayout remains the generic shell family while UiDashboardLayout covers the governed
              dashboard namespace.
            </UiLayoutFooter>
          </template>
        </UiLayout>

        <UiCard>
          <template #header>Directional flow layouts</template>
          <div
            style="
              display: grid;
              gap: var(--ui-space-5);
              grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
            "
          >
            <div class="ui-stack" style="gap: var(--ui-space-3)">
              <div style="display: grid; gap: var(--ui-space-2)">
                <strong>UiVerticalLayout</strong>
                <p style="margin: 0; color: var(--ui-text-secondary)">
                  Vertical flow wrapper with consumer-provided gap and opt-in vertical scrolling.
                </p>
              </div>

              <div
                data-ui-proof="vertical-default-frame"
                style="
                  min-block-size: 8rem;
                  padding: var(--ui-space-4);
                  border: 1px dashed var(--ui-border-subtle);
                  border-radius: var(--ui-radius-lg);
                "
              >
                <UiVerticalLayout gap="var(--ui-space-3)">
                  <UiBadge v-for="item in verticalItems" :key="item" variant="brand">
                    {{ item }}
                  </UiBadge>
                </UiVerticalLayout>
              </div>

              <div
                data-ui-proof="vertical-scroll-frame"
                style="
                  inline-size: min(100%, 16rem);
                  max-block-size: 12rem;
                  padding: var(--ui-space-4);
                  border: 1px dashed var(--ui-border-subtle);
                  border-radius: var(--ui-radius-lg);
                  overflow: hidden;
                "
              >
                <UiVerticalLayout gap="var(--ui-space-3)" scroll>
                  <div
                    v-for="item in verticalScrollItems"
                    :key="item"
                    style="
                      padding: var(--ui-space-3) var(--ui-space-4);
                      border: 1px solid var(--ui-border-subtle);
                      border-radius: var(--ui-radius-lg);
                      background: color-mix(in srgb, var(--ui-surface-default) 94%, transparent);
                      white-space: nowrap;
                    "
                  >
                    {{ item }}
                  </div>
                </UiVerticalLayout>
              </div>
            </div>

            <div class="ui-stack" style="gap: var(--ui-space-3)">
              <div style="display: grid; gap: var(--ui-space-2)">
                <strong>UiHorizontalLayout</strong>
                <p style="margin: 0; color: var(--ui-text-secondary)">
                  Horizontal flow wrapper that keeps natural content width until horizontal
                  scrolling is explicitly enabled.
                </p>
              </div>

              <div
                data-ui-proof="horizontal-default-frame"
                style="
                  min-block-size: 8rem;
                  padding: var(--ui-space-4);
                  border: 1px dashed var(--ui-border-subtle);
                  border-radius: var(--ui-radius-lg);
                "
              >
                <UiHorizontalLayout gap="var(--ui-space-3)">
                  <UiBadge v-for="item in horizontalItems" :key="item" variant="brand">
                    {{ item }}
                  </UiBadge>
                </UiHorizontalLayout>
              </div>

              <div
                data-ui-proof="horizontal-scroll-frame"
                style="
                  inline-size: min(100%, 18rem);
                  padding: var(--ui-space-4);
                  border: 1px dashed var(--ui-border-subtle);
                  border-radius: var(--ui-radius-lg);
                  overflow: hidden;
                "
              >
                <UiHorizontalLayout gap="var(--ui-space-3)" scroll>
                  <div
                    v-for="item in horizontalScrollItems"
                    :key="item"
                    style="
                      padding: var(--ui-space-3) var(--ui-space-4);
                      border: 1px solid var(--ui-border-subtle);
                      border-radius: var(--ui-radius-lg);
                      background: color-mix(in srgb, var(--ui-surface-default) 94%, transparent);
                      white-space: nowrap;
                    "
                  >
                    {{ item }}
                  </div>
                </UiHorizontalLayout>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </section>
  </section>
</template>
