import type { Meta, StoryObj } from '@storybook/vue3';

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
      UiLayout,
      UiLayoutContent,
      UiLayoutFooter,
      UiLayoutHeader,
      UiLayoutSection,
      UiLayoutSider,
      UiLayoutToolbar,
      UiWidgetShell,
    },
    template: `
      <div class="ui-stack" style="gap: var(--ui-space-6);">
        <UiLayout width="full">
          <template #header>
            <UiLayoutHeader>
              <div style="display: grid; gap: var(--ui-space-2);">
                <h1 style="margin: 0;">Dashboard operations shell</h1>
                <p style="margin: 0; color: var(--ui-text-secondary);">
                  Structural layout primitives frame widgets, filters, and status without becoming route pages.
                </p>
              </div>
              <div class="ui-cluster">
                <UiBadge variant="brand">Dashboard-like</UiBadge>
                <UiBadge>Future named template later</UiBadge>
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
              <UiWidgetShell title="Summary widget" description="Nested widget inside the dashboard-like shell">
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
                  <UiBadge>Saved views</UiBadge>
                </div>
              </UiLayoutSection>
            </UiLayoutSider>
          </template>

          <template #footer>
            <UiLayoutFooter>
              Dashboard shells stay structural. Route pages and menu state stay in apps.
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
      </div>
    `,
  }),
};
