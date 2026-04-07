import type { Meta } from '@storybook/vue3-vite';

import uiCheckboxLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-checkbox.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiCheckbox',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiCheckboxLabDefinition, {
  description:
    'Review binary selection with checked, disabled, and invalid states, then copy the checkbox surface in its public API shape.',
  guideTitle: 'Core/Scenarios/Selection',
  name: 'Workbench',
  surfaceId: 'ui-checkbox',
});
