import type { Meta } from '@storybook/vue3-vite';

import uiProgressLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-progress.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiProgress',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiProgressLabDefinition, {
  description:
    'Review linear and circular progress states, including indeterminate feedback, and copy the exact progress payload.',
  guideTitle: 'Core/Scenarios/Display',
  name: 'Workbench',
  surfaceId: 'ui-progress',
});
