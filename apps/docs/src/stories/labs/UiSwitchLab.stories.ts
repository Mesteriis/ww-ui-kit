import type { Meta } from '@storybook/vue3-vite';

import uiSwitchLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-switch.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiSwitch',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiSwitchLabDefinition, {
  description:
    'Validate compact on/off settings with checked and disabled states, then copy the smallest usable switch snippet.',
  guideTitle: 'Core/Scenarios/Selection',
  name: 'Workbench',
  surfaceId: 'ui-switch',
});
