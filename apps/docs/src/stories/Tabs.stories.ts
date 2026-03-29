import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { UiTabsList, UiTabsPanel, UiTabsRoot, UiTabsTrigger } from '@ww/core';

const meta = {
  title: 'Core/Tabs',
  component: UiTabsRoot
} satisfies Meta<typeof UiTabsRoot>;

export default meta;

export const CompoundTabs: StoryObj<typeof UiTabsRoot> = {
  render: () => ({
    components: { UiTabsList, UiTabsPanel, UiTabsRoot, UiTabsTrigger },
    setup() {
      const current = ref('overview');
      return { current };
    },
    template: `
      <UiTabsRoot v-model="current">
        <UiTabsList>
          <UiTabsTrigger value="overview">Overview</UiTabsTrigger>
          <UiTabsTrigger value="contract">Contract</UiTabsTrigger>
          <UiTabsTrigger value="states">States</UiTabsTrigger>
        </UiTabsList>
        <UiTabsPanel value="overview">
          Compound tabs use provide/inject and roving focus.
        </UiTabsPanel>
        <UiTabsPanel value="contract">
          Keyboard support covers arrows, home, end, enter, and space.
        </UiTabsPanel>
        <UiTabsPanel value="states">
          Stories document interactive and visual states together.
        </UiTabsPanel>
      </UiTabsRoot>
    `
  })
};
