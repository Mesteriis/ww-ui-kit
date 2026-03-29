import { h } from 'vue';

import { UiButton, UiEmptyState } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { createSimpleMatrix } from '../runtime/schema-helpers';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiEmptyStateLabState = {
  title: string;
  description: string;
  iconGlyph: string;
  showIcon: boolean;
  showActions: boolean;
  matrixLayouts: readonly string[];
};

const defaultState: Readonly<UiEmptyStateLabState> = Object.freeze({
  title: 'No linked results',
  description: 'Use the empty state surface to keep feedback readable and action-oriented.',
  iconGlyph: '◇',
  showIcon: true,
  showActions: true,
  matrixLayouts: ['content-only', 'icon-content', 'icon-content-actions'],
});

const definition: LabSurfaceDefinition<UiEmptyStateLabState> = createSimpleSurfaceDefinition({
  id: 'ui-empty-state',
  title: 'UiEmptyState',
  description: 'Feedback surface for empty, error, and no-results messaging.',
  packageName: '@ww/core',
  exportName: 'UiEmptyState',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'title', kind: 'text', label: 'Title' },
        { id: 'description', kind: 'text', label: 'Description' },
        { id: 'iconGlyph', kind: 'text', label: 'Icon glyph' },
      ],
    },
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        { id: 'showIcon', kind: 'boolean', label: 'Show icon' },
        { id: 'showActions', kind: 'boolean', label: 'Show actions' },
      ],
    },
    {
      id: 'matrix',
      title: 'Matrix filters',
      controls: [
        {
          id: 'matrixLayouts',
          kind: 'multi-toggle',
          label: 'Layouts',
          options: [
            { label: 'Content only', value: 'content-only' },
            { label: 'Icon + content', value: 'icon-content' },
            { label: 'Icon + content + actions', value: 'icon-content-actions' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) =>
    createSimpleMatrix(state.matrixLayouts, ['empty-state'], (layout) => ({
      showIcon: layout !== 'content-only',
      showActions: layout === 'icon-content-actions',
    })),
  component: UiEmptyState,
  buildComponentProps: (state) => ({
    title: state.title,
    description: state.description,
  }),
  buildPreviewSlots: (state) => ({
    ...(state.showIcon ? { icon: () => state.iconGlyph } : {}),
    ...(state.showActions
      ? {
          actions: () => [
            h(
              UiButton,
              {
                variant: 'secondary',
                size: 'sm',
              },
              () => 'Review usage'
            ),
            h(
              UiButton,
              {
                size: 'sm',
              },
              () => 'Retry'
            ),
          ],
        }
      : {}),
  }),
  buildSnippetProps: (state) => ({
    title: state.title,
    ...(state.description ? { description: state.description } : {}),
  }),
  buildSnippetSlots: (state) => [
    ...(state.showIcon ? [{ name: 'icon', content: () => state.iconGlyph }] : []),
    ...(state.showActions
      ? [
          {
            name: 'actions',
            content: () => '<UiButton variant="secondary" size="sm">Review usage</UiButton>',
          },
        ]
      : []),
  ],
});

export default definition;
