import type { Preview } from '@storybook/vue3';

import { THEME_NAMES, getThemeMeta, setTheme, type ThemeName } from '@ww/themes';

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

const preview: Preview = {
  decorators: [
    (story, context) => {
      const root = document.documentElement;
      const currentTheme = getThemeMeta(context.globals.theme as ThemeName);
      setTheme(currentTheme.name, root);
      return {
        components: { story },
        setup() {
          return {
            currentTheme,
          };
        },
        template: `
          <div style="display: grid; gap: var(--ui-space-4);">
            <div
              style="
                display: inline-flex;
                gap: var(--ui-space-3);
                align-items: center;
                width: fit-content;
                padding: var(--ui-space-3) var(--ui-space-4);
                border: 1px solid var(--ui-border-subtle);
                border-radius: var(--ui-radius-pill);
                background: color-mix(in srgb, var(--ui-surface-default) 92%, transparent);
                color: var(--ui-text-secondary);
                font-size: var(--ui-text-font-size-sm);
              "
            >
              <strong style="color: var(--ui-text-primary);">Theme</strong>
              <span>{{ currentTheme.label }}</span>
              <span>/</span>
              <strong style="color: var(--ui-text-primary);">Type</strong>
              <span>{{ currentTheme.type }}</span>
            </div>
            <div style="padding: var(--ui-space-6);">
              <story />
            </div>
          </div>
        `,
      };
    },
  ],
  globalTypes: {
    theme: {
      defaultValue: 'light',
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
    controls: {
      expanded: true,
    },
  },
};

export default preview;
