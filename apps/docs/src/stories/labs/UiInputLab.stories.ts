import type { Meta } from '@storybook/vue3-vite';

import uiInputLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-input.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiInput',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiInputLabDefinition, {
  description:
    'Tune field context, input props, and invalid states, then copy the exact Vue snippet without playground-only wrappers.',
  guideTitle: 'Core/Scenarios/Fields',
  name: 'Workbench',
  surfaceId: 'ui-input',
});
