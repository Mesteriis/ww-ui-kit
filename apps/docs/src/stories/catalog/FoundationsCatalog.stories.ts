import type { Meta } from '@storybook/vue3-vite';

import { createCatalogStory } from './createCatalogStory';

const meta = {
  title: 'Foundations',
} satisfies Meta;

export default meta;

export const UiApexChart = createCatalogStory('@ww/charts-apex');
export const UiTsParticlesBackdrop = createCatalogStory('@ww/tsparticles');
