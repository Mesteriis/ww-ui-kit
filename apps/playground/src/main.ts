import { createApp } from 'vue';

import { setTheme } from '@ww/themes';

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

setTheme('belovodye');

createApp(App).mount('#app');
