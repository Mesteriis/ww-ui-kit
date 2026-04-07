import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { UiBadge, UiButton, UiCard } from '@ww/core';
import { UiWidgetBody, UiWidgetFooter, UiWidgetHeader, UiWidgetShell } from '@ww/widgets';

const meta = {
  title: 'Widgets/Scenarios/Shell',
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiWidgetShell>;

export default meta;

export const Overview: StoryObj<typeof UiWidgetShell> = {
  render: () => ({
    components: {
      UiBadge,
      UiButton,
      UiCard,
      UiWidgetBody,
      UiWidgetFooter,
      UiWidgetHeader,
      UiWidgetShell,
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

        <UiCard>
          <template #header>Direct shell parts</template>
          <div class="ui-widget-shell ui-widget-shell--subtle" data-ui-surface="subtle">
            <UiWidgetHeader>
              <div class="ui-widget-shell__copy">
                <h3 class="ui-widget-shell__title">UiWidgetHeader</h3>
                <p class="ui-widget-shell__description">
                  Header, body, and footer stay available for explicit widget composition.
                </p>
              </div>
            </UiWidgetHeader>

            <UiWidgetBody :padded="false">
              <div class="ui-stack" style="padding: var(--ui-space-4);">
                <UiBadge variant="brand">UiWidgetBody</UiBadge>
                <p style="margin: 0;">
                  Direct body composition remains canonical when a consumer needs custom shell assembly.
                </p>
              </div>
            </UiWidgetBody>

            <UiWidgetFooter>
              <div class="ui-cluster" style="justify-content: space-between; width: 100%;">
                <span>UiWidgetFooter</span>
                <UiButton size="sm" variant="secondary">Acknowledge</UiButton>
              </div>
            </UiWidgetFooter>
          </div>
        </UiCard>
      </div>
    `,
  }),
};
