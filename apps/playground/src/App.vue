<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

import {
  UiApexChart,
  type UiApexChartOptions,
  type UiApexChartSeries,
} from '@ww/charts-apex';
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
import {
  MOTION_PRESET_NAMES,
  MOTION_PRESETS,
  MOTION_TAXONOMY,
  afterCollapseMotion,
  applyTransitionMotionVariables,
  beforeCollapseMotion,
  clearTransitionMotionVariables,
  readOverlayLayerScale,
  resolveTransitionMotionPreset,
  resolveOverlayLayerSlots,
  runCollapseMotion
} from '@ww/primitives';
import {
  THEME_TYPES,
  getThemeMeta,
  getThemesByType,
  setTheme,
  type ThemeName,
  type ThemeType
} from '@ww/themes';
import LayerScaffoldShowcase from './LayerScaffoldShowcase.vue';
import DataGridShowcase from './DataGridShowcase.vue';
import DataTableWidgetShowcase from './DataTableWidgetShowcase.vue';
import SignalGraphShowcase from './SignalGraphShowcase.vue';
import { PLAYGROUND_SCENARIOS } from './testing/scenarios';

const theme = ref<ThemeName>('belovodye');
const themeFilter = ref<ThemeType | 'all'>('all');
const inputValue = ref('Hello Belovodye UiKit');
const textareaValue = ref('Composable and themeable foundation.');
const selectValue = ref('design-system');
const checkboxValue = ref(true);
const switchValue = ref(false);
const dialogOpen = ref(false);
const drawerOpen = ref(false);
const nestedDialogOpen = ref(false);
const scopedDialogOpen = ref(false);
const scopedDrawerOpen = ref(false);
const explicitDrawerOpen = ref(false);
const tabValue = ref('overview');
const scopedThemeInputValue = ref('Scoped Belovodye surface');
const scopedThemeSwitchValue = ref(true);
const scopedThemeTabValue = ref('surface');
const motionPreset = ref<(typeof MOTION_PRESET_NAMES)[number]>('modal-fade-scale');
const motionVisible = ref(true);
const collapseOpen = ref(true);
const explicitPortalTarget = ref<HTMLElement | null>(null);

const selectOptions = [
  { label: 'Design system', value: 'design-system' },
  { label: 'Internal tool', value: 'internal-tool' },
  { label: 'Customer surface', value: 'customer-surface' }
];

const utilityRows = [
  { label: 'Lift + focus ring', motion: 'lift-xs ring-focus-soft', badge: 'brand' as const },
  { label: 'Underline slide', motion: 'underline-slide ring-focus-soft', badge: 'warning' as const },
  { label: 'Glow accent', motion: 'glow-accent', badge: 'danger' as const },
  { label: 'Loading shimmer', motion: 'loading-shimmer', badge: 'success' as const }
];

const chartCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const lineChartSeries: UiApexChartSeries = [
  {
    name: 'Traffic',
    data: [128, 164, 152, 186, 210, 228]
  }
];
const areaChartSeries: UiApexChartSeries = [
  {
    name: 'Conversion',
    data: [22, 26, 28, 32, 35, 39]
  }
];
const barChartSeries: UiApexChartSeries = [
  {
    name: 'Pipeline',
    data: [38, 51, 47, 63]
  }
];
const donutChartSeries: UiApexChartSeries = [42, 28, 18, 12];

const lineChartOptions: UiApexChartOptions = {
  xaxis: {
    categories: chartCategories
  }
};
const areaChartOptions: UiApexChartOptions = {
  xaxis: {
    categories: chartCategories
  }
};
const barChartOptions: UiApexChartOptions = {
  xaxis: {
    categories: ['North', 'South', 'East', 'West']
  }
};
const donutChartOptions: UiApexChartOptions = {
  labels: ['Core', 'Docs', 'Playground', 'Adapters']
};

const taxonomyEntries = Object.entries(MOTION_TAXONOMY);
const currentTheme = computed(() => getThemeMeta(theme.value));
const scopedTheme = getThemeMeta('belovodye');
const themeGroups = computed(() => {
  const types = themeFilter.value === 'all' ? THEME_TYPES : [themeFilter.value];
  return types
    .map((type) => ({
      type,
      themes: getThemesByType(type)
    }))
    .filter((group) => group.themes.length > 0);
});
const layerScale = computed(() => readOverlayLayerScale());
const firstModalLayers = computed(() => resolveOverlayLayerSlots(0, 'modal'));
const secondModalLayers = computed(() => resolveOverlayLayerSlots(1, 'modal'));
const floatingLayers = computed(() => resolveOverlayLayerSlots(0, 'floating'));

const replayMotion = async () => {
  motionVisible.value = false;
  await nextTick();
  motionVisible.value = true;
};

watch(themeFilter, (nextFilter) => {
  if (nextFilter === 'all') {
    return;
  }

  const matchingTheme = getThemesByType(nextFilter).find(({ name }) => name === theme.value);
  if (!matchingTheme) {
    theme.value = getThemesByType(nextFilter)[0]?.name ?? theme.value;
  }
});

watch(theme, (nextTheme) => {
  setTheme(nextTheme);
});

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
</script>

<template>
  <main class="playground" data-playground-app="ww-ui-kit">
    <header class="playground__hero">
      <div>
        <p class="playground__eyebrow">Belovodye UiKit foundation</p>
        <h1>Motion, layers, tokens, themes, primitives, and baseline components in one integration surface.</h1>
        <p class="playground__hero-copy">
          Root theme state is applied as <code>data-ui-theme="{{ currentTheme.name }}"</code> and
          <code>data-ui-theme-type="{{ currentTheme.type }}"</code>.
        </p>
      </div>
      <div class="playground__theme-controls">
        <label class="playground__theme-picker">
          <span>Theme type</span>
          <select v-model="themeFilter" class="ui-input ui-select__control playground__select">
            <option value="all">All families</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label class="playground__theme-picker">
          <span>Theme</span>
          <select v-model="theme" class="ui-input ui-select__control playground__select">
            <optgroup
              v-for="group in themeGroups"
              :key="group.type"
              :label="`${group.type} themes`"
            >
              <option v-for="option in group.themes" :key="option.name" :value="option.name">
                {{ option.label }}
              </option>
            </optgroup>
          </select>
        </label>
        <div class="playground__theme-indicator">
          <UiBadge variant="brand">{{ currentTheme.label }}</UiBadge>
          <UiBadge>ThemeName: {{ currentTheme.name }}</UiBadge>
          <UiBadge>ThemeType: {{ currentTheme.type }}</UiBadge>
        </div>
        <div class="ui-cluster">
          <UiButton @click="dialogOpen = true">Open dialog</UiButton>
          <UiButton variant="secondary" @click="drawerOpen = true">Open drawer</UiButton>
          <UiIconButton ariaLabel="Open scoped drawer" @click="scopedDrawerOpen = true">
            ☰
          </UiIconButton>
        </div>
      </div>
    </header>

    <nav class="playground__scenario-nav" aria-label="Playground test harness sections">
      <a
        v-for="scenario in PLAYGROUND_SCENARIOS"
        :key="scenario.id"
        class="playground__scenario-link"
        :href="scenario.hash"
      >
        <strong>{{ scenario.label }}</strong>
        <span>{{ scenario.description }}</span>
      </a>
    </nav>

    <section
      id="testing-themes"
      class="playground__grid"
      data-playground-scenario="themes"
    >
      <UiCard>
        <template #header>Inputs</template>
        <div class="ui-stack">
          <UiField label="Project name" hint="Connected to field context">
            <UiInput v-model="inputValue" placeholder="Name your project" />
          </UiField>
          <UiField label="Context" error="Textarea contract example">
            <UiTextarea v-model="textareaValue" />
          </UiField>
          <UiField label="Surface type">
            <UiSelectSimple v-model="selectValue" :options="selectOptions" />
          </UiField>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Actions and selection</template>
        <div class="ui-stack">
          <div class="ui-cluster">
            <UiButton>Primary</UiButton>
            <UiButton variant="secondary">Secondary</UiButton>
            <UiButton variant="ghost">Ghost</UiButton>
            <UiButton variant="danger">Danger</UiButton>
          </div>
          <div class="ui-cluster">
            <UiButton tone="trace">Trace</UiButton>
            <UiButton tone="debug">Debug</UiButton>
            <UiButton tone="info">Info</UiButton>
            <UiButton tone="warning">Warning</UiButton>
            <UiButton tone="error">Error</UiButton>
            <UiButton tone="critical">Critical</UiButton>
          </div>
          <div class="ui-cluster">
            <UiButton tone="info" appearance="outline">Outline info</UiButton>
            <UiButton tone="warning" appearance="outline">Outline warning</UiButton>
            <UiButton tone="debug" effect="border-flow">Border flow</UiButton>
            <UiButton tone="brand" effect="color-shift">Color shift</UiButton>
          </div>
          <UiCheckbox v-model="checkboxValue">Enable release channel</UiCheckbox>
          <UiSwitch v-model="switchValue" ariaLabel="Toggle notifications">
            Route notifications
          </UiSwitch>
          <div class="ui-cluster">
            <UiBadge>Neutral</UiBadge>
            <UiBadge variant="brand">Brand</UiBadge>
            <UiBadge variant="success">Success</UiBadge>
            <UiBadge variant="warning">Warning</UiBadge>
            <UiBadge variant="danger">Danger</UiBadge>
          </div>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Display states</template>
        <div class="ui-stack">
          <UiDivider />
          <div class="ui-cluster">
            <UiSpinner size="sm" />
            <UiSpinner />
            <UiSpinner size="lg" />
          </div>
          <UiSkeleton height="1rem" width="100%" />
          <UiSkeleton height="3rem" width="6rem" shape="circle" />
          <UiEmptyState
            title="Foundation only"
            description="This playground stays on the reusable baseline and motion/layer system."
          >
            <template #icon>◇</template>
            <template #actions>
              <UiButton variant="secondary">Read ADRs</UiButton>
            </template>
          </UiEmptyState>
        </div>
      </UiCard>
    </section>

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
            <div
              v-for="item in utilityRows"
              :key="item.motion"
              class="playground__utility-card"
            >
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
          <div class="playground__layer-chip" :style="{ zIndex: String(firstModalLayers.backdrop) }">
            backdrop {{ firstModalLayers.backdrop }}
          </div>
          <div class="playground__layer-chip playground__layer-chip--raised" :style="{ zIndex: String(firstModalLayers.content) }">
            modal {{ firstModalLayers.content }}
          </div>
          <div class="playground__layer-chip playground__layer-chip--accent" :style="{ zIndex: String(floatingLayers.content) }">
            floating {{ floatingLayers.content }}
          </div>
          <div class="playground__layer-chip playground__layer-chip--danger" :style="{ zIndex: String(secondModalLayers.content) }">
            nested {{ secondModalLayers.content }}
          </div>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Preset taxonomy</template>
        <div class="playground__taxonomy">
          <div v-for="[group, names] in taxonomyEntries" :key="group" class="playground__taxonomy-group">
            <UiBadge variant="brand">{{ group }}</UiBadge>
            <div class="ui-cluster">
              <code v-for="name in names" :key="name">{{ name }}</code>
            </div>
          </div>
        </div>
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

    <section class="playground__scoped-grid">
      <UiCard>
        <template #header>Belovodye subtree showcase</template>
        <section
          class="playground__scoped-surface"
          :data-ui-theme="scopedTheme.name"
          :data-ui-theme-type="scopedTheme.type"
        >
          <div class="ui-stack">
            <p>Belovodye can live as a scoped subtree and overlays inherit its tokens through the theme-aware portal.</p>
            <div class="ui-cluster">
              <UiBadge variant="brand">{{ scopedTheme.label }}</UiBadge>
              <UiBadge>ThemeName: {{ scopedTheme.name }}</UiBadge>
              <UiBadge>ThemeType: {{ scopedTheme.type }}</UiBadge>
              <UiSwitch v-model="scopedThemeSwitchValue" ariaLabel="Enable scoped theme state">
                Scoped theme state
              </UiSwitch>
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
                Cards, fields, badges, and tabs inherit the Belovodye surface system inside this container.
              </UiTabsPanel>
              <UiTabsPanel value="overlay">
                Dialog and drawer opened here stay inside the same theme subtree.
              </UiTabsPanel>
            </UiTabsRoot>
          </div>
          <div class="ui-cluster">
            <UiButton @click="scopedDialogOpen = true">Open subtree dialog</UiButton>
            <UiButton variant="secondary" @click="scopedDrawerOpen = true">Open subtree drawer</UiButton>
          </div>
          <UiDialog v-model:open="scopedDialogOpen" title="Scoped dialog">
            Overlay tokens and theme variables stay scoped to this container.
          </UiDialog>
          <UiDrawer
            v-model:open="scopedDrawerOpen"
            title="Scoped drawer"
            side="right"
          >
            This drawer inherits Belovodye variables because the portal root resolves inside the themed subtree.
          </UiDrawer>
        </section>
      </UiCard>

      <UiCard>
        <template #header>Explicit portal target</template>
        <div class="ui-stack">
          <div ref="explicitPortalTarget" class="playground__portal-target">Explicit portal host</div>
          <UiButton variant="secondary" @click="explicitDrawerOpen = true">Open drawer in explicit host</UiButton>
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
    </section>

    <UiCard>
      <template #header>Scoped theme chart showcase</template>
      <section
        class="playground__scoped-surface"
        :data-ui-theme="scopedTheme.name"
        :data-ui-theme-type="scopedTheme.type"
      >
        <div class="ui-stack">
          <p>Charts read the nearest themed container and follow ThemeType-derived defaults inside subtree scopes.</p>
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

    <UiCard>
      <template #header>Tabs</template>
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
          Presets, utilities, and runtime hooks live in primitives so future custom sections can reuse them directly.
        </UiTabsPanel>
        <UiTabsPanel value="overlays">
          Dialog and Drawer now share deterministic layer slots, stack ownership, and theme-aware portal mounting.
        </UiTabsPanel>
      </UiTabsRoot>
    </UiCard>

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
