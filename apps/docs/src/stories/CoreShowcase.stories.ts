import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import {
  UiBadge,
  UiButton,
  UiCard,
  UiCheckbox,
  UiDialog,
  UiDivider,
  UiDrawer,
  UiEmptyState,
  UiField,
  UiIconButton,
  UiInput,
  UiSelectSimple,
  UiSkeleton,
  UiSpinner,
  UiSwitch,
  UiTabsList,
  UiTabsPanel,
  UiTabsRoot,
  UiTabsTrigger,
  UiTextarea
} from '@ww/core';

const meta = {
  title: 'Core/System Showcase',
  tags: ['autodocs']
} satisfies Meta;

export default meta;

export const AllCoreComponents: StoryObj = {
  render: () => ({
    components: {
      UiBadge,
      UiButton,
      UiCard,
      UiCheckbox,
      UiDialog,
      UiDivider,
      UiDrawer,
      UiEmptyState,
      UiField,
      UiIconButton,
      UiInput,
      UiSelectSimple,
      UiSkeleton,
      UiSpinner,
      UiSwitch,
      UiTabsList,
      UiTabsPanel,
      UiTabsRoot,
      UiTabsTrigger,
      UiTextarea
    },
    setup() {
      const inputValue = ref('Belovodye UiKit');
      const textareaValue = ref('Stories are the visual source of truth for the baseline layer.');
      const selectValue = ref('core');
      const checkboxValue = ref(true);
      const switchValue = ref(false);
      const tabsValue = ref('controls');
      const dialogOpen = ref(false);
      const drawerOpen = ref(false);

      const options = [
        { label: 'Tokens', value: 'tokens' },
        { label: 'Themes', value: 'themes' },
        { label: 'Core', value: 'core' }
      ];

      return {
        checkboxValue,
        dialogOpen,
        drawerOpen,
        inputValue,
        options,
        selectValue,
        switchValue,
        tabsValue,
        textareaValue
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Buttons and actions</template>
          <div class="ui-stack">
            <div class="ui-cluster">
              <UiButton>Primary</UiButton>
              <UiButton variant="secondary">Secondary</UiButton>
              <UiButton variant="ghost">Ghost</UiButton>
              <UiButton variant="danger">Danger</UiButton>
            </div>
            <div class="ui-cluster">
              <UiButton tone="debug">Debug</UiButton>
              <UiButton tone="info" appearance="outline">Info outline</UiButton>
              <UiButton tone="brand" effect="color-shift">Color shift</UiButton>
              <UiIconButton ariaLabel="Add item">+</UiIconButton>
              <UiIconButton ariaLabel="Review logs" tone="warning" appearance="outline">!</UiIconButton>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Fields and selection</template>
          <div
            style="
              display: grid;
              gap: var(--ui-space-4);
              grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
            "
          >
            <UiField label="Project name" hint="Field context wiring">
              <UiInput v-model="inputValue" />
            </UiField>
            <UiField label="Scope" error="Textarea error state">
              <UiTextarea v-model="textareaValue" />
            </UiField>
            <UiField label="Layer">
              <UiSelectSimple v-model="selectValue" :options="options" />
            </UiField>
          </div>
          <div class="ui-cluster" style="margin-top: var(--ui-space-4);">
            <UiCheckbox v-model="checkboxValue">Enable overlays</UiCheckbox>
            <UiSwitch v-model="switchValue" ariaLabel="Enable theme scope">Theme scope</UiSwitch>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Display and feedback</template>
          <div class="ui-stack">
            <div class="ui-cluster">
              <UiBadge>Neutral</UiBadge>
              <UiBadge variant="brand">Brand</UiBadge>
              <UiBadge variant="success">Success</UiBadge>
              <UiBadge variant="warning">Warning</UiBadge>
              <UiBadge variant="danger">Danger</UiBadge>
            </div>
            <UiDivider />
            <div class="ui-cluster">
              <UiSpinner size="sm" />
              <UiSpinner />
              <UiSpinner size="lg" />
            </div>
            <UiSkeleton width="100%" height="1rem" />
            <UiSkeleton width="4rem" height="4rem" shape="circle" />
            <UiEmptyState
              title="Foundation baseline"
              description="No product-specific blocks are mixed into the reusable layer."
            >
              <template #icon>◇</template>
              <template #actions>
                <UiButton variant="secondary">Read ADR</UiButton>
              </template>
            </UiEmptyState>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Tabs and overlays</template>
          <div class="ui-stack">
            <UiTabsRoot v-model="tabsValue">
              <UiTabsList>
                <UiTabsTrigger value="controls">Controls</UiTabsTrigger>
                <UiTabsTrigger value="overlay">Overlay</UiTabsTrigger>
                <UiTabsTrigger value="states">States</UiTabsTrigger>
              </UiTabsList>
              <UiTabsPanel value="controls">
                Buttons, fields, and selection controls share the same semantic contracts.
              </UiTabsPanel>
              <UiTabsPanel value="overlay">
                Dialog and drawer use the shared overlay stack and theme-aware portal root.
              </UiTabsPanel>
              <UiTabsPanel value="states">
                Stories document interaction and visual states together.
              </UiTabsPanel>
            </UiTabsRoot>
            <div class="ui-cluster">
              <UiButton @click="dialogOpen = true">Open dialog</UiButton>
              <UiButton variant="secondary" @click="drawerOpen = true">Open drawer</UiButton>
            </div>
          </div>
        </UiCard>

        <UiDialog v-model:open="dialogOpen" title="Dialog">
          <p>Focus trap, dismiss rules, and portal handling come from the shared primitives.</p>
          <template #footer>
            <UiButton variant="secondary" @click="dialogOpen = false">Cancel</UiButton>
            <UiButton @click="dialogOpen = false">Confirm</UiButton>
          </template>
        </UiDialog>

        <UiDrawer v-model:open="drawerOpen" title="Drawer" side="right">
          <p>Drawer uses the same foundation layer as dialog.</p>
          <template #footer>
            <UiButton variant="secondary" @click="drawerOpen = false">Close</UiButton>
          </template>
        </UiDrawer>
      </div>
    `
  })
};
