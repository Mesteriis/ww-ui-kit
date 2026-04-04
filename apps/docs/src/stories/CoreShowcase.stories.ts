import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, ref } from 'vue';

import {
  UiAffix,
  UiAlert,
  UiAnchor,
  UiAutocomplete,
  UiAvatar,
  UiAvatarGroup,
  UiBadge,
  UiBreadcrumb,
  UiButton,
  UiButtonGroup,
  UiCard,
  UiCheckbox,
  UiCollapse,
  UiCollapsePanel,
  UiContextMenu,
  UiDialog,
  UiDivider,
  UiDropdown,
  UiDrawer,
  UiEmptyState,
  UiField,
  UiFlex,
  UiIconButton,
  UiImage,
  UiInput,
  UiInputGroup,
  UiInputOtp,
  UiInputPassword,
  UiInputTag,
  UiGrid,
  UiMenu,
  UiNumberInput,
  UiPagination,
  UiPopconfirm,
  UiPopover,
  UiProgress,
  UiRadio,
  UiRadioGroup,
  UiRangeSlider,
  UiScrollArea,
  UiScrollTop,
  UiSelect,
  UiSelectSimple,
  UiSkeleton,
  UiSlider,
  UiSpinner,
  UiSteps,
  UiSwitch,
  UiSpace,
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
      UiAffix,
      UiAnchor,
      UiAutocomplete,
      UiAvatar,
      UiAvatarGroup,
      UiBadge,
      UiBreadcrumb,
      UiButton,
      UiButtonGroup,
      UiCard,
      UiCheckbox,
      UiCollapse,
      UiCollapsePanel,
      UiContextMenu,
      UiDialog,
      UiDivider,
      UiDropdown,
      UiDrawer,
      UiEmptyState,
      UiField,
      UiFlex,
      UiIconButton,
      UiImage,
      UiInput,
      UiInputGroup,
      UiInputOtp,
      UiInputPassword,
      UiInputTag,
      UiGrid,
      UiMenu,
      UiNumberInput,
      UiPagination,
      UiPopconfirm,
      UiPopover,
      UiProgress,
      UiRadio,
      UiRadioGroup,
      UiRangeSlider,
      UiScrollArea,
      UiScrollTop,
      UiSelect,
      UiSelectSimple,
      UiSkeleton,
      UiSlider,
      UiSpinner,
      UiSteps,
      UiSwitch,
      UiSpace,
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
      const repositoryValue = ref('governance/core-wave');
      const textareaValue = ref(
        'Stories remain the visual source of truth for the baseline layer.'
      );
      const selectValue = ref('core');
      const richSelectValue = ref<string | null>('bravo');
      const passwordValue = ref('Belovodye-42');
      const passwordVisible = ref(false);
      const tagValues = ref<string[]>(['tokens', 'core']);
      const otpValue = ref('7314');
      const autocompleteValue = ref('');
      const numberValue = ref<number | null>(8.5);
      const sliderValue = ref(60);
      const rangeValue = ref<[number, number]>([20, 80]);
      const checkboxValue = ref(true);
      const switchValue = ref(false);
      const stageValue = ref('review');
      const tabsValue = ref('controls');
      const dialogOpen = ref(false);
      const drawerOpen = ref(false);
      const contextMenuAction = ref('review');
      const popoverOpen = ref(false);
      const popconfirmOutcome = ref('waiting');
      const currentPage = ref(2);
      const affixState = ref('resting');
      const activeAnchor = ref<string | null>('overview');
      const groupedAction = ref('review');
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
      const contextMenuItems = [
        { label: 'Inspect release', value: 'inspect' },
        { label: 'Archive release', value: 'archive' },
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

      const sliderMarks = [
        { value: 0, label: '0%' },
        { value: 50, label: '50%' },
        { value: 100, label: '100%' },
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
      const passwordRules = [
        { label: 'At least 12 characters', met: true },
        { label: 'Contains a number', met: true },
      ];

      const avatarItems = [
        { initials: 'BV', alt: 'Belovodye' },
        { initials: 'CR', alt: 'Core review', tone: 'brand' as const },
        { initials: 'QA', alt: 'Quality gate', tone: 'success' as const },
      ];
      const displayImageSrc = new URL('../../../assets/img/banner.svg', import.meta.url).href;

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
        { surface: 'UiInputPassword', status: 'Shipped', proof: 'Visibility + strength + rules' },
        { surface: 'UiSelect', status: 'Shipped', proof: 'Storybook + harness' },
        { surface: 'UiMenu', status: 'Shipped', proof: 'Keyboard + a11y checks' },
        { surface: 'UiImage', status: 'Shipped', proof: 'Fit + fallback + caption' },
        { surface: 'UiTable', status: 'Shipped', proof: 'Semantic table + unit slots' },
      ];

      const layoutItems = [
        {
          key: 'summary',
          title: 'Release summary',
          description: 'Responsive spans stay utility-only and do not become page-shell ownership.',
          span: 12,
          responsive: { md: 7, lg: 8 },
        },
        {
          key: 'actions',
          title: 'Action rail',
          description: 'Secondary action rail stays narrow beside the wider evidence block.',
          span: 12,
          responsive: { md: 5, lg: 4 },
        },
      ];

      const scrollCards = [
        'Sticky utility content stays inside the governed scroll region.',
        'Scroll areas keep region semantics and tokenized scrollbar styling.',
        'Scroll-top targets the same viewport without dragging shell behavior into core.',
      ];

      const anchorItems = [
        { key: 'overview', label: 'Overview', href: '#showcase-anchor-overview' },
        { key: 'contracts', label: 'Contracts', href: '#showcase-anchor-contracts' },
        { key: 'ship', label: 'Ship', href: '#showcase-anchor-ship' },
      ];

      const anchorSections = [
        {
          id: 'showcase-anchor-overview',
          title: 'Overview',
          copy: 'Section navigation stays reusable and scroll-container aware.',
        },
        {
          id: 'showcase-anchor-contracts',
          title: 'Contracts',
          copy: 'Active-link tracking stays in the public surface instead of app-local helpers.',
        },
        {
          id: 'showcase-anchor-ship',
          title: 'Ship',
          copy: 'Smooth scrolling stays opt-in and predictable for downstream consumers.',
        },
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

      const onContextMenuSelect = (payload: { label: string }) => {
        contextMenuAction.value = payload.label;
      };

      const onPopconfirmCancel = () => {
        popconfirmOutcome.value = 'canceled';
      };

      const onPopconfirmConfirm = () => {
        popconfirmOutcome.value = 'confirmed';
      };

      const onMenuSelect = (payload: { key: string }) => {
        selectedMenuKeys.value = [payload.key];
      };

      return {
        autocompleteItems,
        autocompleteValue,
        activeAnchor,
        affixState,
        anchorItems,
        anchorSections,
        avatarItems,
        breadcrumbItems,
        checkboxValue,
        contextMenuAction,
        contextMenuItems,
        currentPage,
        currentStep,
        currentStepLabel,
        displayImageSrc,
        dialogOpen,
        dropdownItems,
        drawerOpen,
        groupedAction,
        inputValue,
        lastMenuSelection,
        layoutItems,
        menuItems,
        numberValue,
        onContextMenuSelect,
        onMenuSelect,
        onPopconfirmCancel,
        onPopconfirmConfirm,
        onSelect,
        options,
        otpValue,
        passwordRules,
        passwordValue,
        passwordVisible,
        popoverOpen,
        popconfirmOutcome,
        pushToast,
        rangeValue,
        repositoryValue,
        richOptions,
        richSelectValue,
        scrollCards,
        selectValue,
        selectedMenuKeys,
        sliderMarks,
        sliderValue,
        stageValue,
        steps,
        switchValue,
        tableColumns,
        tableData,
        tagValues,
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
            <UiButtonGroup aria-label="Showcase action group">
              <UiButton
                :variant="groupedAction === 'review' ? 'primary' : 'secondary'"
                @click="groupedAction = 'review'"
              >
                Review
              </UiButton>
              <UiButton
                :variant="groupedAction === 'ship' ? 'primary' : 'secondary'"
                @click="groupedAction = 'ship'"
              >
                Ship
              </UiButton>
              <UiButton
                :variant="groupedAction === 'rollback' ? 'danger' : 'secondary'"
                @click="groupedAction = 'rollback'"
              >
                Rollback
              </UiButton>
            </UiButtonGroup>
            <p style="margin: 0;">Button group action: {{ groupedAction }}</p>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Layout utilities</template>
          <div class="ui-stack">
            <UiFlex justify="between" align="center" gap="4" block>
              <UiBadge variant="brand">Utility-only layout</UiBadge>
              <UiSpace size="2">
                <UiButton size="sm" variant="secondary">Preview</UiButton>
                <UiButton size="sm">Ship</UiButton>
              </UiSpace>
            </UiFlex>

            <UiSpace separator="•" size="3" role="group" aria-label="Layout utility markers">
              <UiTag variant="brand">UiFlex</UiTag>
              <UiTag variant="success" appearance="outline">UiGrid</UiTag>
              <UiTag variant="warning" appearance="outline">UiSpace</UiTag>
            </UiSpace>

            <UiGrid
              :items="layoutItems"
              :columns="12"
              gap="4"
              role="group"
              aria-label="Showcase layout grid"
            >
              <template #item="{ item }">
                <UiCard>
                  <template #header>{{ item.title }}</template>
                  <p style="margin: 0;">{{ item.description }}</p>
                </UiCard>
              </template>
            </UiGrid>

            <UiScrollArea
              id="showcase-scroll-area"
              :max-height="240"
              aria-label="Showcase layout utility scroll area"
            >
              <div class="ui-stack" style="padding-inline-end: var(--ui-space-2);">
                <UiAffix
                  :offset-top="0"
                  target="#showcase-scroll-area"
                  @stuck-change="affixState = $event ? 'stuck' : 'resting'"
                >
                  <UiCard>
                    <template #header>Affixed utility note</template>
                    <p style="margin: 0;">
                      Scroll helpers stay in core without becoming page-template shell logic.
                    </p>
                  </UiCard>
                </UiAffix>

                <UiCard v-for="(copy, index) in scrollCards" :key="index">
                  <template #header>Scroll utility {{ index + 1 }}</template>
                  <p style="margin: 0;">{{ copy }}</p>
                </UiCard>
              </div>
            </UiScrollArea>

            <p style="margin: 0;">Affix state: {{ affixState }}</p>
            <UiScrollTop
              target="#showcase-scroll-area"
              :threshold="72"
              behavior="auto"
              aria-label="Scroll showcase utility area to top"
            >
              Top
            </UiScrollTop>
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
            <UiField label="Repository URL" hint="Input groups keep addons in the same contract">
              <UiInputGroup>
                <template #prepend>https://</template>
                <UiInput v-model="repositoryValue" />
                <template #append>.git</template>
              </UiInputGroup>
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
            <UiField label="Password">
              <UiInputPassword
                v-model="passwordValue"
                v-model:revealed="passwordVisible"
                :strength="72"
                strength-text="Strong"
                :rules="passwordRules"
              />
            </UiField>
            <UiField label="Release tags">
              <UiInputTag v-model="tagValues" />
            </UiField>
            <UiField label="Verification code">
              <UiInputOtp v-model="otpValue" :length="4" />
            </UiField>
            <UiField label="Command search">
              <UiAutocomplete v-model="autocompleteValue" :items="autocompleteItems" />
            </UiField>
            <UiField label="Rollout target">
              <UiSlider
                v-model="sliderValue"
                :min="0"
                :max="100"
                :step="5"
                :marks="sliderMarks"
                show-input
              />
            </UiField>
            <UiField label="Deploy window">
              <UiRangeSlider
                v-model="rangeValue"
                :min="0"
                :max="100"
                :step="5"
                :min-range="10"
                :marks="sliderMarks"
              />
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
            <UiImage
              :src="displayImageSrc"
              alt="Architecture snapshot"
              caption="Architecture snapshot"
              aspect="landscape"
              bordered
            />
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
                    Tooltip, popover, dropdown, popconfirm, context menu, dialog, drawer, and toast all share a single runtime.
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

            <div
              style="
                display: grid;
                gap: var(--ui-space-4);
                grid-template-columns: minmax(0, 12rem) minmax(0, 1fr);
                align-items: start;
              "
            >
              <UiAnchor
                v-model="activeAnchor"
                :items="anchorItems"
                target="#showcase-anchor-scroll"
                :offset-top="12"
                aria-label="Showcase section anchor"
              />

              <UiScrollArea
                id="showcase-anchor-scroll"
                :max-height="240"
                aria-label="Showcase anchor sections"
              >
                <div class="ui-stack" style="padding-inline-end: var(--ui-space-2);">
                  <section
                    v-for="section in anchorSections"
                    :id="section.id"
                    :key="section.id"
                    style="
                      min-block-size: 12rem;
                      padding: var(--ui-space-4);
                      border: 1px solid var(--ui-border-subtle);
                      border-radius: var(--ui-radius-lg);
                      background: var(--ui-surface-subtle);
                    "
                  >
                    <h3 style="margin-top: 0;">{{ section.title }}</h3>
                    <p style="margin: 0;">{{ section.copy }}</p>
                  </section>
                </div>
              </UiScrollArea>
            </div>

            <p style="margin: 0;">Active anchor: {{ activeAnchor }}</p>

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

              <UiPopconfirm
                title="Delete release?"
                description="This action removes the staged release candidate."
                confirm-text="Delete"
                cancel-text="Keep"
                confirm-variant="danger"
                @cancel="onPopconfirmCancel"
                @confirm="onPopconfirmConfirm"
              >
                <template #trigger>
                  <UiButton variant="danger">Delete release</UiButton>
                </template>
              </UiPopconfirm>

              <UiContextMenu :items="contextMenuItems" @select="onContextMenuSelect">
                <template #trigger>
                  <UiButton variant="secondary">Right-click release tools</UiButton>
                </template>
              </UiContextMenu>

              <UiButton variant="secondary" @click="dialogOpen = true">Open dialog</UiButton>
              <UiButton variant="ghost" @click="drawerOpen = true">Open drawer</UiButton>
              <UiButton variant="secondary" @click="pushToast">Show toast</UiButton>
            </div>

            <p style="margin: 0;">Popconfirm outcome: {{ popconfirmOutcome }}</p>
            <p style="margin: 0;">Context menu action: {{ contextMenuAction }}</p>

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
