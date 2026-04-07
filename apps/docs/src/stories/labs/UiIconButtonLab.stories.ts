import type { Meta } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';

import uiIconButtonLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-icon-button.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiIconButton',
  tags: ['autodocs', 'test'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiIconButtonLabDefinition, {
  description:
    'Exercise compact icon-only actions with loading and danger states, then copy a snippet that already includes accessibility labels.',
  guideTitle: 'Core/Scenarios/Buttons',
  name: 'Workbench',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Variant matrix' }));
    await expect(canvas.getByText('danger / loading')).toBeVisible();

    await userEvent.selectOptions(canvas.getByLabelText('Copy format'), 'vue');
    await expect(canvas.getByText(/aria-label="Open inspector"/)).toBeVisible();
  },
  surfaceId: 'ui-icon-button',
});
