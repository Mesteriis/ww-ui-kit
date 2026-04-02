<script setup lang="ts">
import { computed } from 'vue';

import { UiAvatar, UiCard, UiDropdown, UiIconButton } from '@ww/core';
import { UiDashboardLayout, UiHorizontalLayout, UiVerticalLayout } from '@ww/page-templates';
import { UiTsParticlesBackdrop } from '@ww/tsparticles';
import type { ThemeMeta, ThemeRuntimeState } from '@ww/themes';

import { playgroundLogoSrc } from './playground-brand';
import { playgroundAsideParticles } from './playground-particles';
import { buildPlaygroundPath } from './shared/navigation/playground-route';

defineOptions({ name: 'PlaygroundHomeView' });

const props = defineProps<{
  defaultSurfaceId: string;
  themeMeta: ThemeMeta;
  themeRuntime: ThemeRuntimeState;
}>();

const overviewPath = computed(() => buildPlaygroundPath({ mode: 'home' }));
const testingPath = computed(() => buildPlaygroundPath({ mode: 'testing' }));
const labPath = computed(() =>
  buildPlaygroundPath({ mode: 'lab', surfaceId: props.defaultSurfaceId })
);

const workspaceMenuItems = computed(() => [
  { label: 'GitHub repository', href: 'https://github.com/Mesteriis/ww-ui-kit' },
  { label: 'Open testing harness', href: testingPath.value },
  { label: 'Open component lab', href: labPath.value },
]);

const navigationGroups = computed(() => [
  {
    id: 'routes',
    title: 'Routes',
    items: [
      {
        label: 'Overview dashboard',
        description: 'Root page proving the governed dashboard template in app composition.',
        href: overviewPath.value,
      },
      {
        label: 'Testing harness',
        description: 'Stable consumer-proof browser harness for the shipped visual surface set.',
        href: testingPath.value,
      },
      {
        label: 'Component lab',
        description: 'Maintainer-facing schema workbench for styling and contract maintenance.',
        href: labPath.value,
      },
    ],
  },
  {
    id: 'stable-proofs',
    title: 'Stable proofs',
    items: [
      {
        label: 'Theme runtime',
        description: 'Density, motion, personality, and ThemeType remain visible in /testing.',
        href: `${testingPath.value}#testing-themes`,
      },
      {
        label: 'Overlay systems',
        description: 'Motion, layering, focus return, and toast stack behavior.',
        href: `${testingPath.value}#testing-overlays`,
      },
      {
        label: 'Page templates',
        description: 'Dashboard and generic shell proofs stay in the stable consumer harness.',
        href: `${testingPath.value}#testing-page-templates`,
      },
    ],
  },
  {
    id: 'maintainer-focus',
    title: 'Maintainer focus',
    items: [
      {
        label: 'Dashboard layout lab',
        description: 'Slot contract and layout geometry in the component lab.',
        href: buildPlaygroundPath({ mode: 'lab', surfaceId: 'ui-dashboard-layout' }),
      },
      {
        label: 'Data grid lab',
        description: 'Schema-controlled maintainer preview for the grid surface.',
        href: buildPlaygroundPath({ mode: 'lab', surfaceId: 'ui-data-grid' }),
      },
      {
        label: 'Layout shell lab',
        description: 'Generic shell family remains separate from dashboard-specific composition.',
        href: buildPlaygroundPath({ mode: 'lab', surfaceId: 'ui-layout' }),
      },
    ],
  },
]);

const overviewCards = computed(() => [
  {
    title: 'Testing harness',
    description:
      'Stable integration routes stay in /testing for overlays, theme runtime, widgets, charts, data-grid, and page-template consumer proofs.',
    href: testingPath.value,
    actionLabel: 'Open /testing',
  },
  {
    title: 'Component lab',
    description:
      'Maintainers keep working in /lab with generated catalog coverage, schema controls, runtime registry, and usage output.',
    href: labPath.value,
    actionLabel: 'Open /lab',
  },
  {
    title: 'Dashboard template',
    description:
      'The root page now uses UiDashboardLayout directly instead of a custom ad hoc landing shell.',
    href: `${testingPath.value}#testing-page-templates`,
    actionLabel: 'See stable proof',
  },
]);

const spotlightLinks = computed(() => [
  {
    label: 'Overlays and motion',
    href: `${testingPath.value}#testing-overlays`,
  },
  {
    label: 'Core wave controls',
    href: `${testingPath.value}#testing-core-wave`,
  },
  {
    label: 'Charts and signal graph',
    href: `${testingPath.value}#testing-charts`,
  },
  {
    label: 'Widgets and composition',
    href: `${testingPath.value}#testing-composition`,
  },
]);
</script>

<template>
  <main class="playground-home" data-playground-app="ww-ui-kit" data-playground-mode="home">
    <UiDashboardLayout class="playground-home__dashboard">
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
              <h4>
                Stable testing routes and maintainer lab stay intact behind the new root shell.
              </h4>
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
          <nav class="playground-home__nav-shell" aria-label="Playground overview navigation">
            <UiVerticalLayout class="playground-home__nav-flow" gap="var(--ui-space-5)" scroll>
              <UiVerticalLayout
                v-for="group in navigationGroups"
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
                    :href="item.href"
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
            <a class="playground-home__cta playground-home__cta--secondary" :href="labPath">
              Open component lab
            </a>
          </UiVerticalLayout>
        </UiTsParticlesBackdrop>
      </template>

      <template #header>
        <div class="playground-workspace__header-line">
          <h2>{{ overviewPath }}</h2>
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

      <UiVerticalLayout class="playground-home__content-flow" gap="var(--ui-space-5)" scroll>
        <UiHorizontalLayout class="playground-home__lane" gap="var(--ui-space-4)" scroll>
          <UiCard
            v-for="card in overviewCards"
            :key="card.title"
            class="playground-dashboard-card playground-home__lane-card"
          >
            <template #header>
              <div class="playground-home__card-copy">
                <h2>{{ card.title }}</h2>
                <p>{{ card.description }}</p>
              </div>
            </template>

            <a class="playground-home__inline-link" :href="card.href">{{ card.actionLabel }}</a>
          </UiCard>
        </UiHorizontalLayout>

        <UiHorizontalLayout
          class="playground-home__lane playground-home__lane--wide"
          gap="var(--ui-space-4)"
          scroll
        >
          <UiCard
            class="playground-dashboard-card playground-home__lane-card playground-home__lane-card--wide"
          >
            <template #header>
              <div class="playground-home__card-copy">
                <h2>Runtime snapshot</h2>
                <p>
                  Theme runtime remains shared across the overview dashboard, testing harness, and
                  component lab.
                </p>
              </div>
            </template>

            <UiHorizontalLayout
              class="playground-home__runtime-flow"
              gap="var(--ui-space-4)"
              scroll
            >
              <div class="playground-home__runtime-panel">
                <strong>Current family</strong>
                <p>
                  {{ props.themeMeta.label }} keeps the preview root in sync with theme metadata.
                </p>
              </div>
              <div class="playground-home__runtime-panel">
                <strong>Current motion</strong>
                <p>
                  {{ props.themeRuntime.motionProfile }} stays global until a subtree overrides it.
                </p>
              </div>
              <div class="playground-home__runtime-panel">
                <strong>Current density</strong>
                <p>
                  {{ props.themeRuntime.density }} applies to cards, controls, and shells together.
                </p>
              </div>
            </UiHorizontalLayout>
          </UiCard>

          <UiCard
            class="playground-dashboard-card playground-home__lane-card playground-home__lane-card--wide"
          >
            <template #header>
              <div class="playground-home__card-copy">
                <h2>Spotlight links</h2>
                <p>Jump directly into the stable proof sections that back the public contracts.</p>
              </div>
            </template>

            <UiVerticalLayout class="playground-home__spotlight-flow" gap="var(--ui-space-3)">
              <a
                v-for="item in spotlightLinks"
                :key="item.label"
                class="playground-home__spotlight-link"
                :href="item.href"
              >
                {{ item.label }}
              </a>
            </UiVerticalLayout>
          </UiCard>
        </UiHorizontalLayout>
      </UiVerticalLayout>
    </UiDashboardLayout>
  </main>
</template>
