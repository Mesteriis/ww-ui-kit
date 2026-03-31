<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { UiBadge } from '@ww/core';
import {
  THEME_DENSITIES,
  THEME_MOTION_PROFILES,
  THEME_PERSONALITIES,
  THEME_TYPES,
  getThemeMeta,
  getThemesByType,
  patchThemeRuntime,
  readThemeRuntime,
  type ThemeName,
  type ThemeDensity,
  type ThemeMotionProfile,
  type ThemePersonality,
  type ThemeRuntimeState,
  type ThemeType,
} from '@ww/themes';

import { createInitialLabEntry } from './lab/runtime/lab-catalog';
import {
  readPlaygroundThemePreferences,
  writePlaygroundThemePreferences,
} from './theme-preferences';
import {
  buildPlaygroundPath,
  parsePlaygroundRoute,
  type PlaygroundRoute,
} from './shared/navigation/playground-route';

const TestingHarnessView = defineAsyncComponent(
  () => import('./testing/routes/TestingHarnessView.vue')
);
const LabWorkbenchView = defineAsyncComponent(() => import('./lab/routes/LabWorkbenchView.vue'));

const initialThemePreferences = readPlaygroundThemePreferences();
const theme = ref<ThemeName>(initialThemePreferences.themeName);
const themeFilter = ref<ThemeType | 'all'>(initialThemePreferences.themeFilter);
const density = ref<ThemeDensity>(initialThemePreferences.density);
const motionProfile = ref<ThemeMotionProfile>(initialThemePreferences.motionProfile);
const personality = ref<ThemePersonality>(initialThemePreferences.personality);
const defaultSurfaceId = createInitialLabEntry().id;
const route = ref(parsePlaygroundRoute(window.location.pathname, defaultSurfaceId));
const themeRuntime = ref<ThemeRuntimeState>(readThemeRuntime());

const currentTheme = computed(() => getThemeMeta(theme.value));
const themeGroups = computed(() => {
  const types = themeFilter.value === 'all' ? THEME_TYPES : [themeFilter.value];
  return types
    .map((type) => ({
      type,
      themes: getThemesByType(type),
    }))
    .filter((group) => group.themes.length > 0);
});

watch(themeFilter, (nextFilter) => {
  if (nextFilter === 'all') {
    return;
  }

  const matchingTheme = getThemesByType(nextFilter).find(({ name }) => name === theme.value);
  if (!matchingTheme) {
    theme.value = getThemesByType(nextFilter)[0]?.name ?? theme.value;
  }
});

watch(
  [theme, themeFilter, density, motionProfile, personality],
  ([nextTheme, nextThemeFilter, nextDensity, nextMotionProfile, nextPersonality]) => {
    patchThemeRuntime({
      density: nextDensity,
      motionProfile: nextMotionProfile,
      personality: nextPersonality,
      themeName: nextTheme,
    });
    themeRuntime.value = readThemeRuntime();
    writePlaygroundThemePreferences({
      themeName: nextTheme,
      themeFilter: nextThemeFilter,
      density: nextDensity,
      motionProfile: nextMotionProfile,
      personality: nextPersonality,
    });
  },
  { immediate: true }
);

const syncRoute = () => {
  route.value = parsePlaygroundRoute(window.location.pathname, defaultSurfaceId);
};

const navigate = (nextRoute: PlaygroundRoute) => {
  const nextPath = buildPlaygroundPath(nextRoute);
  window.history.pushState({}, '', nextPath);
  route.value = nextRoute;
  window.scrollTo({ top: 0, behavior: 'auto' });
};

onMounted(() => {
  window.addEventListener('popstate', syncRoute);
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncRoute);
});
</script>

<template>
  <main class="playground-shell" data-playground-app="ww-ui-kit">
    <header class="playground-shell__bar" :data-playground-mode="route.mode">
      <div class="playground-shell__intro">
        <div class="playground-shell__branding">
          <p class="playground-shell__eyebrow">Belovodye UiKit playground</p>
          <h1>Maintainer workbench + stable integration harness</h1>
          <p>
            Storybook remains the public UI contract. Playground now exposes a schema-driven lab
            alongside the existing testing harness.
          </p>
        </div>

        <nav class="playground-shell__mode-switch" aria-label="Playground mode">
          <button
            type="button"
            class="playground-shell__mode-button"
            :class="{ 'is-active': route.mode === 'testing' }"
            :aria-pressed="route.mode === 'testing'"
            @click="navigate({ mode: 'testing' })"
          >
            Testing harness
          </button>
          <button
            type="button"
            class="playground-shell__mode-button"
            :class="{ 'is-active': route.mode === 'lab' }"
            :aria-pressed="route.mode === 'lab'"
            @click="
              navigate({
                mode: 'lab',
                surfaceId: route.mode === 'lab' ? route.surfaceId : defaultSurfaceId,
              })
            "
          >
            Component lab
          </button>
        </nav>
      </div>

      <section class="playground-shell__controls" aria-label="Playground theme runtime">
        <div class="playground-shell__controls-copy">
          <p class="playground-shell__eyebrow">Preview runtime</p>
          <h2>Shared theme context</h2>
          <p>One runtime controls the testing harness and every component-lab preview.</p>
        </div>

        <div class="playground-shell__theme-controls">
          <label class="playground__theme-picker">
            <span>Theme type</span>
            <select
              v-model="themeFilter"
              aria-label="Playground theme family"
              class="ui-input ui-select__control playground__select"
            >
              <option value="all">All families</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label class="playground__theme-picker">
            <span>Theme</span>
            <select
              v-model="theme"
              aria-label="Playground theme"
              class="ui-input ui-select__control playground__select"
            >
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
          <label class="playground__theme-picker">
            <span>Density</span>
            <select
              v-model="density"
              aria-label="Playground density"
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
              v-model="motionProfile"
              aria-label="Playground motion profile"
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
              v-model="personality"
              aria-label="Playground personality"
              class="ui-input ui-select__control playground__select"
            >
              <option v-for="option in THEME_PERSONALITIES" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </label>
        </div>

        <div class="playground__theme-indicator">
          <UiBadge variant="brand">{{ currentTheme.label }}</UiBadge>
          <UiBadge>ThemeName: {{ currentTheme.name }}</UiBadge>
          <UiBadge>ThemeType: {{ currentTheme.type }}</UiBadge>
          <UiBadge>Density: {{ themeRuntime.density }}</UiBadge>
          <UiBadge>Motion: {{ themeRuntime.motionProfile }}</UiBadge>
          <UiBadge>Personality: {{ themeRuntime.personality }}</UiBadge>
        </div>
      </section>
    </header>

    <TestingHarnessView
      v-if="route.mode === 'testing'"
      :theme-meta="currentTheme"
      :theme-runtime="themeRuntime"
    />
    <LabWorkbenchView
      v-else
      :surface-id="route.surfaceId"
      :theme-name="theme"
      :theme-meta="currentTheme"
      @navigate-surface="navigate({ mode: 'lab', surfaceId: $event })"
    />
  </main>
</template>
