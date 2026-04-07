import type { Meta } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';

import uiButtonLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-button.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiButton',
  tags: ['autodocs', 'test'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiButtonLabDefinition, {
  description:
    'Configure button variants, inspect the governed review matrix, and copy a Vue-ready snippet directly from Storybook.',
  guideTitle: 'Core/Scenarios/Buttons',
  name: 'Workbench',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.selectOptions(canvas.getByLabelText('Copy format'), 'vue');
    await expect(canvas.getByText(/<UiButton/)).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Variant matrix' }));
    await expect(canvas.getByText('primary / default')).toBeVisible();
  },
  surfaceId: 'ui-button',
});
