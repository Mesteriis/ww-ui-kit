import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge, UiButton } from '@ww/core';
import { UiPageSection, UiPageTemplate } from '@ww/page-templates';
import { UiWidgetShell } from '@ww/widgets';

const meta = {
  title: 'Page Templates/Shell',
  tags: ['autodocs'],
} satisfies Meta<typeof UiPageTemplate>;

export default meta;

export const Overview: StoryObj<typeof UiPageTemplate> = {
  render: () => ({
    components: {
      UiBadge,
      UiButton,
      UiPageSection,
      UiPageTemplate,
      UiWidgetShell,
    },
    template: `
      <UiPageTemplate
        title="Workspace shell"
        description="Page templates stay layout-focused and compose widgets without becoming route pages."
        has-sidebar
      >
        <template #toolbar>
          <UiButton variant="secondary">Refresh</UiButton>
          <UiButton>Open action</UiButton>
        </template>

        <UiPageSection title="Primary region" description="Default slot content goes here.">
          <UiWidgetShell title="Summary widget" description="Nested widget inside template shell">
            <p style="margin: 0;">Apps will eventually place real widget implementations here.</p>
          </UiWidgetShell>
        </UiPageSection>

        <template #sidebar>
          <UiPageSection title="Sidebar" description="Side rail composition zone">
            <div class="ui-cluster">
              <UiBadge variant="brand">Filters</UiBadge>
              <UiBadge>Saved views</UiBadge>
            </div>
          </UiPageSection>
        </template>

        <template #footer>
          Page templates stop at reusable shell structure. Real route pages stay in apps.
        </template>
      </UiPageTemplate>
    `,
  }),
};
