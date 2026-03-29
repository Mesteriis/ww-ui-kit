import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import {
  UiBadge,
  UiButton,
  UiCard,
  UiCheckbox,
  UiDialog,
  UiDrawer,
  UiEmptyState,
  UiField,
  UiIconButton,
  UiInput,
  UiSelectSimple,
  UiSwitch,
  UiTabsList,
  UiTabsPanel,
  UiTabsRoot,
  UiTabsTrigger,
  UiTextarea
} from '@ww/core';
import { getThemeMeta } from '@ww/themes';

const meta = {
  title: 'Foundations/Belovodye Theme',
  tags: ['autodocs']
} satisfies Meta;

export default meta;

export const SystemShowcase: StoryObj = {
  render: () => ({
    components: {
      UiBadge,
      UiButton,
      UiCard,
      UiCheckbox,
      UiDialog,
      UiDrawer,
      UiEmptyState,
      UiField,
      UiIconButton,
      UiInput,
      UiSelectSimple,
      UiSwitch,
      UiTabsList,
      UiTabsPanel,
      UiTabsRoot,
      UiTabsTrigger,
      UiTextarea
    },
    setup() {
      const inputValue = ref('Belovodye analytics workspace');
      const textareaValue = ref('Cold light surfaces, calm contrast, and restrained river-blue accents.');
      const selectValue = ref('dashboard');
      const checkboxValue = ref(true);
      const switchValue = ref(true);
      const tabValue = ref('controls');
      const dialogOpen = ref(false);
      const drawerOpen = ref(false);
      const belovodyeTheme = getThemeMeta('belovodye');

      const options = [
        { label: 'Dashboard', value: 'dashboard' },
        { label: 'Landing section', value: 'landing' },
        { label: 'Ops console', value: 'ops' }
      ];

      return {
        checkboxValue,
        dialogOpen,
        drawerOpen,
        belovodyeTheme,
        inputValue,
        options,
        selectValue,
        switchValue,
        tabValue,
        textareaValue
      };
    },
    template: `
      <section
        :data-ui-theme="belovodyeTheme.name"
        :data-ui-theme-type="belovodyeTheme.type"
        style="
          display: grid;
          gap: var(--ui-space-6);
          padding: var(--ui-space-6);
          border-radius: var(--ui-radius-xl);
          background:
            radial-gradient(circle at top right, var(--ui-surface-brand-soft), transparent 32%),
            linear-gradient(180deg, var(--ui-surface-canvas), var(--ui-surface-default));
        "
      >
        <UiCard>
          <template #header>Belovodye quick review</template>
          <div style="display: grid; gap: var(--ui-space-5);">
            <div style="display: flex; gap: var(--ui-space-3); align-items: center; flex-wrap: wrap;">
              <UiBadge variant="brand">{{ belovodyeTheme.label }}</UiBadge>
              <UiBadge>{{ belovodyeTheme.type }} family</UiBadge>
            </div>
            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap; align-items: center;">
              <UiButton>Primary action</UiButton>
              <UiButton variant="secondary">Secondary</UiButton>
              <UiButton variant="ghost">Ghost</UiButton>
              <UiButton tone="warning" appearance="outline">Warning outline</UiButton>
              <UiIconButton ariaLabel="Open details" tone="info" appearance="outline">
                ⌘
              </UiIconButton>
            </div>

            <div style="display: grid; gap: var(--ui-space-4); grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));">
              <UiField label="Workspace" hint="Field surfaces stay crisp in Belovodye">
                <UiInput v-model="inputValue" />
              </UiField>
              <UiField label="Surface family">
                <UiSelectSimple v-model="selectValue" :options="options" />
              </UiField>
              <UiField label="Description" error="State styling review">
                <UiTextarea v-model="textareaValue" />
              </UiField>
            </div>

            <div style="display: flex; gap: var(--ui-space-4); flex-wrap: wrap;">
              <UiCheckbox v-model="checkboxValue">Pinned filters</UiCheckbox>
              <UiSwitch v-model="switchValue" ariaLabel="Enable scoped preview">
                Scoped preview
              </UiSwitch>
            </div>

            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <UiBadge>Neutral</UiBadge>
              <UiBadge variant="brand">Brand</UiBadge>
              <UiBadge variant="success">Success</UiBadge>
              <UiBadge variant="warning">Warning</UiBadge>
              <UiBadge variant="danger">Danger</UiBadge>
            </div>
          </div>
        </UiCard>

        <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));">
          <UiCard>
            <template #header>Tabs and display</template>
            <UiTabsRoot v-model="tabValue">
              <UiTabsList>
                <UiTabsTrigger value="controls">Controls</UiTabsTrigger>
                <UiTabsTrigger value="overlay">Overlay</UiTabsTrigger>
                <UiTabsTrigger value="empty">Empty state</UiTabsTrigger>
              </UiTabsList>
              <UiTabsPanel value="controls">
                Buttons, inputs, badges, and tabs share the same cold-neutral contrast system.
              </UiTabsPanel>
              <UiTabsPanel value="overlay">
                Dialog and drawer surfaces inherit Belovodye through the theme-aware portal stack.
              </UiTabsPanel>
              <UiTabsPanel value="empty">
                Empty states stay airy without losing structure or contrast.
              </UiTabsPanel>
            </UiTabsRoot>
          </UiCard>

          <UiEmptyState
            title="Belovodye empty state"
            description="This baseline presentation stays calm, light, and readable across dashboard and landing contexts."
          >
            <template #icon>◇</template>
            <template #actions>
              <UiButton variant="secondary">Learn more</UiButton>
              <UiButton @click="dialogOpen = true">Open dialog</UiButton>
            </template>
          </UiEmptyState>
        </div>

        <UiCard>
          <template #header>Overlay review</template>
          <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
            <UiButton @click="dialogOpen = true">Open Belovodye dialog</UiButton>
            <UiButton variant="secondary" @click="drawerOpen = true">Open Belovodye drawer</UiButton>
          </div>
        </UiCard>

        <UiDialog
          v-model:open="dialogOpen"
          title="Belovodye dialog"
          description="Overlay surfaces keep the same cool, premium light tone."
        >
          <p style="margin: 0;">Dialog border, surface, text, and focus states inherit the Belovodye subtree theme.</p>
          <template #footer>
            <UiButton variant="secondary" @click="dialogOpen = false">Cancel</UiButton>
            <UiButton @click="dialogOpen = false">Confirm</UiButton>
          </template>
        </UiDialog>

        <UiDrawer
          v-model:open="drawerOpen"
          title="Belovodye drawer"
          description="Drawer surfaces stay aligned with the same surface and border language."
          side="right"
        >
          <div style="display: grid; gap: var(--ui-space-4);">
            <p style="margin: 0;">This drawer inherits the same subtree theme through the shared portal resolution.</p>
            <UiBadge variant="brand">Scoped overlay</UiBadge>
          </div>
        </UiDrawer>
      </section>
    `
  })
};
