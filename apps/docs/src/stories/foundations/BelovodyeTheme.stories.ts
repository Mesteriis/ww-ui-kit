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
  UiDialog,
  UiDrawer,
  UiDropdown,
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
  UiPopover,
  UiProgress,
  UiRadio,
  UiRadioGroup,
  UiRangeSlider,
  UiScrollArea,
  UiScrollTop,
  UiSelect,
  UiSelectSimple,
  UiSlider,
  UiSwitch,
  UiSteps,
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
      UiDialog,
      UiDrawer,
      UiDropdown,
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
      UiPopover,
      UiProgress,
      UiRadio,
      UiRadioGroup,
      UiRangeSlider,
      UiScrollArea,
      UiScrollTop,
      UiSelect,
      UiSelectSimple,
      UiSlider,
      UiSwitch,
      UiSteps,
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
      const inputValue = ref('Belovodye analytics workspace');
      const repositoryValue = ref('belovodye/control-room');
      const textareaValue = ref(
        'Dark glass surfaces, cyan-teal accents, and dashboard-grade contrast copied from the canonical frontend.'
      );
      const selectValue = ref('dashboard');
      const richSelectValue = ref<string | null>('bravo');
      const passwordValue = ref('Belovodye-42');
      const passwordVisible = ref(false);
      const tagValues = ref<string[]>(['glass', 'tokens']);
      const otpValue = ref('58');
      const autocompleteValue = ref('');
      const numberValue = ref<number | null>(6.5);
      const sliderValue = ref(70);
      const rangeValue = ref<[number, number]>([25, 85]);
      const checkboxValue = ref(true);
      const switchValue = ref(true);
      const stageValue = ref('review');
      const tabValue = ref('controls');
      const dialogOpen = ref(false);
      const drawerOpen = ref(false);
      const popoverOpen = ref(false);
      const groupedAction = ref('review');
      const currentPage = ref(2);
      const affixState = ref('resting');
      const activeAnchor = ref<string | null>('overview');
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
        { initials: 'BV', alt: 'Belovodye', tone: 'brand' as const },
        { initials: 'QA', alt: 'Quality gate', tone: 'success' as const },
        { initials: 'DX', alt: 'Developer experience', tone: 'info' as const },
      ];
      const displayImageSrc = new URL('../../../assets/img/banner.svg', import.meta.url).href;

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
        { surface: 'UiImage', status: 'Theme-aware', proof: 'Surface and fallback tokens' },
        { surface: 'UiInputPassword', status: 'Theme-aware', proof: 'Field + strength tokens' },
        { surface: 'UiSelect', status: 'Theme-aware', proof: 'Shared floating surface' },
        { surface: 'UiProgress', status: 'Theme-aware', proof: 'Linear and circular tracks' },
      ];

      const layoutItems = [
        {
          key: 'summary',
          title: 'Belovodye summary',
          description:
            'Responsive utility spans inherit the scoped theme without turning into shell structure.',
          span: 12,
          responsive: { md: 7, lg: 8 },
        },
        {
          key: 'actions',
          title: 'Belovodye action rail',
          description:
            'Narrow companion rail shows the same tokenized spacing on the themed surface.',
          span: 12,
          responsive: { md: 5, lg: 4 },
        },
      ];

      const scrollCards = [
        'Belovodye scroll regions inherit the same dark-glass surface language.',
        'Sticky utility notes keep the sanctioned z-layer and focus behavior.',
        'Scroll-top stays opt-in and container-targeted for real consumer flows.',
      ];

      const anchorItems = [
        { key: 'overview', label: 'Overview', href: '#belovodye-anchor-overview' },
        { key: 'contracts', label: 'Contracts', href: '#belovodye-anchor-contracts' },
        { key: 'ship', label: 'Ship', href: '#belovodye-anchor-ship' },
      ];

      const anchorSections = [
        {
          id: 'belovodye-anchor-overview',
          title: 'Overview',
          copy: 'Anchor navigation remains theme-aware without a second runtime.',
        },
        {
          id: 'belovodye-anchor-contracts',
          title: 'Contracts',
          copy: 'Active sections update against the same scoped scroll container.',
        },
        {
          id: 'belovodye-anchor-ship',
          title: 'Ship',
          copy: 'Smooth scrolling keeps the dark Belovodye contract intact.',
        },
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
        activeAnchor,
        affixState,
        anchorItems,
        anchorSections,
        avatarItems,
        belovodyeTheme,
        breadcrumbItems,
        checkboxValue,
        currentPage,
        currentStep,
        currentStepLabel,
        displayImageSrc,
        dialogOpen,
        dropdownItems,
        drawerOpen,
        groupedAction,
        inputValue,
        layoutItems,
        lastDropdownAction,
        menuItems,
        numberValue,
        onSelect,
        options,
        otpValue,
        passwordRules,
        passwordValue,
        passwordVisible,
        popoverOpen,
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
        tabValue,
        tableColumns,
        tableData,
        tagValues,
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
            radial-gradient(circle at 62% -4%, rgba(46, 157, 168, 0.14), transparent 30%),
            radial-gradient(circle at 18% 10%, rgba(26, 140, 131, 0.22), transparent 38%),
            radial-gradient(circle at 82% 84%, rgba(18, 96, 98, 0.2), transparent 42%),
            linear-gradient(168deg, #02060d 0%, #05131c 40%, #062118 74%, #030c14 100%);
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

            <div style="display: grid; gap: var(--ui-space-3);">
              <UiButtonGroup aria-label="Belovodye action group">
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
              <p style="margin: 0; color: var(--ui-text-secondary);">
                Button group action: {{ groupedAction }}
              </p>
            </div>

            <div style="display: grid; gap: var(--ui-space-4);">
              <UiFlex justify="between" align="center" gap="4" block>
                <UiBadge variant="brand">Belovodye utility layout</UiBadge>
                <UiSpace size="2">
                  <UiButton size="sm" variant="secondary">Preview</UiButton>
                  <UiButton size="sm">Ship</UiButton>
                </UiSpace>
              </UiFlex>

              <UiSpace separator="•" size="3" role="group" aria-label="Belovodye utility markers">
                <UiTag variant="brand">UiFlex</UiTag>
                <UiTag variant="success" appearance="outline">UiGrid</UiTag>
                <UiTag variant="warning" appearance="outline">UiSpace</UiTag>
              </UiSpace>

              <UiGrid
                :items="layoutItems"
                :columns="12"
                gap="4"
                role="group"
                aria-label="Belovodye layout grid"
              >
                <template #item="{ item }">
                  <UiCard>
                    <template #header>{{ item.title }}</template>
                    <p style="margin: 0;">{{ item.description }}</p>
                  </UiCard>
                </template>
              </UiGrid>

              <UiScrollArea
                id="belovodye-scroll-area"
                :max-height="240"
                aria-label="Belovodye layout utility scroll area"
              >
                <div class="ui-stack" style="padding-inline-end: var(--ui-space-2);">
                  <UiAffix
                    :offset-top="0"
                    target="#belovodye-scroll-area"
                    @stuck-change="affixState = $event ? 'stuck' : 'resting'"
                  >
                    <UiCard>
                      <template #header>Affixed Belovodye note</template>
                      <p style="margin: 0;">
                        Sticky utility content inherits the themed surface without leaving core.
                      </p>
                    </UiCard>
                  </UiAffix>

                  <UiCard v-for="(copy, index) in scrollCards" :key="index">
                    <template #header>Belovodye scroll proof {{ index + 1 }}</template>
                    <p style="margin: 0;">{{ copy }}</p>
                  </UiCard>
                </div>
              </UiScrollArea>

              <p style="margin: 0; color: var(--ui-text-secondary);">
                Affix state: {{ affixState }}
              </p>
              <UiScrollTop
                target="#belovodye-scroll-area"
                :threshold="72"
                behavior="auto"
                aria-label="Scroll Belovodye utility area to top"
              >
                Top
              </UiScrollTop>
            </div>

            <div style="display: grid; gap: var(--ui-space-4); grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));">
              <UiField label="Workspace" hint="Field surfaces stay crisp in Belovodye">
                <UiInput v-model="inputValue" />
              </UiField>
              <UiField label="Scoped repository">
                <UiInputGroup>
                  <template #prepend>https://</template>
                  <UiInput v-model="repositoryValue" />
                  <template #append>.git</template>
                </UiInputGroup>
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
              <UiField label="Password">
                <UiInputPassword
                  v-model="passwordValue"
                  v-model:revealed="passwordVisible"
                  :strength="78"
                  strength-text="Strong"
                  :rules="passwordRules"
                />
              </UiField>
              <UiField label="Surface tags">
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

            <div style="display: flex; gap: var(--ui-space-4); flex-wrap: wrap;">
              <UiCheckbox v-model="checkboxValue">Pinned filters</UiCheckbox>
              <UiSwitch v-model="switchValue" ariaLabel="Enable scoped preview">
                Scoped preview
              </UiSwitch>
            </div>

              <UiField label="Release stage" hint="Selection surfaces keep the same dark glass rhythm">
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
            <UiImage
              :src="displayImageSrc"
              alt="Belovodye architecture snapshot"
              caption="Themed image surface"
              aspect="landscape"
              bordered
            />
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
                Buttons, inputs, badges, menus, and steps share the same dark dashboard contrast system.
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
                target="#belovodye-anchor-scroll"
                :offset-top="12"
                aria-label="Belovodye section anchor"
              />

              <UiScrollArea
                id="belovodye-anchor-scroll"
                :max-height="220"
                aria-label="Belovodye anchor sections"
              >
                <div class="ui-stack" style="padding-inline-end: var(--ui-space-2);">
                  <section
                    v-for="section in anchorSections"
                    :id="section.id"
                    :key="section.id"
                    style="
                      min-block-size: 11rem;
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
              <p style="margin: 0;">Dialog content keeps the same dark Belovodye palette.</p>
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
