import type { Preview } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import { create } from 'storybook/theming';
import { INITIAL_VIEWPORTS, responsiveViewport } from 'storybook/viewport';

import { THEME_NAMES, getThemeMeta, setTheme, type ThemeName } from '@ww/themes';
import { UiBadge, UiButton, UiCard, UiDrawer, UiField, UiSelectSimple, UiSwitch } from '@ww/core';
import { UiDashboardLayout } from '@ww/page-templates';

import { getStoryShellMeta } from './storyShellMeta.ts';

import '@ww/themes/theme-light.css';
import '@ww/themes/theme-dark.css';
import '@ww/themes/theme-belovodye.css';
import '@ww/core/styles.css';
import '@ww/charts-apex/styles.css';
import '@ww/signal-graph/styles.css';
import '@ww/data-grid/styles.css';
import '@ww/interaction/styles.css';
import '@ww/tsparticles/styles.css';
import '@ww/widgets/styles.css';
import '@ww/page-templates/styles.css';

const themeToolbarItems = THEME_NAMES.map((themeName) => {
  const theme = getThemeMeta(themeName);
  return {
    title: `${theme.label} · ${theme.type}`,
    value: theme.name,
  };
});

const storybookDocsTheme = create({
  base: 'dark',
  colorPrimary: '#6ef2dc',
  colorSecondary: '#ff8d96',
  appBg: '#050f18',
  appContentBg: 'rgba(8, 22, 34, 0.98)',
  appBorderColor: 'rgba(118, 176, 201, 0.34)',
  appBorderRadius: 14,
  textColor: '#e2e8f0',
  textInverseColor: '#020617',
  barBg: 'rgba(10, 24, 36, 0.88)',
  barTextColor: '#cbd5e1',
  barSelectedColor: '#6ef2dc',
  inputBg: 'rgba(8, 22, 34, 0.82)',
  inputBorder: 'rgba(118, 176, 201, 0.34)',
  inputTextColor: '#f8fafc',
  inputBorderRadius: 999,
  brandTitle: 'Willow Works UI Kit',
});

const preview: Preview = {
  decorators: [
    (story, context) => {
      const root = document.documentElement;
      const currentTheme = getThemeMeta(context.globals.theme as ThemeName);
      setTheme(currentTheme.name, root);
      const disableShell = context.parameters.storyShell === false;

      if (disableShell) {
        return {
          components: {
            story,
          },
          template: `
            <div style="min-height: 100dvh;">
              <story />
            </div>
          `,
        };
      }

      const storyTitle = context.title;
      const sectionLabel = context.title.includes('/')
        ? context.title.slice(0, context.title.indexOf('/'))
        : context.title;
      const storyLabel = context.name;
      const storyMeta = getStoryShellMeta(storyTitle, storyLabel);

      return {
        components: {
          UiBadge,
          UiButton,
          UiCard,
          UiDashboardLayout,
          UiDrawer,
          UiField,
          UiSelectSimple,
          UiSwitch,
          story,
        },
        setup() {
          const settingsOpen = ref(false);
          const showContextCard = ref(false);
          const showRuntimeCard = ref(false);
          const selectedVariant = ref(storyMeta.options[0]?.value ?? '');
          const selectedVariantLabel = computed(
            () =>
              storyMeta.options.find((option) => option.value === selectedVariant.value)?.label ??
              'No registered variants'
          );

          return {
            currentTheme,
            selectedVariant,
            selectedVariantLabel,
            sectionLabel,
            settingsOpen,
            showContextCard,
            showRuntimeCard,
            storyLabel,
            storyId: context.id,
            storyOptions: storyMeta.options,
          };
        },
        template: `
          <div style="min-height: 100dvh;">
            <UiDashboardLayout>
              <template #aside-header>
                <div style="display: grid; gap: var(--ui-space-3);">
                  <div
                    style="
                      display: inline-grid;
                      place-items: center;
                      inline-size: 3rem;
                      block-size: 3rem;
                      border-radius: var(--ui-radius-lg);
                      border: 1px solid var(--ui-border-subtle);
                      background: color-mix(in srgb, var(--ui-surface-brand-soft) 62%, var(--ui-surface-default));
                      font-weight: 700;
                      letter-spacing: var(--ui-text-letter-spacing-label);
                    "
                  >
                    WW
                  </div>
                  <div style="display: grid; gap: var(--ui-space-2);">
                    <strong>Storybook shell</strong>
                    <p style="margin: 0; color: var(--ui-text-secondary);">
                      Belovodye dashboard framing for every public proof.
                    </p>
                  </div>
                </div>
              </template>

              <template #aside-content>
                <div style="display: grid; gap: var(--ui-space-4);">
                  <UiCard v-if="showContextCard">
                    <template #header>Context</template>
                    <div style="display: grid; gap: var(--ui-space-2);">
                      <div class="ui-cluster">
                        <UiBadge variant="brand">Section</UiBadge>
                        <code>{{ sectionLabel }}</code>
                      </div>
                      <div class="ui-cluster">
                        <UiBadge>Story</UiBadge>
                        <code>{{ storyLabel }}</code>
                      </div>
                    </div>
                  </UiCard>

                  <UiCard v-if="showRuntimeCard">
                    <template #header>Runtime</template>
                    <div style="display: grid; gap: var(--ui-space-2);">
                      <div class="ui-cluster">
                        <UiBadge variant="success">Theme</UiBadge>
                        <span>{{ currentTheme.label }}</span>
                      </div>
                      <div class="ui-cluster">
                        <UiBadge variant="warning">Type</UiBadge>
                        <span>{{ currentTheme.type }}</span>
                      </div>
                      <code>{{ storyId }}</code>
                    </div>
                  </UiCard>
                </div>
              </template>

              <template #aside-actions>
                <div style="display: grid; gap: var(--ui-space-2); color: var(--ui-text-secondary);">
                  <small>Keyboard flow and focus contracts stay inside each story surface.</small>
                </div>
              </template>

              <template #header>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    gap: var(--ui-space-3);
                    min-block-size: 100%;
                  "
                >
                  <UiBadge variant="info">Storybook Preview</UiBadge>
                  <strong>{{ sectionLabel }} / {{ storyLabel }}</strong>
                </div>
              </template>

              <div style="display: grid; gap: var(--ui-space-4);">
                <UiCard
                  style="
                    display: grid;
                    gap: var(--ui-space-3);
                    padding: var(--ui-space-4);
                  "
                >
                  <div
                    style="
                      display: grid;
                      gap: var(--ui-space-3);
                      grid-template-columns: minmax(0, 1fr) auto;
                      align-items: end;
                    "
                  >
                    <UiField
                      label="All invariants"
                      hint="Registered coverage for the current element page"
                    >
                      <UiSelectSimple
                        v-model="selectedVariant"
                        aria-label="Registered variants for the current element"
                        :options="storyOptions"
                      />
                    </UiField>
                    <UiButton variant="secondary" @click="settingsOpen = true">Settings</UiButton>
                  </div>

                  <div class="ui-cluster">
                    <UiBadge variant="brand">Selected</UiBadge>
                    <span>{{ selectedVariantLabel }}</span>
                    <UiBadge>{{ storyOptions.length }}</UiBadge>
                  </div>
                </UiCard>

                <story />
              </div>
            </UiDashboardLayout>

            <UiDrawer
              v-model:open="settingsOpen"
              title="Story shell settings"
              description="Preview controls stay outside the story surface and keep component proofs clean."
              side="right"
            >
              <div style="display: grid; gap: var(--ui-space-4);">
                <UiField label="Registered variants" hint="Coverage mapped to the current element page">
                  <UiSelectSimple
                    v-model="selectedVariant"
                    aria-label="Registered variants for the current element"
                    :options="storyOptions"
                  />
                </UiField>

                <UiCard>
                  <template #header>Shell visibility</template>
                  <div style="display: grid; gap: var(--ui-space-3);">
                    <UiSwitch v-model="showContextCard" ariaLabel="Show context card">
                      Show context card
                    </UiSwitch>
                    <UiSwitch v-model="showRuntimeCard" ariaLabel="Show runtime card">
                      Show runtime card
                    </UiSwitch>
                  </div>
                </UiCard>

                <UiCard>
                  <template #header>Runtime snapshot</template>
                  <div style="display: grid; gap: var(--ui-space-2);">
                    <div class="ui-cluster">
                      <UiBadge variant="brand">Story</UiBadge>
                      <code>{{ storyLabel }}</code>
                    </div>
                    <div class="ui-cluster">
                      <UiBadge variant="success">Theme</UiBadge>
                      <span>{{ currentTheme.label }}</span>
                    </div>
                    <div class="ui-cluster">
                      <UiBadge variant="warning">Type</UiBadge>
                      <span>{{ currentTheme.type }}</span>
                    </div>
                    <code>{{ storyId }}</code>
                  </div>
                </UiCard>
              </div>

              <template #footer>
                <UiButton variant="secondary" @click="settingsOpen = false">Close</UiButton>
              </template>
            </UiDrawer>
          </div>
        `,
      };
    },
  ],
  globalTypes: {
    theme: {
      defaultValue: 'belovodye',
      description: 'Preview theme',
      toolbar: {
        dynamicTitle: true,
        items: themeToolbarItems,
      },
    },
  },
  parameters: {
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      options: {
        appCanvas: {
          name: 'App canvas',
          value: '#06121a',
        },
        paper: {
          name: 'Paper',
          value: '#f8fafc',
        },
        slate: {
          name: 'Slate',
          value: '#0f172a',
        },
      },
    },
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      canvas: {
        sourceState: 'shown',
        withToolbar: 'open',
      },
      codePanel: true,
      source: {
        excludeDecorators: true,
        type: 'dynamic',
      },
      theme: storybookDocsTheme,
      toc: {
        headingSelector: 'h1, h2, h3',
        title: 'On this page',
      },
    },
    layout: 'fullscreen',
    options: {
      storySort: {
        order: [
          'Public Surfaces',
          'Primitive',
          'Core',
          'Foundations',
          'Systems',
          'Widgets',
          'Page Templates',
          'Workspace',
          'Architecture',
          'Maintainers',
        ],
      },
    },
    viewport: {
      options: {
        responsive: responsiveViewport,
        mobile: INITIAL_VIEWPORTS.iphonex,
        tablet: INITIAL_VIEWPORTS.ipad,
        workstation: {
          name: 'Workstation',
          styles: {
            height: '900px',
            width: '1440px',
          },
          type: 'desktop',
        },
      },
    },
  },
};

export default preview;
