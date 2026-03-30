import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, ref } from 'vue';

import {
  UiAlert,
  UiAutocomplete,
  UiAvatar,
  UiAvatarGroup,
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
  UiMenu,
  UiNumberInput,
  UiPagination,
  UiPopover,
  UiProgress,
  UiRadio,
  UiRadioGroup,
  UiSelect,
  UiSelectSimple,
  UiSkeleton,
  UiSpinner,
  UiSteps,
  UiSwitch,
  UiTable,
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
      UiAutocomplete,
      UiAvatar,
      UiAvatarGroup,
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
      UiMenu,
      UiNumberInput,
      UiPagination,
      UiPopover,
      UiProgress,
      UiRadio,
      UiRadioGroup,
      UiSelect,
      UiSelectSimple,
      UiSkeleton,
      UiSpinner,
      UiSteps,
      UiSwitch,
      UiTable,
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
      const textareaValue = ref(
        'Stories remain the visual source of truth for the baseline layer.'
      );
      const selectValue = ref('core');
      const richSelectValue = ref<string | null>('bravo');
      const autocompleteValue = ref('');
      const numberValue = ref<number | null>(8.5);
      const checkboxValue = ref(true);
      const switchValue = ref(false);
      const stageValue = ref('review');
      const tabsValue = ref('controls');
      const dialogOpen = ref(false);
      const drawerOpen = ref(false);
      const popoverOpen = ref(false);
      const currentPage = ref(2);
      const selectedMenuKeys = ref(['review']);
      const currentStep = ref(1);
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
        { label: 'Wave two', href: '#wave-two' },
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

      const menuItems = [
        { label: 'Overview', key: 'overview', value: 'overview' },
        {
          type: 'group' as const,
          label: 'Deploy',
          items: [
            { label: 'Review', key: 'review', value: 'review', icon: '⌘' },
            { label: 'Ship', key: 'ship', value: 'ship' },
          ],
        },
      ];

      const options = [
        { label: 'Tokens', value: 'tokens' },
        { label: 'Themes', value: 'themes' },
        { label: 'Core', value: 'core' },
      ];

      const richOptions = [
        { label: 'Overview queue', value: 'overview', icon: '⌘' },
        {
          type: 'group' as const,
          label: 'Deploy lanes',
          options: [
            { label: 'Bravo lane', value: 'bravo', icon: 'B' },
            { label: 'Charlie lane', value: 'charlie', disabled: true, icon: 'C' },
          ],
        },
      ];

      const autocompleteItems = [
        { label: 'Belovodye control room', value: 'Belovodye control room' },
        { label: 'Core wave verify', value: 'Core wave verify' },
        { label: 'Bravo deploy lane', value: 'Bravo deploy lane' },
      ];

      const avatarItems = [
        { initials: 'BV', alt: 'Belovodye' },
        { initials: 'CR', alt: 'Core review', tone: 'brand' as const },
        { initials: 'QA', alt: 'Quality gate', tone: 'success' as const },
      ];

      const steps = [
        { title: 'Design', description: 'Shape the baseline contract' },
        { title: 'Review', description: 'Stories and tests stay aligned' },
        { title: 'Ship', description: 'Green CI before merge' },
      ];

      const tableColumns = [
        { key: 'surface', header: 'Surface' },
        { key: 'status', header: 'Status', align: 'center' as const },
        { key: 'proof', header: 'Proof' },
      ];

      const tableData = [
        { surface: 'UiSelect', status: 'Shipped', proof: 'Storybook + harness' },
        { surface: 'UiMenu', status: 'Shipped', proof: 'Keyboard + a11y checks' },
        { surface: 'UiTable', status: 'Shipped', proof: 'Semantic table + unit slots' },
      ];

      const currentStepLabel = computed(() => steps[currentStep.value]?.title ?? 'Unknown');

      const pushToast = () => {
        toastRef.value?.push({
          title: 'Core showcase toast',
          description:
            'Toast, popover, dropdown, and rich selects share the sanctioned floating runtime.',
          type: 'success',
        });
      };

      const onSelect = (payload: { label: string }) => {
        lastMenuSelection.value = payload.label;
      };

      const onMenuSelect = (payload: { key: string }) => {
        selectedMenuKeys.value = [payload.key];
      };

      return {
        autocompleteItems,
        autocompleteValue,
        avatarItems,
        breadcrumbItems,
        checkboxValue,
        currentPage,
        currentStep,
        currentStepLabel,
        dialogOpen,
        dropdownItems,
        drawerOpen,
        inputValue,
        lastMenuSelection,
        menuItems,
        numberValue,
        onMenuSelect,
        onSelect,
        options,
        popoverOpen,
        pushToast,
        richOptions,
        richSelectValue,
        selectValue,
        selectedMenuKeys,
        stageValue,
        steps,
        switchValue,
        tableColumns,
        tableData,
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
            <UiField label="Budget">
              <UiNumberInput v-model="numberValue" :min="0" :max="16" :step="0.5" :precision="1" />
            </UiField>
            <UiField label="Deploy lane">
              <UiSelect
                v-model="richSelectValue"
                searchable
                clearable
                placeholder="Pick a lane"
                :options="richOptions"
              />
            </UiField>
            <UiField label="Command search">
              <UiAutocomplete v-model="autocompleteValue" :items="autocompleteItems" />
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
          <template #header>Display and data</template>
          <div class="ui-stack">
            <div class="ui-cluster">
              <UiBadge>Neutral</UiBadge>
              <UiBadge variant="brand">Brand</UiBadge>
              <UiBadge variant="success">Success</UiBadge>
              <UiBadge variant="warning">Warning</UiBadge>
              <UiBadge variant="danger">Danger</UiBadge>
            </div>
            <div class="ui-cluster">
              <UiAvatar initials="BV" alt="Belovodye avatar" tone="brand" />
              <UiAvatar icon="⚙" alt="Settings avatar" tone="warning" />
              <UiAvatarGroup :items="avatarItems" :max="2" />
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
              description="Storybook, playground, and tests confirm the same baseline contract."
            >
              <template #action>
                <UiButton size="sm" variant="secondary">Review</UiButton>
              </template>
            </UiAlert>
            <div class="ui-cluster">
              <UiProgress :value="64" show-value />
              <UiProgress variant="circular" :value="82" show-value status="success" />
              <UiProgress indeterminate status="warning" />
            </div>
            <div class="ui-cluster">
              <UiSpinner size="sm" />
              <UiSpinner />
              <UiSpinner size="lg" />
            </div>
            <UiSkeleton width="100%" height="1rem" />
            <UiSkeleton width="4rem" height="4rem" shape="circle" />
            <UiTable caption="Core second-wave coverage" :columns="tableColumns" :data="tableData" bordered striped>
              <template #cell="{ column, value }">
                <strong v-if="column.key === 'surface'">{{ value }}</strong>
                <UiBadge v-else-if="column.key === 'status'" variant="success">{{ value }}</UiBadge>
                <span v-else>{{ value }}</span>
              </template>
            </UiTable>
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

            <div
              style="
                display: grid;
                gap: var(--ui-space-4);
                grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
              "
            >
              <div class="ui-stack">
                <UiMenu
                  v-model:selected-keys="selectedMenuKeys"
                  :items="menuItems"
                  aria-label="Showcase menu"
                  @select="onMenuSelect"
                />
                <UiSteps
                  v-model="currentStep"
                  :items="steps"
                  clickable
                  linear
                  aria-label="Showcase steps"
                />
                <p style="margin: 0;">Current step: {{ currentStepLabel }}</p>
              </div>

              <div class="ui-stack">
                <UiTabsRoot v-model="tabsValue">
                  <UiTabsList>
                    <UiTabsTrigger value="controls">Controls</UiTabsTrigger>
                    <UiTabsTrigger value="overlay">Overlay</UiTabsTrigger>
                    <UiTabsTrigger value="empty">Empty state</UiTabsTrigger>
                  </UiTabsList>
                  <UiTabsPanel value="controls">
                    Buttons, inputs, badges, and steps share the same baseline tokens.
                  </UiTabsPanel>
                  <UiTabsPanel value="overlay">
                    Dialog, drawer, dropdown, and popover stay on the sanctioned overlay path.
                  </UiTabsPanel>
                  <UiTabsPanel value="empty">
                    Empty states stay airy without losing structure or contrast.
                  </UiTabsPanel>
                </UiTabsRoot>

                <UiCollapse :default-value="['contracts']">
                  <UiCollapsePanel value="contracts" title="Disclosure baseline">
                    Collapse panels stay crisp and controlled under the shared motion system.
                  </UiCollapsePanel>
                  <UiCollapsePanel value="overlay" title="Overlay scope">
                    Tooltip, popover, dropdown, dialog, drawer, and toast all share a single runtime.
                  </UiCollapsePanel>
                </UiCollapse>
              </div>
            </div>

            <UiPagination
              v-model="currentPage"
              :total-items="144"
              :page-size="12"
              :sibling-count="1"
              :boundary-count="1"
              aria-label="Release pages"
            />
            <p style="margin: 0;">Last menu action: {{ lastMenuSelection }}</p>

            <div class="ui-cluster">
              <UiTooltip content="Tooltip surfaces stay on the sanctioned tooltip layer.">
                <UiButton variant="secondary">Hover for tooltip</UiButton>
              </UiTooltip>

              <UiPopover v-model:open="popoverOpen" width="trigger">
                <template #trigger>
                  <UiButton>Open popover</UiButton>
                </template>
                <div class="ui-stack" style="max-width: 16rem;">
                  <p style="margin: 0;">Escape closes the popover and returns focus to the trigger.</p>
                  <UiButton size="sm" variant="secondary" @click="popoverOpen = false">
                    Close popover
                  </UiButton>
                </div>
              </UiPopover>

              <UiDropdown :items="dropdownItems" @select="onSelect">
                <template #trigger>
                  <UiButton variant="secondary">Open action menu</UiButton>
                </template>
              </UiDropdown>

              <UiButton variant="secondary" @click="dialogOpen = true">Open dialog</UiButton>
              <UiButton variant="ghost" @click="drawerOpen = true">Open drawer</UiButton>
              <UiButton variant="secondary" @click="pushToast">Show toast</UiButton>
            </div>

            <UiDialog
              v-model:open="dialogOpen"
              title="Showcase dialog"
              description="Dialog stays focused and returns attention to the trigger."
            >
              <p style="margin: 0;">Dialog content uses the shared overlay runtime.</p>
              <template #footer>
                <UiButton variant="secondary" @click="dialogOpen = false">Cancel</UiButton>
                <UiButton @click="dialogOpen = false">Confirm</UiButton>
              </template>
            </UiDialog>

            <UiDrawer
              v-model:open="drawerOpen"
              title="Showcase drawer"
              description="Drawer shares the same modal stack without introducing a second path."
            >
              <div class="ui-stack">
                <p style="margin: 0;">Drawer content stays lightweight and theme-aware.</p>
                <UiButton variant="secondary" @click="drawerOpen = false">Close drawer</UiButton>
              </div>
            </UiDrawer>

            <UiToast ref="toastRef" />
          </div>
        </UiCard>
      </div>
    `,
  }),
};
