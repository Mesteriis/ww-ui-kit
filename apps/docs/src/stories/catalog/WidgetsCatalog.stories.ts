import type { Meta } from '@storybook/vue3-vite';

import { createCatalogStory } from './createCatalogStory';

const meta = {
  title: 'Widgets',
} satisfies Meta;

export default meta;

const createWidgetStory = () => createCatalogStory('@ww/widgets');

export const DataTableWidget = createWidgetStory();
export const UiWidgetShell = createWidgetStory();
export const UiWidgetHeader = createWidgetStory();
export const UiWidgetBody = createWidgetStory();
export const UiWidgetFooter = createWidgetStory();
