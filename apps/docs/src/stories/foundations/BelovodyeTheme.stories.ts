import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import {
  UiAlert,
  UiBadge,
  UiBreadcrumb,
  UiButton,
  UiCard,
  UiCheckbox,
  UiCollapse,
  UiCollapsePanel,
  UiDropdown,
  UiDialog,
  UiDrawer,
  UiEmptyState,
  UiField,
  UiIconButton,
  UiInput,
  UiPagination,
  UiPopover,
  UiRadio,
  UiRadioGroup,
  UiSelectSimple,
  UiSwitch,
  UiTag,
  UiTabsList,
  UiTabsPanel,
  UiTabsRoot,
  UiTabsTrigger,
  UiToast,
  UiTextarea,
  UiTooltip,
} from '@ww/core';
import { getThemeMeta } from '@ww/themes';

const meta = {
  title: 'Foundations/Belovodye Theme',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const SystemShowcase: StoryObj = {
  render: () => ({
    components: {
      UiAlert,
      UiBadge,
      UiBreadcrumb,
      UiButton,
      UiCard,
      UiCheckbox,
      UiCollapse,
      UiCollapsePanel,
      UiDropdown,
      UiDialog,
      UiDrawer,
      UiEmptyState,
      UiField,
      UiIconButton,
      UiInput,
      UiPagination,
      UiPopover,
      UiRadio,
      UiRadioGroup,
      UiSelectSimple,
      UiSwitch,
      UiTag,
      UiTabsList,
      UiTabsPanel,
      UiTabsRoot,
      UiTabsTrigger,
      UiToast,
      UiTextarea,
      UiTooltip,
    },
    setup() {
      const inputValue = ref('Belovodye analytics workspace');
      const textareaValue = ref(
        'Cold light surfaces, calm contrast, and restrained river-blue accents.'
      );
      const selectValue = ref('dashboard');
      const checkboxValue = ref(true);
      const switchValue = ref(true);
      const stageValue = ref('review');
      const tabValue = ref('controls');
      const dialogOpen = ref(false);
      const drawerOpen = ref(false);
      const popoverOpen = ref(false);
      const currentPage = ref(2);
      const lastDropdownAction = ref('Review queue');
      const toastRef = ref<{
        push: (payload: {
          title: string;
          description?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
        }) => string;
      } | null>(null);
      const belovodyeTheme = getThemeMeta('belovodye');
      const breadcrumbItems = [
        { label: 'Belovodye', href: '#theme' },
        { label: 'Core', href: '#core' },
        { label: 'Wave one', href: '#wave-one' },
        { label: 'Review', current: true },
      ];
      const dropdownItems = [
        { label: 'Review queue', value: 'review' },
        { label: 'Promote release', value: 'promote' },
        { type: 'divider' as const },
        {
          type: 'group' as const,
          label: 'Deploy',
          items: [
            { label: 'Bravo', value: 'bravo' },
            { label: 'Charlie', value: 'charlie' },
          ],
        },
      ];

      const options = [
        { label: 'Dashboard', value: 'dashboard' },
        { label: 'Landing section', value: 'landing' },
        { label: 'Ops console', value: 'ops' },
      ];

      const onSelect = (payload: { label: string }) => {
        lastDropdownAction.value = payload.label;
      };

      const pushToast = () => {
        toastRef.value?.push({
          title: 'Belovodye toast',
          description: 'Floating overlays and toast stacks inherit the scoped theme.',
          type: 'success',
        });
      };

      return {
        checkboxValue,
        breadcrumbItems,
        dialogOpen,
        currentPage,
        dropdownItems,
        drawerOpen,
        belovodyeTheme,
        inputValue,
        lastDropdownAction,
        onSelect,
        options,
        popoverOpen,
        pushToast,
        selectValue,
        stageValue,
        switchValue,
        tabValue,
        toastRef,
        textareaValue,
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

            <UiField label="Release stage" hint="Selection surfaces keep the same cold-neutral rhythm">
              <UiRadioGroup v-model="stageValue" orientation="horizontal">
                <UiRadio value="design">Design</UiRadio>
                <UiRadio value="review">Review</UiRadio>
                <UiRadio value="ship">Ship</UiRadio>
              </UiRadioGroup>
            </UiField>

            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <UiBadge>Neutral</UiBadge>
              <UiBadge variant="brand">Brand</UiBadge>
              <UiBadge variant="success">Success</UiBadge>
              <UiBadge variant="warning">Warning</UiBadge>
              <UiBadge variant="danger">Danger</UiBadge>
            </div>
            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <UiTag variant="brand">Pinned</UiTag>
              <UiTag variant="success" appearance="outline">Healthy</UiTag>
              <UiTag variant="warning" closable>Review later</UiTag>
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
            <UiCollapse :default-value="['contracts']">
              <UiCollapsePanel value="contracts" title="Disclosure baseline">
                Collapse panels stay crisp and controlled under the Belovodye surface language.
              </UiCollapsePanel>
              <UiCollapsePanel value="overlay" title="Overlay scope">
                Tooltip, popover, dropdown, dialog, drawer, and toast all inherit the subtree theme.
              </UiCollapsePanel>
            </UiCollapse>
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
          <template #header>Navigation and overlay review</template>
          <div style="display: grid; gap: var(--ui-space-4);">
            <UiBreadcrumb :items="breadcrumbItems" :max-items="4" />
            <UiPagination
              v-model="currentPage"
              :total-items="96"
              :page-size="12"
              :sibling-count="1"
              :boundary-count="1"
            />
            <UiAlert
              type="warning"
              title="Belovodye review notice"
              description="Alerts, tags, navigation, and overlays stay inside the same themed baseline."
            >
              <template #action>
                <UiButton size="sm" variant="secondary">Review queue</UiButton>
              </template>
            </UiAlert>
          </div>
          <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap; margin-top: var(--ui-space-4);">
            <UiTooltip content="Tooltip portals stay inside the themed subtree.">
              <UiButton variant="secondary">Hover tooltip</UiButton>
            </UiTooltip>
            <UiPopover v-model:open="popoverOpen" width="trigger">
              <template #trigger>
                <UiButton variant="secondary">Open Belovodye popover</UiButton>
              </template>
              <p style="margin: 0; max-width: 16rem;">
                Floating surfaces keep the same cool, premium light tone.
              </p>
            </UiPopover>
            <UiDropdown :items="dropdownItems" @select="onSelect">
              <template #trigger>
                <UiButton variant="secondary">Open action menu</UiButton>
              </template>
            </UiDropdown>
            <UiButton @click="dialogOpen = true">Open Belovodye dialog</UiButton>
            <UiButton variant="secondary" @click="drawerOpen = true">Open Belovodye drawer</UiButton>
            <UiButton variant="ghost" @click="pushToast">Show Belovodye toast</UiButton>
          </div>
          <p style="margin: var(--ui-space-3) 0 0;">Last dropdown action: {{ lastDropdownAction }}</p>
        </UiCard>

        <UiToast ref="toastRef" />

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
    `,
  }),
};
