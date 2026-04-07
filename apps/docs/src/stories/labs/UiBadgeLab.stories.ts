import type { Meta } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';

import uiBadgeLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-badge.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiBadge',
  tags: ['autodocs', 'test'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiBadgeLabDefinition, {
  description:
    'Review compact status emphasis across badge variants and copy the minimal, text-first snippet from Storybook.',
  guideTitle: 'Core/Scenarios/Display',
  name: 'Workbench',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Variant matrix' }));
    await expect(canvas.getByText('warning / badge')).toBeVisible();

    await userEvent.selectOptions(canvas.getByLabelText('Copy format'), 'vue');
    await expect(canvas.getByText(/variant="brand"/)).toBeVisible();
  },
  surfaceId: 'ui-badge',
});
