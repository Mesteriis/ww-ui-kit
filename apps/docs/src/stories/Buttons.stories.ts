import type { Meta, StoryObj } from '@storybook/vue3';
import { UiButton, UiIconButton } from '@ww/core';

const meta = {
  title: 'Core/Buttons',
  component: UiButton
} satisfies Meta<typeof UiButton>;

export default meta;

export const Variants: StoryObj<typeof UiButton> = {
  render: () => ({
    components: { UiButton },
    template: `
      <div class="ui-stack">
        <div class="ui-cluster">
          <UiButton>Primary</UiButton>
          <UiButton variant="secondary">Secondary</UiButton>
          <UiButton variant="ghost">Ghost</UiButton>
          <UiButton variant="danger">Danger</UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton tone="trace">Trace</UiButton>
          <UiButton tone="debug">Debug</UiButton>
          <UiButton tone="info">Info</UiButton>
          <UiButton tone="success">Success</UiButton>
          <UiButton tone="warning">Warning</UiButton>
          <UiButton tone="error">Error</UiButton>
          <UiButton tone="critical">Critical</UiButton>
        </div>
      </div>
    `
  })
};

export const AppearancesAndEffects: StoryObj<typeof UiButton> = {
  render: () => ({
    components: { UiButton },
    template: `
      <div class="ui-stack">
        <div class="ui-cluster">
          <UiButton tone="info" appearance="outline">Info outline</UiButton>
          <UiButton tone="warning" appearance="outline">Warning outline</UiButton>
          <UiButton tone="critical" appearance="outline">Critical outline</UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton tone="debug" effect="border-flow">Debug border flow</UiButton>
          <UiButton tone="brand" effect="color-shift">Brand color shift</UiButton>
          <UiButton tone="critical" appearance="outline" effect="border-flow">
            Critical border flow
          </UiButton>
        </div>
      </div>
    `
  })
};

export const LoadingAndSizes: StoryObj<typeof UiButton> = {
  render: () => ({
    components: { UiButton, UiIconButton },
    template: `
      <div class="ui-stack">
        <div class="ui-cluster">
          <UiButton size="sm">Small</UiButton>
          <UiButton size="md" loading>Loading</UiButton>
          <UiButton size="lg" block>Block action</UiButton>
        </div>
        <div class="ui-cluster">
          <UiIconButton ariaLabel="Add item">+</UiIconButton>
          <UiIconButton ariaLabel="Open logs" tone="warning" appearance="outline">!</UiIconButton>
          <UiIconButton ariaLabel="Refresh" tone="debug" effect="color-shift" loading />
        </div>
      </div>
    `
  })
};
