import type { Meta } from '@storybook/vue3-vite';

import uiNumberInputLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-number-input.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiNumberInput',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiNumberInputLabDefinition, {
  description:
    'Tune numeric constraints, empty-state behavior, and readonly or invalid states, then copy the exact prop payload.',
  guideTitle: 'Core/Scenarios/Fields',
  name: 'Workbench',
  surfaceId: 'ui-number-input',
});
