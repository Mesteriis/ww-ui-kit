import type { Meta } from '@storybook/vue3-vite';

import uiTextareaLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-textarea.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiTextarea',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiTextareaLabDefinition, {
  description:
    'Review long-form field states, adjust row density, and copy the textarea usage snippet directly from Storybook.',
  guideTitle: 'Core/Scenarios/Fields',
  name: 'Workbench',
  surfaceId: 'ui-textarea',
});
