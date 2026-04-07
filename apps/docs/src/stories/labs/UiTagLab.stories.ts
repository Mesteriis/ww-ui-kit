import type { Meta } from '@storybook/vue3-vite';

import uiTagLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-tag.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiTag',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiTagLabDefinition, {
  description:
    'Tune tag appearance, size, icon, and pill behavior, then copy a snippet that stays inside the public API surface.',
  guideTitle: 'Core/Scenarios/Display',
  name: 'Workbench',
  surfaceId: 'ui-tag',
});
