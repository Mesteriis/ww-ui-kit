import type { Meta } from '@storybook/vue3-vite';

import { createCatalogStory } from './createCatalogStory';

const meta = {
  title: 'Systems',
} satisfies Meta;

export default meta;

const createDataGridStory = () => createCatalogStory('@ww/data-grid');
const createInteractionStory = () => createCatalogStory('@ww/interaction');
const createSignalGraphStory = () => createCatalogStory('@ww/signal-graph');

export const UiDataGrid = createDataGridStory();
export const UiDataGridToolbar = createDataGridStory();
export const UiDataGridSearch = createDataGridStory();
export const UiDataGridFilters = createDataGridStory();
export const UiDataGridTable = createDataGridStory();
export const UiDataGridPagination = createDataGridStory();
export const UiDataGridBulkActions = createDataGridStory();
export const UiDataGridColumnVisibility = createDataGridStory();

export const UiVirtualScroll = createInteractionStory();
export const UiVirtualList = createInteractionStory();
export const UiInfiniteScroll = createInteractionStory();
export const UiForm = createInteractionStory();
export const UiFormItem = createInteractionStory();
export const UiTree = createInteractionStory();
export const UiTreeSelect = createInteractionStory();
export const UiCascader = createInteractionStory();
export const UiTransfer = createInteractionStory();
export const UiUpload = createInteractionStory();
export const UiTour = createInteractionStory();

export const UiSignalGraph = createSignalGraphStory();
