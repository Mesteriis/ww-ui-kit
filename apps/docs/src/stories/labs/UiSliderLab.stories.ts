import type { Meta } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';

import uiSliderLabDefinition from '../../../../../apps/playground/src/lab/schemas/ui-slider.lab';

import { createStorybookLabStory } from '../lab/createStorybookLabStory';

const meta = {
  title: 'Core/Labs/UiSlider',
  tags: ['autodocs', 'test'],
} satisfies Meta;

export default meta;

export const Workbench = createStorybookLabStory(uiSliderLabDefinition, {
  description:
    'Tune slider range, tooltip policy, and vertical or horizontal review states, then copy the field-safe snippet.',
  guideTitle: 'Core/Scenarios/Fields',
  name: 'Workbench',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Variant matrix' }));
    await expect(canvas.getByText('vertical / invalid')).toBeVisible();

    await userEvent.selectOptions(canvas.getByLabelText('Copy format'), 'vue');
    await expect(canvas.getByText(/:model-value="65"/)).toBeVisible();
  },
  surfaceId: 'ui-slider',
});
