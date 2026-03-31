import { createApp } from 'vue';

import { patchThemeRuntime } from '@ww/themes';

import '@ww/themes/theme-light.css';
import '@ww/themes/theme-dark.css';
import '@ww/themes/theme-belovodye.css';
import '@ww/core/styles.css';
import '@ww/charts-apex/styles.css';
import '@ww/signal-graph/styles.css';
import '@ww/data-grid/styles.css';
import '@ww/widgets/styles.css';
import '@ww/page-templates/styles.css';
import './style.css';

import App from './App.vue';
import { readPlaygroundThemePreferences } from './theme-preferences';

const initialThemePreferences = readPlaygroundThemePreferences();

patchThemeRuntime({
  themeName: initialThemePreferences.themeName,
  density: initialThemePreferences.density,
  motionProfile: initialThemePreferences.motionProfile,
  personality: initialThemePreferences.personality,
});

createApp(App).mount('#app');
