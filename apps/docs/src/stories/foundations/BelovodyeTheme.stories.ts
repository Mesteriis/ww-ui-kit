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
  UiDrawer,
  UiDropdown,
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
  UiSwitch,
  UiSteps,
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
      UiDrawer,
      UiDropdown,
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
      UiSwitch,
      UiSteps,
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
      const inputValue = ref('Belovodye analytics workspace');
      const textareaValue = ref(
        'Cold light surfaces, calm contrast, and restrained river-blue accents.'
      );
      const selectValue = ref('dashboard');
      const richSelectValue = ref<string | null>('bravo');
      const autocompleteValue = ref('');
      const numberValue = ref<number | null>(6.5);
      const checkboxValue = ref(true);
      const switchValue = ref(true);
      const stageValue = ref('review');
      const tabValue = ref('controls');
      const dialogOpen = ref(false);
      const drawerOpen = ref(false);
      const popoverOpen = ref(false);
      const currentPage = ref(2);
      const currentStep = ref(1);
      const selectedMenuKeys = ref(['review']);
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

      const options = [
        { label: 'Dashboard', value: 'dashboard' },
        { label: 'Landing section', value: 'landing' },
        { label: 'Ops console', value: 'ops' },
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
        { initials: 'BV', alt: 'Belovodye', tone: 'brand' as const },
        { initials: 'QA', alt: 'Quality gate', tone: 'success' as const },
        { initials: 'DX', alt: 'Developer experience', tone: 'info' as const },
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

      const steps = [
        { title: 'Design', description: 'Shape the shared contract' },
        { title: 'Review', description: 'Keep the proof surfaces aligned' },
        { title: 'Ship', description: 'Green CI before merge' },
      ];

      const tableColumns = [
        { key: 'surface', header: 'Surface' },
        { key: 'status', header: 'Status', align: 'center' as const },
        { key: 'proof', header: 'Proof' },
      ];

      const tableData = [
        { surface: 'UiAvatar', status: 'Theme-aware', proof: 'Fallback + tone tokens' },
        { surface: 'UiSelect', status: 'Theme-aware', proof: 'Shared floating surface' },
        { surface: 'UiProgress', status: 'Theme-aware', proof: 'Linear and circular tracks' },
      ];

      const currentStepLabel = computed(() => steps[currentStep.value]?.title ?? 'Unknown');

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
        autocompleteItems,
        autocompleteValue,
        avatarItems,
        belovodyeTheme,
        breadcrumbItems,
        checkboxValue,
        currentPage,
        currentStep,
        currentStepLabel,
        dialogOpen,
        dropdownItems,
        drawerOpen,
        inputValue,
        lastDropdownAction,
        menuItems,
        numberValue,
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
        tabValue,
        tableColumns,
        tableData,
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
              <UiField label="Budget">
                <UiNumberInput v-model="numberValue" :min="0" :max="12" :step="0.5" :precision="1" />
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
              <UiAvatar initials="BV" alt="Belovodye avatar" tone="brand" />
              <UiAvatar icon="⚙" alt="Settings avatar" tone="warning" />
              <UiAvatarGroup :items="avatarItems" :max="2" />
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
            <template #header>Steps, menus, and display</template>
            <div class="ui-stack">
              <UiMenu v-model:selected-keys="selectedMenuKeys" :items="menuItems" aria-label="Belovodye menu" />
              <UiSteps v-model="currentStep" :items="steps" clickable linear aria-label="Belovodye release steps" />
              <p style="margin: 0;">Current step: {{ currentStepLabel }}</p>
              <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
                <UiProgress :value="64" show-value />
                <UiProgress variant="circular" :value="82" show-value status="success" />
              </div>
              <UiTable caption="Belovodye review matrix" :columns="tableColumns" :data="tableData" bordered>
                <template #cell="{ column, value }">
                  <strong v-if="column.key === 'surface'">{{ value }}</strong>
                  <UiBadge v-else-if="column.key === 'status'" variant="brand">{{ value }}</UiBadge>
                  <span v-else>{{ value }}</span>
                </template>
              </UiTable>
            </div>
          </UiCard>

          <UiCard>
            <template #header>Tabs, disclosure, and overlays</template>
            <UiTabsRoot v-model="tabValue">
              <UiTabsList>
                <UiTabsTrigger value="controls">Controls</UiTabsTrigger>
                <UiTabsTrigger value="overlay">Overlay</UiTabsTrigger>
                <UiTabsTrigger value="empty">Empty state</UiTabsTrigger>
              </UiTabsList>
              <UiTabsPanel value="controls">
                Buttons, inputs, badges, menus, and steps share the same cold-neutral contrast system.
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
            <UiAlert
              type="warning"
              title="Scoped proof remains synchronized"
              description="The same surface contract stays visible under a subtree theme."
            >
              <template #action>
                <UiButton size="sm" variant="secondary">Review proof</UiButton>
              </template>
            </UiAlert>
          </UiCard>
        </div>

        <UiCard>
          <template #header>Navigation and floating surfaces</template>
          <div class="ui-stack">
            <UiBreadcrumb :items="breadcrumbItems" :max-items="4" />
            <UiPagination
              v-model="currentPage"
              :total-items="96"
              :page-size="12"
              :sibling-count="1"
              :boundary-count="1"
              aria-label="Belovodye release pages"
            />
            <p style="margin: 0;">Current page: {{ currentPage }}</p>
            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <UiTooltip content="Belovodye tooltip surface">
                <UiButton variant="secondary">Hover for tooltip</UiButton>
              </UiTooltip>

              <UiPopover v-model:open="popoverOpen" width="trigger">
                <template #trigger>
                  <UiButton>Open popover</UiButton>
                </template>
                <div class="ui-stack" style="max-width: 16rem;">
                  <p style="margin: 0;">Scoped overlay surfaces inherit Belovodye tokens.</p>
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

            <p style="margin: 0;">Last dropdown action: {{ lastDropdownAction }}</p>

            <UiDialog
              v-model:open="dialogOpen"
              title="Belovodye dialog"
              description="Modal surfaces inherit the scoped theme without a second provider."
            >
              <p style="margin: 0;">Dialog content keeps the same cold-neutral palette.</p>
              <template #footer>
                <UiButton variant="secondary" @click="dialogOpen = false">Cancel</UiButton>
                <UiButton @click="dialogOpen = false">Confirm</UiButton>
              </template>
            </UiDialog>

            <UiDrawer
              v-model:open="drawerOpen"
              title="Belovodye drawer"
              description="Drawer surfaces stay inside the same overlay ownership path."
            >
              <div class="ui-stack">
                <p style="margin: 0;">Drawer content stays aligned with the subtree theme.</p>
                <UiButton variant="secondary" @click="drawerOpen = false">Close drawer</UiButton>
              </div>
            </UiDrawer>

            <UiEmptyState
              title="Belovodye baseline"
              description="Theme-aware proof still avoids product-specific orchestration."
            >
              <template #icon>◇</template>
              <template #actions>
                <UiButton variant="secondary">Read theme ADR</UiButton>
              </template>
            </UiEmptyState>

            <UiToast ref="toastRef" />
          </div>
        </UiCard>
      </section>
    `,
  }),
};
