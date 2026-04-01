import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge, UiButton, UiCard } from '@ww/core';
import {
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
import { UiWidgetShell } from '@ww/widgets';

const meta = {
  title: 'Page Templates/Shell',
  tags: ['autodocs'],
} satisfies Meta<typeof UiLayout>;

export default meta;

export const Overview: StoryObj<typeof UiLayout> = {
  render: () => ({
    components: {
      UiBadge,
      UiButton,
      UiCard,
      UiHorizontalLayout,
      UiLayout,
      UiLayoutContent,
      UiLayoutFooter,
      UiLayoutHeader,
      UiLayoutSection,
      UiLayoutSider,
      UiLayoutToolbar,
      UiVerticalLayout,
      UiWidgetShell,
    },
    setup() {
      return {
        horizontalItems: ['North lane', 'Bravo lane', 'Charlie lane'],
        horizontalScrollItems: [
          'Executive summary',
          'Delivery desk',
          'Incident review',
          'Quarter close',
          'Launch readiness',
          'Archive queue',
        ],
        verticalItems: ['Filters', 'Approvals', 'Escalations'],
        verticalScrollItems: [
          'Daily ops review',
          'Revenue handoff',
          'Launch audit',
          'Incident follow-up',
          'Quarter close',
          'Vendor sync',
        ],
      };
    },
    template: `
      <div class="ui-stack" style="gap: var(--ui-space-6);">
        <UiLayout width="full">
          <template #header>
            <UiLayoutHeader>
              <div style="display: grid; gap: var(--ui-space-2);">
                <h1 style="margin: 0;">Operations workspace shell</h1>
                <p style="margin: 0; color: var(--ui-text-secondary);">
                  Structural layout primitives frame widgets, filters, and status without becoming
                  route pages.
                </p>
              </div>
              <div class="ui-cluster">
                <UiBadge variant="brand">Generic shell</UiBadge>
                <UiBadge>Named templates compose above it</UiBadge>
              </div>
            </UiLayoutHeader>
          </template>

          <template #toolbar>
            <UiLayoutToolbar>
              <UiButton variant="secondary">Refresh</UiButton>
              <UiButton>Create report</UiButton>
            </UiLayoutToolbar>
          </template>

          <UiLayoutContent :padded="false">
            <UiLayoutSection
              title="Primary region"
              description="Default slot content stays structural and can host widgets or systems."
            >
              <UiWidgetShell
                title="Summary widget"
                description="Nested widget inside the reusable generic shell"
              >
                <p style="margin: 0;">Apps will eventually place real widget implementations here.</p>
              </UiWidgetShell>
            </UiLayoutSection>

            <UiLayoutSection title="Shared shell rule" description="Toolbar and section primitives stay layout-first.">
              <div class="ui-cluster">
                <UiBadge variant="brand">Layout-first</UiBadge>
                <UiBadge>Route-agnostic</UiBadge>
                <UiBadge>Widget-ready</UiBadge>
              </div>
            </UiLayoutSection>
          </UiLayoutContent>

          <template #sider>
            <UiLayoutSider>
              <UiLayoutSection title="Operations rail" description="Side rail composition zone">
                <div class="ui-cluster">
                  <UiBadge variant="brand">Filters</UiBadge>
                  <UiBadge>Workspace notes</UiBadge>
                </div>
              </UiLayoutSection>
            </UiLayoutSider>
          </template>

          <template #footer>
            <UiLayoutFooter>
              UiLayout stays generic. Route pages and dashboard-specific interaction state stay in
              apps or named templates.
            </UiLayoutFooter>
          </template>
        </UiLayout>

        <UiLayout>
          <template #header>
            <UiLayoutHeader>
              <div style="display: grid; gap: var(--ui-space-2);">
                <h1 style="margin: 0;">Marketing launch shell</h1>
                <p style="margin: 0; color: var(--ui-text-secondary);">
                  The same layout primitives can frame hero, proof, and CTA regions without page-specific root props.
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
              description="Named marketing templates come later; this shell layer stays generic."
            >
              <p style="margin: 0;">
                Campaign copy, proof, and conversion actions can be arranged here without introducing router or product state.
              </p>
            </UiLayoutSection>

            <UiLayoutSection
              title="Proof points"
              description="Layout sections stay reusable across dashboard, workspace, and marketing consumers."
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
                <UiBadge>Reusable shell</UiBadge>
              </div>
            </UiLayoutSection>
          </UiLayoutContent>

          <template #footer>
            <UiLayoutFooter>
              Dashboard, marketing, and workspace templates are composed above UiLayout.
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
            <div class="ui-stack" style="gap: var(--ui-space-3);">
              <div style="display: grid; gap: var(--ui-space-2);">
                <strong>UiVerticalLayout</strong>
                <p style="margin: 0; color: var(--ui-text-secondary);">
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

            <div class="ui-stack" style="gap: var(--ui-space-3);">
              <div style="display: grid; gap: var(--ui-space-2);">
                <strong>UiHorizontalLayout</strong>
                <p style="margin: 0; color: var(--ui-text-secondary);">
                  Horizontal flow wrapper that keeps natural content width until horizontal scrolling
                  is explicitly enabled.
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
    `,
  }),
};
