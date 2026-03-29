<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { UiBadge } from '@ww/core';
import {
  THEME_TYPES,
  getThemeMeta,
  getThemesByType,
  setTheme,
  type ThemeName,
  type ThemeType,
} from '@ww/themes';

import LabWorkbenchView from './lab/routes/LabWorkbenchView.vue';
import { createInitialLabEntry } from './lab/runtime/lab-catalog';
import {
  buildPlaygroundPath,
  parsePlaygroundRoute,
  type PlaygroundRoute,
} from './shared/navigation/playground-route';
import TestingHarnessView from './testing/routes/TestingHarnessView.vue';

const theme = ref<ThemeName>('belovodye');
const themeFilter = ref<ThemeType | 'all'>('all');
const defaultSurfaceId = createInitialLabEntry().id;
const route = ref(parsePlaygroundRoute(window.location.pathname, defaultSurfaceId));

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
  theme,
  (nextTheme) => {
    setTheme(nextTheme);
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
    <header class="playground-shell__bar">
      <div class="playground-shell__branding">
        <p class="playground-shell__eyebrow">Belovodye UiKit playground</p>
        <h1>Maintainer workbench + stable integration harness</h1>
        <p>
          Storybook remains the public UI contract. Playground now exposes a schema-driven lab
          alongside the existing testing harness.
        </p>
      </div>

      <div class="playground-shell__controls">
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
        </div>

        <div class="playground__theme-indicator">
          <UiBadge variant="brand">{{ currentTheme.label }}</UiBadge>
          <UiBadge>ThemeName: {{ currentTheme.name }}</UiBadge>
          <UiBadge>ThemeType: {{ currentTheme.type }}</UiBadge>
        </div>
      </div>
    </header>

    <TestingHarnessView v-if="route.mode === 'testing'" :theme-meta="currentTheme" />
    <LabWorkbenchView
      v-else
      :surface-id="route.surfaceId"
      :theme-name="theme"
      :theme-meta="currentTheme"
      @navigate-surface="navigate({ mode: 'lab', surfaceId: $event })"
    />
  </main>
</template>
