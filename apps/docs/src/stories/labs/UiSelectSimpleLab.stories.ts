import type { Meta } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';

import uiSelectSimpleLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-select-simple.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiSelectSimple',
  tags: ['autodocs', 'test'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiSelectSimpleLabDefinition, {
  description:
    'Exercise compact select states, validate field-context wiring, and copy the snippet with the governed options payload.',
  guideTitle: 'Core/Scenarios/Fields',
  name: 'Workbench',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Variant matrix' }));
    await expect(canvas.getByText('select / invalid')).toBeVisible();

    await userEvent.selectOptions(canvas.getByLabelText('Copy format'), 'vue');
    await expect(canvas.getByText(/:options="options"/)).toBeVisible();
  },
  surfaceId: 'ui-select-simple',
});
