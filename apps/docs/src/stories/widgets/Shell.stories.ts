import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge, UiButton } from '@ww/core';
import { UiWidgetShell } from '@ww/widgets';

const meta = {
  title: 'Widgets/Shell',
  tags: ['autodocs']
} satisfies Meta<typeof UiWidgetShell>;

export default meta;

export const Overview: StoryObj<typeof UiWidgetShell> = {
  render: () => ({
    components: {
      UiBadge,
      UiButton,
      UiWidgetShell
    },
    template: `
      <div class="ui-stack">
        <UiWidgetShell
          title="Traffic summary"
          description="Canonical black-box widget shell above core and systems."
        >
          <template #actions>
            <UiButton variant="secondary">Refresh</UiButton>
          </template>

          <div class="ui-stack">
            <div class="ui-cluster">
              <UiBadge variant="brand">Signal graph</UiBadge>
              <UiBadge>Charts adapter</UiBadge>
            </div>
            <p style="margin: 0;">Future widgets compose systems, but they do not become systems themselves.</p>
          </div>

          <template #footer>
            Widget shells keep action chrome and footer metadata consistent.
          </template>
        </UiWidgetShell>

        <div
          style="
            display: grid;
            gap: var(--ui-space-4);
            grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          "
        >
          <UiWidgetShell title="Loading widget" :loading="true" />
          <UiWidgetShell title="Error widget" error="Apps remain responsible for retry logic." />
        </div>
      </div>
    `
  })
};
