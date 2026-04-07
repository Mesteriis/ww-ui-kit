import type { Meta } from '@storybook/vue3-vite';

import uiAvatarLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-avatar.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiAvatar',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiAvatarLabDefinition, {
  description:
    'Tune avatar size, shape, tone, and fallback mode, then copy a prop-only snippet that stays safe for product surfaces.',
  guideTitle: 'Core/Scenarios/Display',
  name: 'Workbench',
  surfaceId: 'ui-avatar',
});
