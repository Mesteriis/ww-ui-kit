import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { addons } from 'storybook/manager-api';

import { setTheme } from '@ww/themes';

import { createStorybookManagerTheme, resolveStorybookThemeName } from './storybookManagerTheme.ts';

import '@ww/themes/theme-light.css';
import '@ww/themes/theme-dark.css';
import '@ww/themes/theme-belovodye.css';

type GlobalsPayload = {
  globals?: {
    theme?: unknown;
  };
  userGlobals?: {
    theme?: unknown;
  };
  initialGlobals?: {
    theme?: unknown;
  };
};

const MANAGER_STATIC_CONFIG = {
  panelPosition: 'right' as const,
  rightPanelWidth: 440,
  selectedPanel: 'storybook/docs/panel',
  showTabs: true,
  showToolbar: true,
  sidebar: {
    showRoots: true,
  },
};

const applyManagerTheme = (nextThemeName?: unknown, includeStaticConfig = false) => {
  const themeName = resolveStorybookThemeName(nextThemeName);

  setTheme(themeName, document.documentElement);
  addons.setConfig({
    ...(includeStaticConfig ? MANAGER_STATIC_CONFIG : {}),
    theme: createStorybookManagerTheme(themeName),
  });
};

applyManagerTheme(undefined, true);

addons.register('ww/storybook-manager-theme-sync', (api) => {
  applyManagerTheme(api.getGlobals().theme);

  const channel = addons.getChannel();
  channel.on(GLOBALS_UPDATED, (payload: GlobalsPayload) => {
    applyManagerTheme(
      payload.globals?.theme ?? payload.userGlobals?.theme ?? payload.initialGlobals?.theme
    );
  });
});
