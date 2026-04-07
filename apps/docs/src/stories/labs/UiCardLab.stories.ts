import type { Meta } from '@storybook/vue3-vite';

import uiCardLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-card.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiCard',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiCardLabDefinition, {
  description:
    'Compose header, body, and footer arrangements for the baseline container surface and copy the slot structure directly.',
  guideTitle: 'Core/Scenarios/Display',
  name: 'Workbench',
  surfaceId: 'ui-card',
});
