import type { Meta } from '@storybook/vue3-vite';

import uiScrollAreaLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-scroll-area.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiScrollArea',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiScrollAreaLabDefinition, {
  description:
    'Inspect governed scroll-region behavior across orientations and theme scopes, then copy a snippet without shell-only framing.',
  guideTitle: 'Core/Scenarios/Layout',
  name: 'Workbench',
  surfaceId: 'ui-scroll-area',
});
