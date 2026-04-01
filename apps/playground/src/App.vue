<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { UiAvatar, UiBadge, UiCard, UiDropdown, UiIconButton } from '@ww/core';
import { UiDashboardLayout, UiHorizontalLayout, UiVerticalLayout } from '@ww/page-templates';
import { UiTsParticlesBackdrop } from '@ww/tsparticles';
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
import { playgroundAsideParticles } from './playground-particles';
import {
  readPlaygroundThemePreferences,
  writePlaygroundThemePreferences,
} from './theme-preferences';
import {
  buildPlaygroundPath,
  parsePlaygroundRoute,
  type PlaygroundRoute,
} from './shared/navigation/playground-route';
import { playgroundLogoSrc } from './playground-brand';

const TestingHarnessView = defineAsyncComponent(
  () => import('./testing/routes/TestingHarnessView.vue')
);
const LabWorkbenchView = defineAsyncComponent(() => import('./lab/routes/LabWorkbenchView.vue'));
const PlaygroundHomeView = defineAsyncComponent(() => import('./PlaygroundHomeView.vue'));

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
const homePath = computed(() => buildPlaygroundPath({ mode: 'home' }));
const testingPath = computed(() => buildPlaygroundPath({ mode: 'testing' }));
const activeLabSurfaceId = computed(() =>
  route.value.mode === 'lab' ? route.value.surfaceId : defaultSurfaceId
);
const activeLabPath = computed(() =>
  buildPlaygroundPath({ mode: 'lab', surfaceId: activeLabSurfaceId.value })
);
const activeWorkspacePath = computed(() =>
  route.value.mode === 'testing' ? testingPath.value : activeLabPath.value
);
const workspaceMeta = computed(() =>
  route.value.mode === 'testing'
    ? {
        intro:
          'The old playground chrome is removed. `/testing` now lives directly inside the governed dashboard shell.',
      }
    : {
        intro: `The old playground chrome is removed. \`/lab\` now lives directly inside the governed dashboard shell for ${activeLabSurfaceId.value}.`,
      }
);
const workspaceMenuItems = computed(() => [
  { label: 'Overview dashboard', href: homePath.value },
  { label: 'Testing harness', href: testingPath.value },
  { label: 'Component lab', href: activeLabPath.value },
  { label: 'GitHub repository', href: 'https://github.com/Mesteriis/ww-ui-kit' },
]);
const workspaceNavigationGroups = computed(() => [
  {
    id: 'routes',
    title: 'Routes',
    items: [
      {
        active: false,
        description: 'DashboardLayout root surface for the playground landing page.',
        href: homePath.value,
        label: 'Overview dashboard',
      },
      {
        active: route.value.mode === 'testing',
        description: 'Stable consumer harness with governed scenario anchors.',
        href: testingPath.value,
        label: 'Testing harness',
      },
      {
        active: route.value.mode === 'lab',
        description: 'Maintainer workbench with generated lab catalog entries.',
        href: activeLabPath.value,
        label: 'Component lab',
      },
    ],
  },
  route.value.mode === 'testing'
    ? {
        id: 'stable-proofs',
        title: 'Stable proofs',
        items: [
          {
            active: false,
            description: 'ThemeName, ThemeType, density, motion, and personality coverage.',
            href: `${testingPath.value}#testing-themes`,
            label: 'Theme runtime',
          },
          {
            active: false,
            description: 'Dialog, drawer, popover, dropdown, and toast browser flows.',
            href: `${testingPath.value}#testing-overlays`,
            label: 'Overlay systems',
          },
          {
            active: false,
            description: 'Dashboard template and shell-family layout proofs.',
            href: `${testingPath.value}#testing-page-templates`,
            label: 'Page templates',
          },
        ],
      }
    : {
        id: 'maintainer-focus',
        title: 'Maintainer focus',
        items: [
          {
            active:
              route.value.mode === 'lab' && activeLabSurfaceId.value === 'ui-dashboard-layout',
            description: 'Named dashboard page-template surface and slot contract.',
            href: buildPlaygroundPath({ mode: 'lab', surfaceId: 'ui-dashboard-layout' }),
            label: 'Dashboard layout lab',
          },
          {
            active: route.value.mode === 'lab' && activeLabSurfaceId.value === 'ui-layout',
            description: 'Generic shell family stays separate from dashboard-specific composition.',
            href: buildPlaygroundPath({ mode: 'lab', surfaceId: 'ui-layout' }),
            label: 'Layout shell lab',
          },
          {
            active: route.value.mode === 'lab' && activeLabSurfaceId.value === 'ui-data-grid',
            description: 'System-level surface tuning stays in the generated component lab.',
            href: buildPlaygroundPath({ mode: 'lab', surfaceId: 'ui-data-grid' }),
            label: 'Data grid lab',
          },
        ],
      },
]);
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
  <PlaygroundHomeView
    v-if="route.mode === 'home'"
    :default-surface-id="defaultSurfaceId"
    :theme-meta="currentTheme"
    :theme-runtime="themeRuntime"
  />

  <main v-else class="playground-workspace" data-playground-app="ww-ui-kit">
    <UiDashboardLayout class="playground-workspace__dashboard">
      <template #aside-header>
        <UiTsParticlesBackdrop
          class="playground-home__aside-backdrop"
          :options="playgroundAsideParticles"
          particle-color-var="--ui-brand-300"
          link-color-var="--ui-border-strong"
        >
          <header class="playground-home__brand" aria-label="Playground brand">
            <UiAvatar
              class="playground-home__brand-avatar"
              :src="playgroundLogoSrc"
              alt="Belovodye UiKit logo"
              initials="WW"
              size="lg"
              shape="square"
              tone="brand"
            />
            <div class="playground-home__brand-main">
              <h3>Belovodye UiKit playground</h3>
              <h4>{{ workspaceMeta.intro }}</h4>
            </div>
          </header>
        </UiTsParticlesBackdrop>
      </template>

      <template #aside-content>
        <UiTsParticlesBackdrop
          class="playground-home__aside-backdrop playground-home__aside-backdrop--fill"
          size="fill"
          :options="playgroundAsideParticles"
          particle-color-var="--ui-brand-300"
          link-color-var="--ui-border-strong"
        >
          <nav class="playground-home__nav-shell" aria-label="Playground workspace navigation">
            <UiVerticalLayout class="playground-home__nav-flow" gap="var(--ui-space-5)" scroll>
              <UiVerticalLayout
                v-for="group in workspaceNavigationGroups"
                :key="group.id"
                class="playground-home__nav-group-flow"
                gap="var(--ui-space-3)"
              >
                <strong>{{ group.title }}</strong>
                <UiVerticalLayout class="playground-home__nav-items-flow" gap="var(--ui-space-2)">
                  <a
                    v-for="item in group.items"
                    :key="item.label"
                    class="playground-home__nav-link"
                    :class="{ 'is-active': item.active }"
                    :href="item.href"
                    :aria-current="item.active ? 'page' : undefined"
                  >
                    <span>{{ item.label }}</span>
                    <small>{{ item.description }}</small>
                  </a>
                </UiVerticalLayout>
              </UiVerticalLayout>
            </UiVerticalLayout>
          </nav>
        </UiTsParticlesBackdrop>
      </template>

      <template #aside-actions>
        <UiTsParticlesBackdrop
          class="playground-home__aside-backdrop"
          :options="playgroundAsideParticles"
          particle-color-var="--ui-brand-300"
          link-color-var="--ui-border-strong"
        >
          <UiVerticalLayout class="playground-home__actions-flow" gap="var(--ui-space-3)">
            <a class="playground-home__cta" :href="testingPath">Open testing harness</a>
            <a class="playground-home__cta playground-home__cta--secondary" :href="activeLabPath">
              Open component lab
            </a>
            <a class="playground-home__cta playground-home__cta--secondary" :href="homePath">
              Open overview dashboard
            </a>
          </UiVerticalLayout>
        </UiTsParticlesBackdrop>
      </template>

      <template #header>
        <div class="playground-workspace__header-line">
          <h2>{{ activeWorkspacePath }}</h2>
        </div>
      </template>

      <template #header-actions>
        <UiDropdown :items="workspaceMenuItems">
          <template #trigger>
            <UiIconButton
              class="playground-workspace-menu-trigger"
              ariaLabel="Open workspace menu"
              variant="secondary"
            >
              ☰
            </UiIconButton>
          </template>
        </UiDropdown>
      </template>

      <UiVerticalLayout class="playground-workspace__content-flow" gap="var(--ui-space-5)" scroll>
        <UiCard
          class="playground-dashboard-card playground-workspace__runtime-card"
          aria-label="Playground theme runtime"
        >
          <template #header>
            <div class="playground-workspace__runtime-copy">
              <h2>Shared theme context</h2>
              <p>
                One runtime controls the overview dashboard, testing harness, and component lab.
              </p>
            </div>
          </template>

          <UiHorizontalLayout
            class="playground-workspace__picker-flow"
            gap="var(--ui-space-3)"
            scroll
          >
            <label class="playground__theme-picker playground-workspace__picker-card">
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
            <label class="playground__theme-picker playground-workspace__picker-card">
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
            <label class="playground__theme-picker playground-workspace__picker-card">
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
            <label class="playground__theme-picker playground-workspace__picker-card">
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
            <label class="playground__theme-picker playground-workspace__picker-card">
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
          </UiHorizontalLayout>

          <UiHorizontalLayout
            class="playground-workspace__indicator-flow"
            gap="var(--ui-space-3)"
            scroll
          >
            <UiBadge variant="brand">{{ currentTheme.label }}</UiBadge>
            <UiBadge>ThemeName: {{ currentTheme.name }}</UiBadge>
            <UiBadge>ThemeType: {{ currentTheme.type }}</UiBadge>
            <UiBadge>Density: {{ themeRuntime.density }}</UiBadge>
            <UiBadge>Motion: {{ themeRuntime.motionProfile }}</UiBadge>
            <UiBadge>Personality: {{ themeRuntime.personality }}</UiBadge>
          </UiHorizontalLayout>
        </UiCard>

        <div class="playground-workspace__surface-host">
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
        </div>
      </UiVerticalLayout>
    </UiDashboardLayout>
  </main>
</template>
