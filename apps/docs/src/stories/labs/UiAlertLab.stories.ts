import type { Meta } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';

import uiAlertLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-alert.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiAlert',
  tags: ['autodocs', 'test'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiAlertLabDefinition, {
  description:
    'Review feedback semantics across alert types and appearances, then copy a clean prop-only snippet for product code.',
  guideTitle: 'Core/Scenarios/Feedback',
  name: 'Workbench',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Variant matrix' }));
    await expect(canvas.getByText('warning / outline')).toBeVisible();

    await userEvent.selectOptions(canvas.getByLabelText('Copy format'), 'vue');
    await expect(canvas.getByText(/title="Contract review pending"/)).toBeVisible();
  },
  surfaceId: 'ui-alert',
});
