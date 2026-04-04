import { h } from 'vue';

import { UiButton, UiSpace } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { buildThemeScopeAttrs, themeScopeOptions } from '../runtime/schema-helpers';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiSpaceLabState = {
  direction: 'horizontal' | 'vertical';
  size: '1' | '2' | '3' | '4' | '5' | '6';
  align: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  wrap: boolean;
  compact: boolean;
  block: boolean;
  separatorStyle: 'none' | 'slash' | 'dot';
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const directionOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
] as const;

const sizeOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
] as const;

const alignOptions = [
  { label: 'Start', value: 'start' },
  { label: 'Center', value: 'center' },
  { label: 'End', value: 'end' },
  { label: 'Stretch', value: 'stretch' },
  { label: 'Baseline', value: 'baseline' },
] as const;

const separatorMap = {
  none: '',
  slash: '/',
  dot: '•',
} as const;

const defaultState: Readonly<UiSpaceLabState> = Object.freeze({
  align: 'center',
  block: false,
  compact: false,
  direction: 'horizontal',
  matrixPresets: ['inline', 'separator', 'compact', 'vertical'],
  separatorStyle: 'dot',
  size: '3',
  subtreeTheme: 'inherit',
  wrap: false,
});

const definition: LabSurfaceDefinition<UiSpaceLabState> = createSimpleSurfaceDefinition({
  id: 'ui-space',
  title: 'UiSpace',
  description:
    'Token-driven spacing utility for grouped actions, inline metadata, separators, and compact seams.',
  packageName: '@ww/core',
  exportName: 'UiSpace',
  defaultState,
  controlSections: [
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        { id: 'direction', kind: 'segment', label: 'Direction', options: directionOptions },
        { id: 'size', kind: 'segment', label: 'Size', options: sizeOptions },
        { id: 'align', kind: 'select', label: 'Align', options: alignOptions },
      ],
    },
    {
      id: 'states',
      title: 'States',
      controls: [
        { id: 'wrap', kind: 'boolean', label: 'Wrap' },
        { id: 'compact', kind: 'boolean', label: 'Compact seams' },
        { id: 'block', kind: 'boolean', label: 'Block width' },
        {
          id: 'separatorStyle',
          kind: 'segment',
          label: 'Separator',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Slash', value: 'slash' },
            { label: 'Dot', value: 'dot' },
          ],
        },
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
            { label: 'Inline', value: 'inline' },
            { label: 'Separator', value: 'separator' },
            { label: 'Compact', value: 'compact' },
            { label: 'Vertical', value: 'vertical' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) => [
    ...(state.matrixPresets.includes('inline')
      ? [{ id: 'inline', title: 'Inline actions', patch: {} }]
      : []),
    ...(state.matrixPresets.includes('separator')
      ? [
          {
            id: 'separator',
            title: 'Separated metadata',
            patch: {
              compact: false,
              separatorStyle: 'slash' as const,
            },
          },
        ]
      : []),
    ...(state.matrixPresets.includes('compact')
      ? [
          {
            id: 'compact',
            title: 'Compact button row',
            patch: {
              compact: true,
              separatorStyle: 'none' as const,
            },
          },
        ]
      : []),
    ...(state.matrixPresets.includes('vertical')
      ? [
          {
            id: 'vertical',
            title: 'Vertical stack',
            patch: {
              align: 'stretch' as const,
              compact: false,
              direction: 'vertical' as const,
              separatorStyle: 'none' as const,
            },
          },
        ]
      : []),
  ],
  component: UiSpace,
  buildComponentProps: (state) => ({
    align: state.align,
    block: state.block,
    compact: state.compact,
    direction: state.direction,
    ...(separatorMap[state.separatorStyle]
      ? {
          separator: separatorMap[state.separatorStyle],
        }
      : {}),
    size: state.size,
    wrap: state.wrap,
  }),
  buildPreviewSlots: () => ({
    default: () =>
      ['Review', 'Preview', 'Ship'].map((label, index) =>
        h(
          UiButton,
          {
            variant: index === 2 ? 'primary' : 'secondary',
            size: 'sm',
          },
          () => label
        )
      ),
  }),
  buildWrapperAttrs: (state, context) => buildThemeScopeAttrs(state, context),
  buildSnippetProps: (state) => ({
    ...(state.direction !== 'horizontal' ? { direction: state.direction } : {}),
    ...(state.size !== '3' ? { size: state.size } : {}),
    ...(state.align !== 'center' ? { align: state.align } : {}),
    ...(state.wrap ? { wrap: true } : {}),
    ...(state.compact ? { compact: true } : {}),
    ...(state.block ? { block: true } : {}),
    ...(separatorMap[state.separatorStyle] && !state.compact
      ? { separator: separatorMap[state.separatorStyle] }
      : {}),
  }),
  buildSnippetSlots: () => [
    {
      content: () =>
        '<button type="button">Review</button>\n    <button type="button">Preview</button>\n    <button type="button">Ship</button>',
    },
  ],
});

export default definition;
