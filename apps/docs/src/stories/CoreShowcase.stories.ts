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
  UiDialog,
  UiDivider,
  UiDropdown,
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
  UiSkeleton,
  UiSpinner,
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

const meta = {
  title: 'Core/System Showcase',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const AllCoreComponents: StoryObj = {
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
      UiDialog,
      UiDivider,
      UiDropdown,
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
      UiSkeleton,
      UiSpinner,
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
      const inputValue = ref('Belovodye UiKit');
      const textareaValue = ref('Stories are the visual source of truth for the baseline layer.');
      const selectValue = ref('core');
      const checkboxValue = ref(true);
      const switchValue = ref(false);
      const stageValue = ref('review');
      const tabsValue = ref('controls');
      const dialogOpen = ref(false);
      const drawerOpen = ref(false);
      const popoverOpen = ref(false);
      const currentPage = ref(2);
      const toastRef = ref<{
        push: (payload: {
          title: string;
          description?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
        }) => string;
      } | null>(null);
      const lastMenuSelection = ref('review');
      const breadcrumbItems = [
        { label: 'Workspace', href: '#workspace' },
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
        { label: 'Tokens', value: 'tokens' },
        { label: 'Themes', value: 'themes' },
        { label: 'Core', value: 'core' },
      ];

      const pushToast = () => {
        toastRef.value?.push({
          title: 'Core showcase toast',
          description: 'Toast, popover, and dropdown share the current overlay runtime.',
          type: 'success',
        });
      };

      const onSelect = (payload: { label: string }) => {
        lastMenuSelection.value = payload.label;
      };

      return {
        checkboxValue,
        breadcrumbItems,
        dialogOpen,
        dropdownItems,
        drawerOpen,
        inputValue,
        currentPage,
        lastMenuSelection,
        onSelect,
        options,
        popoverOpen,
        pushToast,
        selectValue,
        stageValue,
        switchValue,
        tabsValue,
        toastRef,
        textareaValue,
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
          <UiField label="Release stage" hint="Roving focus stays group-aware">
            <UiRadioGroup v-model="stageValue" orientation="horizontal">
              <UiRadio value="design">Design</UiRadio>
              <UiRadio value="review">Review</UiRadio>
              <UiRadio value="ship">Ship</UiRadio>
            </UiRadioGroup>
          </UiField>
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
            <div class="ui-cluster">
              <UiTag variant="brand">Pinned</UiTag>
              <UiTag variant="success" appearance="outline">Healthy</UiTag>
              <UiTag variant="warning" closable>Review later</UiTag>
            </div>
            <UiDivider />
            <UiAlert
              type="warning"
              title="Proof surfaces stay synchronized"
              description="Storybook, playground, and tests should all confirm the same baseline contract."
            >
              <template #action>
                <UiButton size="sm" variant="secondary">Review</UiButton>
              </template>
            </UiAlert>
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
          <template #header>Navigation, disclosure, and overlays</template>
          <div class="ui-stack">
            <UiBreadcrumb :items="breadcrumbItems" :max-items="4" />
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
            <UiCollapse :default-value="['contracts']">
              <UiCollapsePanel value="contracts" title="Disclosure baseline">
                Collapse panels use the shared motion foundation and arrow-key header navigation.
              </UiCollapsePanel>
              <UiCollapsePanel value="overlay-runtime" title="Overlay runtime">
                Tooltip, popover, dropdown, toast, dialog, and drawer stay on the same layer canon.
              </UiCollapsePanel>
            </UiCollapse>
            <UiPagination
              v-model="currentPage"
              :total-items="96"
              :page-size="12"
              :sibling-count="1"
              :boundary-count="1"
            />
            <div class="ui-cluster">
              <UiTooltip content="Tooltip uses the same theme-aware portal path.">
                <UiButton variant="secondary">Hover for tooltip</UiButton>
              </UiTooltip>
              <UiPopover v-model:open="popoverOpen" width="trigger">
                <template #trigger>
                  <UiButton variant="secondary">Open popover</UiButton>
                </template>
                <div class="ui-stack" style="max-width: 16rem;">
                  <p style="margin: 0;">Floating surfaces allow interactive content without focus trap.</p>
                  <UiButton size="sm" variant="secondary" @click="popoverOpen = false">Close popover</UiButton>
                </div>
              </UiPopover>
              <UiDropdown :items="dropdownItems" @select="onSelect">
                <template #trigger>
                  <UiButton variant="secondary">Open action menu</UiButton>
                </template>
              </UiDropdown>
              <UiButton variant="ghost" @click="pushToast">Show toast</UiButton>
              <UiButton @click="dialogOpen = true">Open dialog</UiButton>
              <UiButton variant="secondary" @click="drawerOpen = true">Open drawer</UiButton>
            </div>
            <p style="margin: 0;">Last menu selection: {{ lastMenuSelection }} · Current page: {{ currentPage }}</p>
          </div>
        </UiCard>

        <UiToast ref="toastRef" />

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
    `,
  }),
};
