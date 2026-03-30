<script setup lang="ts">
import { defineAsyncComponent, nextTick, ref, watch } from 'vue';

import { UiApexChart, type UiApexChartOptions, type UiApexChartSeries } from '@ww/charts-apex';
import {
  UiAlert,
  UiBadge,
  UiBreadcrumb,
  UiButton,
  UiCard,
  UiCollapse,
  UiCollapsePanel,
  UiDropdown,
  UiDialog,
  UiDrawer,
  UiField,
  UiInput,
  UiPagination,
  UiPopover,
  UiRadio,
  UiRadioGroup,
  UiSwitch,
  UiTag,
  UiTabsList,
  UiTabsPanel,
  UiTabsRoot,
  UiTabsTrigger,
  UiToast,
  UiTooltip,
} from '@ww/core';
import {
  MOTION_PRESET_NAMES,
  MOTION_PRESETS,
  MOTION_TAXONOMY,
  afterCollapseMotion,
  applyTransitionMotionVariables,
  beforeCollapseMotion,
  clearTransitionMotionVariables,
  readOverlayLayerScale,
  resolveOverlayLayerSlots,
  resolveTransitionMotionPreset,
  runCollapseMotion,
} from '@ww/primitives';
import {
  THEME_CAPABILITY_MATRIX,
  THEME_DENSITIES,
  THEME_MOTION_PROFILES,
  THEME_PERSONALITIES,
  getThemeMeta,
  patchThemeRuntime,
  readThemeRuntime,
  type ThemeMeta,
  type ThemeRuntimeState,
} from '@ww/themes';

import { PLAYGROUND_SCENARIOS } from '../scenarios';
import { buildPlaygroundPath } from '../../shared/navigation/playground-route';

const DataGridShowcase = defineAsyncComponent(() => import('../../DataGridShowcase.vue'));
const DataTableWidgetShowcase = defineAsyncComponent(
  () => import('../../DataTableWidgetShowcase.vue')
);
const LayerScaffoldShowcase = defineAsyncComponent(() => import('../../LayerScaffoldShowcase.vue'));
const SignalGraphShowcase = defineAsyncComponent(() => import('../../SignalGraphShowcase.vue'));

defineOptions({ name: 'TestingHarnessView' });

const props = defineProps<{
  themeMeta: ThemeMeta;
  themeRuntime: ThemeRuntimeState;
}>();

const dialogOpen = ref(false);
const drawerOpen = ref(false);
const nestedDialogOpen = ref(false);
const scopedDialogOpen = ref(false);
const scopedDrawerOpen = ref(false);
const explicitDrawerOpen = ref(false);
const floatingPopoverOpen = ref(false);
const floatingMenuSelection = ref('Review queue');
const toastHostRef = ref<{
  clear: () => void;
  dismiss: (id: string) => void;
  push: (payload: {
    title: string;
    description?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
  }) => string;
} | null>(null);
const releaseStage = ref('design');
const releaseFlowPage = ref(2);
const releaseAlertOpen = ref(true);
const activeTag = ref('Pinned');
const releaseFlowPanels = ref<string[]>(['queue']);
const motionPreset = ref<(typeof MOTION_PRESET_NAMES)[number]>('modal-fade-scale');
const motionVisible = ref(true);
const collapseOpen = ref(true);
const explicitPortalTarget = ref<HTMLElement | null>(null);
const scopedThemeHost = ref<HTMLElement | null>(null);
const scopedThemeInputValue = ref('Scoped Belovodye surface');
const scopedThemeDensity = ref<(typeof THEME_DENSITIES)[number]>('default');
const scopedThemeMotionProfile = ref<(typeof THEME_MOTION_PROFILES)[number]>('balanced');
const scopedThemePersonality = ref<(typeof THEME_PERSONALITIES)[number]>('neutral');
const scopedThemeRuntime = ref<ThemeRuntimeState | null>(null);
const scopedThemeSwitchValue = ref(true);
const scopedThemeTabValue = ref('surface');
const tabValue = ref('overview');

const utilityRows = [
  { label: 'Lift + focus ring', motion: 'lift-xs ring-focus-soft', badge: 'brand' as const },
  {
    label: 'Underline slide',
    motion: 'underline-slide ring-focus-soft',
    badge: 'warning' as const,
  },
  { label: 'Glow accent', motion: 'glow-accent', badge: 'danger' as const },
  { label: 'Loading shimmer', motion: 'loading-shimmer', badge: 'success' as const },
];

const floatingDropdownItems = [
  { label: 'Review queue', value: 'Review queue' },
  { label: 'Escalate', value: 'Escalate' },
  { type: 'divider' as const },
  {
    type: 'group' as const,
    label: 'Deploy',
    items: [
      { label: 'Bravo', value: 'Bravo' },
      { label: 'Charlie', value: 'Charlie' },
    ],
  },
];

const releaseBreadcrumbItems = [
  { label: 'Workspace', href: '#workspace' },
  { label: 'Releases', href: '#releases' },
  { label: 'Wave one', href: '#wave-one' },
  { label: 'Approve', current: true },
];

const chartCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const lineChartSeries: UiApexChartSeries = [
  {
    name: 'Traffic',
    data: [128, 164, 152, 186, 210, 228],
  },
];
const areaChartSeries: UiApexChartSeries = [
  {
    name: 'Conversion',
    data: [22, 26, 28, 32, 35, 39],
  },
];
const barChartSeries: UiApexChartSeries = [
  {
    name: 'Pipeline',
    data: [38, 51, 47, 63],
  },
];
const donutChartSeries: UiApexChartSeries = [42, 28, 18, 12];

const lineChartOptions: UiApexChartOptions = {
  xaxis: {
    categories: chartCategories,
  },
};
const areaChartOptions: UiApexChartOptions = {
  xaxis: {
    categories: chartCategories,
  },
};
const barChartOptions: UiApexChartOptions = {
  xaxis: {
    categories: ['North', 'South', 'East', 'West'],
  },
};
const donutChartOptions: UiApexChartOptions = {
  labels: ['Core', 'Docs', 'Playground', 'Adapters'],
};

const scopedTheme = getThemeMeta('belovodye');
const taxonomyEntries = Object.entries(MOTION_TAXONOMY);
const capabilityMatrixEntries = [
  ['Foundations', THEME_CAPABILITY_MATRIX.foundations],
  ['Component styles', THEME_CAPABILITY_MATRIX.componentStyles],
  ['Systems', THEME_CAPABILITY_MATRIX.systems],
  ['Density', THEME_CAPABILITY_MATRIX.density],
  ['Typography', THEME_CAPABILITY_MATRIX.typography],
  ['Motion', THEME_CAPABILITY_MATRIX.motion],
  ['Personality', THEME_CAPABILITY_MATRIX.personality],
  ['Responsive', THEME_CAPABILITY_MATRIX.responsive.tokens],
] as const;

const syncScopedThemeRuntime = () => {
  if (!scopedThemeHost.value) {
    return;
  }

  patchThemeRuntime(
    {
      density: scopedThemeDensity.value,
      motionProfile: scopedThemeMotionProfile.value,
      personality: scopedThemePersonality.value,
      themeName: scopedTheme.name,
    },
    scopedThemeHost.value
  );
  scopedThemeRuntime.value = readThemeRuntime(scopedThemeHost.value);
};

watch(scopedThemeHost, syncScopedThemeRuntime, { flush: 'post' });
watch(
  [scopedThemeDensity, scopedThemeMotionProfile, scopedThemePersonality],
  syncScopedThemeRuntime
);

const onFloatingMenuSelect = (payload: { label: string }) => {
  floatingMenuSelection.value = payload.label;
};

const pushHarnessToast = (type: 'success' | 'warning' | 'error') => {
  toastHostRef.value?.push({
    title:
      type === 'success'
        ? 'Release checklist synced'
        : type === 'warning'
          ? 'Manual review required'
          : 'Toast stack reached failure state',
    description:
      type === 'success'
        ? 'Toast surfaces share the same overlay runtime and stack limits.'
        : type === 'warning'
          ? 'Pause on hover and dismiss controls stay inside the single canonical toast runtime.'
          : 'Error toasts switch to assertive live-region semantics.',
    type,
  });
};

const clearHarnessToasts = () => {
  toastHostRef.value?.clear();
};

const pushHarnessToastStack = () => {
  pushHarnessToast('success');
  pushHarnessToast('warning');
};

const replayMotion = async () => {
  motionVisible.value = false;
  await nextTick();
  motionVisible.value = true;
};

const applyPreset = (element: Element, phase: 'enter' | 'leave') => {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  applyTransitionMotionVariables(
    element,
    resolveTransitionMotionPreset(motionPreset.value, 'fade-in'),
    phase
  );
};

const clearPreset = (element: Element) => {
  if (element instanceof HTMLElement) {
    clearTransitionMotionVariables(element);
  }
};

const beforeMotionEnter = (element: Element) => applyPreset(element, 'enter');
const beforeMotionLeave = (element: Element) => applyPreset(element, 'leave');

const beforeCollapseEnter = (element: Element) => {
  if (element instanceof HTMLElement) {
    beforeCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' });
  }
};

const enterCollapse = (element: Element, done: () => void) => {
  if (element instanceof HTMLElement) {
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
  }
};

const beforeCollapseLeave = (element: Element) => {
  if (element instanceof HTMLElement) {
    beforeCollapseMotion(element, { phase: 'leave', preset: 'collapse-y-soft' });
  }
};

const leaveCollapse = (element: Element, done: () => void) => {
  if (element instanceof HTMLElement) {
    runCollapseMotion(element, { phase: 'leave', preset: 'collapse-y-soft' }, done);
  }
};

const afterCollapse = (element: Element) => {
  if (element instanceof HTMLElement) {
    afterCollapseMotion(element);
  }
};

const layerScale = readOverlayLayerScale();
const firstModalLayers = resolveOverlayLayerSlots(0, 'modal');
const secondModalLayers = resolveOverlayLayerSlots(1, 'modal');
const floatingLayers = resolveOverlayLayerSlots(0, 'floating');
</script>

<template>
  <main class="testing-harness" data-playground-mode="testing">
    <header class="playground__hero">
      <div>
        <p class="playground__eyebrow">Playground testing harness</p>
        <h1>
          Stable integration routes remain the consumer-proof harness while the new lab lives beside
          them.
        </h1>
        <p class="playground__hero-copy">
          Storybook stays the public state source of truth. This route keeps the composed browser
          harness stable for themes, overlays, systems, widgets, and page templates.
        </p>
      </div>
      <div class="playground__theme-indicator">
        <UiBadge variant="brand">{{ props.themeMeta.label }}</UiBadge>
        <UiBadge>ThemeName: {{ props.themeMeta.name }}</UiBadge>
        <UiBadge>ThemeType: {{ props.themeMeta.type }}</UiBadge>
      </div>
    </header>

    <nav class="playground__scenario-nav" aria-label="Playground test harness sections">
      <a
        v-for="scenario in PLAYGROUND_SCENARIOS"
        :key="scenario.id"
        class="playground__scenario-link"
        :href="`${buildPlaygroundPath({ mode: 'testing' })}${scenario.hash}`"
      >
        <strong>{{ scenario.label }}</strong>
        <span>{{ scenario.description }}</span>
      </a>
    </nav>

    <section
      id="testing-overlays"
      class="playground__foundation-grid"
      data-playground-scenario="overlays"
    >
      <UiCard>
        <template #header>Motion preset lab</template>
        <div class="ui-stack">
          <div class="ui-cluster">
            <select v-model="motionPreset" class="ui-input ui-select__control playground__select">
              <option v-for="name in MOTION_PRESET_NAMES" :key="name" :value="name">
                {{ name }}
              </option>
            </select>
            <UiButton variant="secondary" @click="replayMotion">Replay preset</UiButton>
          </div>

          <div class="playground__motion-stage">
            <Transition
              name="ui-motion"
              @before-enter="beforeMotionEnter"
              @after-enter="clearPreset"
              @before-leave="beforeMotionLeave"
              @after-leave="clearPreset"
            >
              <div v-if="motionVisible" class="playground__motion-surface">
                <UiBadge variant="brand">{{ motionPreset }}</UiBadge>
                <p>{{ MOTION_PRESETS[motionPreset].useCases[0] }}</p>
              </div>
            </Transition>
          </div>

          <div class="ui-cluster">
            <UiBadge variant="brand">base {{ layerScale.base }}</UiBadge>
            <UiBadge variant="warning">step {{ layerScale.step }}</UiBadge>
            <UiBadge variant="success">surface {{ layerScale.surface }}</UiBadge>
            <UiBadge variant="danger">toast {{ layerScale.toast }}</UiBadge>
          </div>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Collapse and utility motions</template>
        <div class="ui-stack">
          <UiButton variant="secondary" @click="collapseOpen = !collapseOpen">
            {{ collapseOpen ? 'Collapse block' : 'Expand block' }}
          </UiButton>
          <Transition
            @before-enter="beforeCollapseEnter"
            @enter="enterCollapse"
            @after-enter="afterCollapse"
            @before-leave="beforeCollapseLeave"
            @leave="leaveCollapse"
            @after-leave="afterCollapse"
          >
            <div v-if="collapseOpen" class="playground__collapse-panel">
              Collapse runtime is shared by future disclosure, accordion, and hero compositions.
            </div>
          </Transition>

          <div class="playground__utility-grid">
            <div v-for="item in utilityRows" :key="item.motion" class="playground__utility-card">
              <UiBadge :variant="item.badge">{{ item.motion }}</UiBadge>
              <button type="button" :data-ui-motion="item.motion" class="playground__utility-demo">
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Overlay layers</template>
        <div class="playground__layer-demo">
          <div
            class="playground__layer-chip"
            :style="{ zIndex: String(firstModalLayers.backdrop) }"
          >
            backdrop {{ firstModalLayers.backdrop }}
          </div>
          <div
            class="playground__layer-chip playground__layer-chip--raised"
            :style="{ zIndex: String(firstModalLayers.content) }"
          >
            modal {{ firstModalLayers.content }}
          </div>
          <div
            class="playground__layer-chip playground__layer-chip--accent"
            :style="{ zIndex: String(floatingLayers.content) }"
          >
            floating {{ floatingLayers.content }}
          </div>
          <div
            class="playground__layer-chip playground__layer-chip--danger"
            :style="{ zIndex: String(secondModalLayers.content) }"
          >
            nested {{ secondModalLayers.content }}
          </div>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Preset taxonomy</template>
        <div class="playground__taxonomy">
          <div
            v-for="[group, names] in taxonomyEntries"
            :key="group"
            class="playground__taxonomy-group"
          >
            <UiBadge variant="brand">{{ group }}</UiBadge>
            <div class="ui-cluster">
              <code v-for="name in names" :key="name">{{ name }}</code>
            </div>
          </div>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Floating overlays and toast runtime</template>
        <div class="ui-stack">
          <div class="ui-cluster">
            <UiTooltip content="Tooltip surfaces stay on the sanctioned tooltip layer.">
              <UiButton variant="secondary">Hover for tooltip</UiButton>
            </UiTooltip>

            <UiPopover v-model:open="floatingPopoverOpen" width="trigger">
              <template #trigger>
                <UiButton>Open popover</UiButton>
              </template>
              <div class="ui-stack" style="max-width: 16rem">
                <p style="margin: 0">Escape closes the popover and returns focus to the trigger.</p>
                <UiButton size="sm" variant="secondary" @click="floatingPopoverOpen = false">
                  Close popover
                </UiButton>
              </div>
            </UiPopover>

            <UiDropdown :items="floatingDropdownItems" @select="onFloatingMenuSelect">
              <template #trigger>
                <UiButton variant="secondary">Open action menu</UiButton>
              </template>
            </UiDropdown>
          </div>

          <p style="margin: 0">Last menu action: {{ floatingMenuSelection }}</p>

          <div class="ui-cluster">
            <UiButton variant="secondary" @click="pushHarnessToast('success')">
              Show success toast
            </UiButton>
            <UiButton tone="warning" appearance="outline" @click="pushHarnessToast('warning')">
              Show warning toast
            </UiButton>
            <UiButton variant="secondary" @click="pushHarnessToastStack">Show toast stack</UiButton>
            <UiButton variant="ghost" @click="clearHarnessToasts">Clear toasts</UiButton>
          </div>

          <UiToast ref="toastHostRef" :duration="10000" :max-stack="3" position="bottom-end" />
        </div>
      </UiCard>
    </section>

    <section id="testing-core-wave" class="playground__grid" data-playground-scenario="core-wave">
      <UiCard>
        <template #header>Selection and disclosure contracts</template>
        <div class="ui-stack">
          <UiField label="Release stage" hint="Arrow keys move the active radio">
            <UiRadioGroup v-model="releaseStage" orientation="horizontal">
              <UiRadio value="design">Design</UiRadio>
              <UiRadio value="review">Review</UiRadio>
              <UiRadio value="ship">Ship</UiRadio>
            </UiRadioGroup>
          </UiField>

          <p style="margin: 0">Selected stage: {{ releaseStage }}</p>

          <UiCollapse v-model="releaseFlowPanels" accordion>
            <UiCollapsePanel value="queue" title="Queue details">
              Review notes, blockers, and next actions stay inside the shared disclosure runtime.
            </UiCollapsePanel>
            <UiCollapsePanel value="audit" title="Audit trail">
              Checks, sign-offs, and rollback notes stay discoverable through region semantics.
            </UiCollapsePanel>
          </UiCollapse>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Release inbox flow</template>
        <div class="ui-stack">
          <UiBreadcrumb :items="releaseBreadcrumbItems" :max-items="4" />

          <UiAlert
            v-if="releaseAlertOpen"
            type="warning"
            title="Approvals pending"
            description="This composed consumer flow stays inside core without dragging in data-grid orchestration."
            closable
            @update:open="releaseAlertOpen = $event"
          >
            <template #action>
              <UiButton size="sm" variant="secondary">Review queue</UiButton>
            </template>
          </UiAlert>

          <div class="ui-cluster">
            <UiTag variant="brand" clickable @click="activeTag = 'Pinned'">Pinned</UiTag>
            <UiTag variant="success" appearance="outline" clickable @click="activeTag = 'Healthy'">
              Healthy
            </UiTag>
            <UiTag variant="warning" closable @close="activeTag = 'Needs review'">
              Needs review
            </UiTag>
            <UiTag variant="info" clickable @click="activeTag = 'Critical'">
              <template #icon>⌘</template>
              Critical
            </UiTag>
          </div>

          <p style="margin: 0">Active filter: {{ activeTag }}</p>

          <UiPagination
            v-model="releaseFlowPage"
            :total-items="96"
            :page-size="12"
            :sibling-count="1"
            :boundary-count="1"
          />

          <UiPagination :model-value="releaseFlowPage" :total-items="96" :page-size="12" simple />

          <p style="margin: 0">Current page: {{ releaseFlowPage }}</p>
        </div>
      </UiCard>
    </section>

    <section id="testing-themes" class="playground__grid" data-playground-scenario="themes">
      <UiCard>
        <template #header>Theme runtime contract</template>
        <div class="ui-stack">
          <p>
            Runtime theming stays DOM-backed. The root scope owns theme, density, motion profile,
            and personality attributes while <code>ThemeType</code> remains derived metadata.
          </p>
          <div class="ui-cluster">
            <UiBadge variant="brand">{{ props.themeMeta.label }}</UiBadge>
            <UiBadge>ThemeName: {{ props.themeRuntime.themeName }}</UiBadge>
            <UiBadge>ThemeType: {{ props.themeRuntime.themeType }}</UiBadge>
            <UiBadge>Density: {{ props.themeRuntime.density }}</UiBadge>
            <UiBadge>Motion: {{ props.themeRuntime.motionProfile }}</UiBadge>
            <UiBadge>Personality: {{ props.themeRuntime.personality }}</UiBadge>
          </div>
          <div class="playground__taxonomy">
            <div
              v-for="[label, tokens] in capabilityMatrixEntries"
              :key="label"
              class="playground__taxonomy-group"
            >
              <UiBadge variant="brand">{{ label }}</UiBadge>
              <div class="ui-cluster">
                <code v-for="token in tokens" :key="token">{{ token }}</code>
              </div>
            </div>
          </div>
          <p style="margin: 0; color: var(--ui-text-secondary)">
            Responsive overrides stay inside the generated theme sheets at
            <code>{{ THEME_CAPABILITY_MATRIX.responsive.breakpoints.md }}</code> and
            <code>{{ THEME_CAPABILITY_MATRIX.responsive.breakpoints.lg }}</code
            >.
          </p>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Theme subtree proof</template>
        <section
          ref="scopedThemeHost"
          class="playground__scoped-surface"
          :data-ui-theme="scopedTheme.name"
          :data-ui-theme-type="scopedTheme.type"
        >
          <div class="ui-stack">
            <p>
              Belovodye can live as a scoped subtree and overlays inherit its tokens through the
              theme-aware portal.
            </p>
            <div class="ui-cluster">
              <UiBadge variant="brand">{{ scopedTheme.label }}</UiBadge>
              <UiBadge>ThemeName: {{ scopedThemeRuntime?.themeName ?? scopedTheme.name }}</UiBadge>
              <UiBadge>ThemeType: {{ scopedThemeRuntime?.themeType ?? scopedTheme.type }}</UiBadge>
              <UiBadge>Density: {{ scopedThemeRuntime?.density ?? scopedThemeDensity }}</UiBadge>
              <UiBadge
                >Motion:
                {{ scopedThemeRuntime?.motionProfile ?? scopedThemeMotionProfile }}</UiBadge
              >
              <UiBadge
                >Personality:
                {{ scopedThemeRuntime?.personality ?? scopedThemePersonality }}</UiBadge
              >
              <UiSwitch v-model="scopedThemeSwitchValue" ariaLabel="Enable scoped theme state">
                Scoped theme state
              </UiSwitch>
            </div>
            <div class="ui-cluster">
              <label class="playground__theme-picker">
                <span>Density</span>
                <select
                  v-model="scopedThemeDensity"
                  aria-label="Scoped density"
                  class="ui-input ui-select__control playground__select"
                >
                  <option v-for="option in THEME_DENSITIES" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>
              <label class="playground__theme-picker">
                <span>Motion profile</span>
                <select
                  v-model="scopedThemeMotionProfile"
                  aria-label="Scoped motion profile"
                  class="ui-input ui-select__control playground__select"
                >
                  <option v-for="option in THEME_MOTION_PROFILES" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>
              <label class="playground__theme-picker">
                <span>Personality</span>
                <select
                  v-model="scopedThemePersonality"
                  aria-label="Scoped personality"
                  class="ui-input ui-select__control playground__select"
                >
                  <option v-for="option in THEME_PERSONALITIES" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>
            </div>
            <UiField label="Scoped input" hint="Same component contracts, different theme scope">
              <UiInput v-model="scopedThemeInputValue" />
            </UiField>
            <UiTabsRoot v-model="scopedThemeTabValue">
              <UiTabsList>
                <UiTabsTrigger value="surface">Surface</UiTabsTrigger>
                <UiTabsTrigger value="overlay">Overlay</UiTabsTrigger>
              </UiTabsList>
              <UiTabsPanel value="surface">
                Cards, fields, badges, and tabs inherit the Belovodye surface system inside this
                container.
              </UiTabsPanel>
              <UiTabsPanel value="overlay">
                Dialog and drawer opened here stay inside the same theme subtree.
              </UiTabsPanel>
            </UiTabsRoot>
          </div>
          <div class="ui-cluster">
            <UiButton @click="scopedDialogOpen = true">Open subtree dialog</UiButton>
            <UiButton variant="secondary" @click="scopedDrawerOpen = true"
              >Open subtree drawer</UiButton
            >
          </div>
          <UiDialog v-model:open="scopedDialogOpen" title="Scoped dialog">
            Overlay tokens and theme variables stay scoped to this container.
          </UiDialog>
          <UiDrawer v-model:open="scopedDrawerOpen" title="Scoped drawer" side="right">
            This drawer inherits Belovodye variables because the portal root resolves inside the
            themed subtree.
          </UiDrawer>
        </section>
      </UiCard>

      <UiCard>
        <template #header>Explicit portal target</template>
        <div class="ui-stack">
          <div ref="explicitPortalTarget" class="playground__portal-target">
            Explicit portal host
          </div>
          <UiButton variant="secondary" @click="explicitDrawerOpen = true"
            >Open drawer in explicit host</UiButton
          >
          <UiDrawer
            v-model:open="explicitDrawerOpen"
            title="Explicit host drawer"
            side="right"
            :portal-target="explicitPortalTarget"
          >
            Drawer portal resolution can be forced when composition requires a dedicated host.
          </UiDrawer>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Theme-aware chart showcase</template>
        <section
          class="playground__scoped-surface"
          :data-ui-theme="scopedTheme.name"
          :data-ui-theme-type="scopedTheme.type"
        >
          <div class="ui-stack">
            <div class="ui-cluster">
              <UiBadge variant="brand">{{ scopedTheme.label }}</UiBadge>
              <UiBadge>ThemeName: {{ scopedTheme.name }}</UiBadge>
              <UiBadge>ThemeType: {{ scopedTheme.type }}</UiBadge>
            </div>
          </div>
          <div class="playground__chart-grid">
            <UiApexChart
              type="line"
              :series="lineChartSeries"
              :options="lineChartOptions"
              title="Scoped line chart"
              description="Subtree theming works without chart-specific props."
            />
            <UiApexChart
              type="donut"
              :series="donutChartSeries"
              :options="donutChartOptions"
              title="Scoped donut chart"
              description="Tooltip, legend, and no-data colors stay inside the scoped theme."
            />
          </div>
        </section>
      </UiCard>
    </section>

    <DataGridShowcase />

    <DataTableWidgetShowcase />

    <section
      id="testing-charts"
      class="playground__foundation-grid"
      data-playground-scenario="charts"
    >
      <UiCard>
        <template #header>Charts overview</template>
        <div class="playground__chart-grid">
          <UiApexChart
            type="line"
            :series="lineChartSeries"
            :options="lineChartOptions"
            title="Traffic trend"
            description="Theme-aware line chart with black-box vendor setup."
          />
          <UiApexChart
            type="area"
            :series="areaChartSeries"
            :options="areaChartOptions"
            title="Conversion flow"
            description="Area chart defaults stay restrained and token-driven."
          />
          <UiApexChart
            type="bar"
            :series="barChartSeries"
            :options="barChartOptions"
            title="Regional pipeline"
            description="Bar charts inherit the same palette and axis language."
          />
          <UiApexChart
            type="donut"
            :series="donutChartSeries"
            :options="donutChartOptions"
            title="Package split"
            description="Donut and pie stay inside the same wrapper API."
          />
        </div>
      </UiCard>

      <UiCard>
        <template #header>Chart states</template>
        <div class="playground__chart-grid">
          <UiApexChart
            type="line"
            :series="lineChartSeries"
            :options="lineChartOptions"
            loading
            title="Loading chart"
            description="Loading overlays do not require consumer-side vendor control."
          />
          <UiApexChart
            type="bar"
            :series="[]"
            empty
            empty-text="No chart data available yet."
            title="Empty chart"
            description="Explicit empty state wins before the vendor mounts."
          />
          <UiApexChart
            type="line"
            :series="lineChartSeries"
            :options="lineChartOptions"
            error="Apex vendor mount failed."
            title="Error chart"
            description="Graceful fallback keeps the shell readable."
          />
        </div>
      </UiCard>
    </section>

    <SignalGraphShowcase />

    <LayerScaffoldShowcase />

    <UiCard>
      <template #header>Tabs and overlay focus restore</template>
      <UiTabsRoot v-model="tabValue">
        <UiTabsList>
          <UiTabsTrigger value="overview">Overview</UiTabsTrigger>
          <UiTabsTrigger value="motion">Motion</UiTabsTrigger>
          <UiTabsTrigger value="overlays">Overlays</UiTabsTrigger>
        </UiTabsList>
        <UiTabsPanel value="overview">
          Core CSS consumes semantic and component custom properties only.
        </UiTabsPanel>
        <UiTabsPanel value="motion">
          Presets, utilities, and runtime hooks live in primitives so future custom sections can
          reuse them directly.
        </UiTabsPanel>
        <UiTabsPanel value="overlays">
          Dialog and Drawer share deterministic layer slots, stack ownership, and theme-aware portal
          mounting.
        </UiTabsPanel>
      </UiTabsRoot>
    </UiCard>

    <div class="ui-cluster playground__overlay-actions">
      <UiButton @click="dialogOpen = true">Open dialog</UiButton>
      <UiButton variant="secondary" @click="drawerOpen = true">Open drawer</UiButton>
    </div>

    <UiDialog
      v-model:open="dialogOpen"
      title="Dialog baseline"
      description="Uses shared overlay stack, theme-aware portal resolution, and motion presets."
    >
      <p>Dialog content stays within the foundation scope.</p>
      <template #footer>
        <UiButton variant="secondary" @click="dialogOpen = false">Cancel</UiButton>
        <UiButton @click="dialogOpen = false">Confirm</UiButton>
      </template>
    </UiDialog>

    <UiDrawer
      v-model:open="drawerOpen"
      side="right"
      title="Drawer baseline"
      description="Open the nested dialog to inspect stack ordering and focus restore."
    >
      <div class="ui-stack">
        <p>Overlay stack stays deterministic across nested modal surfaces.</p>
        <UiButton variant="secondary" @click="nestedDialogOpen = true">Open nested dialog</UiButton>
        <UiDialog v-model:open="nestedDialogOpen" title="Nested dialog over drawer">
          <p>This dialog takes over topmost dismiss behavior until it closes.</p>
          <template #footer>
            <UiButton variant="secondary" @click="nestedDialogOpen = false">Close</UiButton>
          </template>
        </UiDialog>
      </div>
    </UiDrawer>
  </main>
</template>
