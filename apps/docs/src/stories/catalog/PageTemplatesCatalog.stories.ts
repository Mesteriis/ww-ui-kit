import type { Meta } from '@storybook/vue3-vite';

import { createCatalogStory } from './createCatalogStory';

const meta = {
  title: 'Page Templates',
} satisfies Meta;

export default meta;

const createPageTemplateStory = () => createCatalogStory('@ww/page-templates');

export const UiDashboardLayout = createPageTemplateStory();
export const UiLayout = createPageTemplateStory();
export const UiLayoutHeader = createPageTemplateStory();
export const UiLayoutSider = createPageTemplateStory();
export const UiLayoutContent = createPageTemplateStory();
export const UiLayoutFooter = createPageTemplateStory();
export const UiLayoutSection = createPageTemplateStory();
export const UiLayoutToolbar = createPageTemplateStory();
export const UiVerticalLayout = createPageTemplateStory();
export const UiHorizontalLayout = createPageTemplateStory();
