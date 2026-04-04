import { h } from 'vue';

import { UiBadge, UiCard, UiScrollArea } from '@ww/core';

import type { LabMatrixItem, LabSurfaceDefinition } from '../manifest/component-lab.types';
import { buildThemeScopeAttrs, themeScopeOptions } from '../runtime/schema-helpers';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiScrollAreaLabState = {
  orientation: 'vertical' | 'horizontal' | 'both';
  visibility: 'auto' | 'always' | 'hover';
  maxHeight: number;
  maxWidth: number;
  label: string;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const defaultState: Readonly<UiScrollAreaLabState> = Object.freeze({
  label: 'Scrollable release proof',
  matrixPresets: ['vertical', 'horizontal', 'hover'],
  maxHeight: 240,
  maxWidth: 320,
  orientation: 'vertical',
  subtreeTheme: 'inherit',
  visibility: 'auto',
});

const definition: LabSurfaceDefinition<UiScrollAreaLabState> = createSimpleSurfaceDefinition({
  id: 'ui-scroll-area',
  title: 'UiScrollArea',
  description:
    'Governed scroll-region surface with tokenized scrollbar styling and exposed viewport methods.',
  packageName: '@ww/core',
  exportName: 'UiScrollArea',
  defaultState,
  controlSections: [
    {
      id: 'surface',
      title: 'Scroll surface',
      controls: [
        {
          id: 'orientation',
          kind: 'segment',
          label: 'Orientation',
          options: [
            { label: 'Vertical', value: 'vertical' },
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Both', value: 'both' },
          ],
        },
        {
          id: 'visibility',
          kind: 'segment',
          label: 'Scrollbar',
          options: [
            { label: 'Auto', value: 'auto' },
            { label: 'Always', value: 'always' },
            { label: 'Hover', value: 'hover' },
          ],
        },
        { id: 'maxHeight', kind: 'number', label: 'Max height', min: 120, max: 360, step: 20 },
        { id: 'maxWidth', kind: 'number', label: 'Max width', min: 220, max: 520, step: 20 },
        { id: 'label', kind: 'text', label: 'ARIA label' },
      ],
    },
    {
      id: 'theme',
      title: 'Theme scope',
      controls: [
        { id: 'subtreeTheme', kind: 'select', label: 'Theme scope', options: themeScopeOptions },
      ],
    },
    {
      id: 'matrix',
      title: 'Matrix filters',
      controls: [
        {
          id: 'matrixPresets',
          kind: 'multi-toggle',
          label: 'Presets',
          options: [
            { label: 'Vertical', value: 'vertical' },
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Hover', value: 'hover' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) => {
    const items: LabMatrixItem<UiScrollAreaLabState>[] = [];

    if (state.matrixPresets.includes('vertical')) {
      items.push({ id: 'vertical', title: 'Vertical region', patch: {} });
    }

    if (state.matrixPresets.includes('horizontal')) {
      items.push({
        id: 'horizontal',
        title: 'Horizontal rail',
        patch: {
          orientation: 'horizontal',
          visibility: 'always',
        },
      });
    }

    if (state.matrixPresets.includes('hover')) {
      items.push({
        id: 'hover',
        title: 'Hover scrollbar',
        patch: {
          visibility: 'hover',
        },
      });
    }

    return items;
  },
  component: UiScrollArea,
  buildComponentProps: (state) => ({
    ariaLabel: state.label,
    maxHeight: state.maxHeight,
    maxWidth: state.maxWidth,
    orientation: state.orientation,
    visibility: state.visibility,
  }),
  buildPreviewSlots: (state) => ({
    default: () =>
      state.orientation === 'horizontal'
        ? h(
            'div',
            {
              style:
                'display: flex; gap: var(--ui-space-3); inline-size: max-content; padding-block: var(--ui-space-1);',
            },
            [
              h(UiBadge, { variant: 'brand' }, () => 'Contracts'),
              h(UiBadge, { variant: 'success' }, () => 'Stories'),
              h(UiBadge, { variant: 'warning' }, () => 'Harness'),
              h(UiBadge, { variant: 'danger' }, () => 'Verify'),
              h(UiCard, null, () => 'Horizontal scroll proof'),
            ]
          )
        : Array.from({ length: 4 }, (_, index) =>
            h(
              UiCard,
              { key: index },
              {
                header: () => `Scrollable card ${index + 1}`,
                default: () =>
                  'Scroll regions stay reusable without pulling shell layout behavior into @ww/core.',
              }
            )
          ),
  }),
  buildWrapperAttrs: (state, context) => ({
    ...buildThemeScopeAttrs(state, context),
    ...(state.orientation === 'horizontal'
      ? { style: `max-inline-size: ${state.maxWidth}px;` }
      : {}),
  }),
  buildSnippetProps: (state) => ({
    ariaLabel: state.label,
    ...(state.orientation !== 'vertical' ? { orientation: state.orientation } : {}),
    ...(state.visibility !== 'auto' ? { visibility: state.visibility } : {}),
    ...(state.maxHeight !== 240 ? { maxHeight: state.maxHeight } : {}),
    ...(state.maxWidth !== 320 ? { maxWidth: state.maxWidth } : {}),
  }),
  buildSnippetSlots: (state) => [
    {
      content: () =>
        state.orientation === 'horizontal'
          ? [
              '<div style="display: flex; gap: var(--ui-space-3); inline-size: max-content;">',
              '  <span>Contracts</span>',
              '  <span>Stories</span>',
              '  <span>Harness</span>',
              '  <span>Verify</span>',
              '</div>',
            ].join('\n')
          : [
              '<div style="display: grid; gap: var(--ui-space-3);">',
              '  <section>Scroll proof one</section>',
              '  <section>Scroll proof two</section>',
              '  <section>Scroll proof three</section>',
              '</div>',
            ].join('\n'),
    },
  ],
});

export default definition;
