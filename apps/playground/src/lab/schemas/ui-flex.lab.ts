import { h } from 'vue';

import { UiBadge, UiFlex } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { buildThemeScopeAttrs, themeScopeOptions } from '../runtime/schema-helpers';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiFlexLabState = {
  direction: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap: boolean;
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap: '1' | '2' | '3' | '4' | '5' | '6';
  inline: boolean;
  block: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const directionOptions = [
  { label: 'Row', value: 'row' },
  { label: 'Row reverse', value: 'row-reverse' },
  { label: 'Column', value: 'column' },
  { label: 'Column reverse', value: 'column-reverse' },
] as const;

const justifyOptions = [
  { label: 'Start', value: 'start' },
  { label: 'Center', value: 'center' },
  { label: 'End', value: 'end' },
  { label: 'Between', value: 'between' },
  { label: 'Around', value: 'around' },
  { label: 'Evenly', value: 'evenly' },
] as const;

const alignOptions = [
  { label: 'Start', value: 'start' },
  { label: 'Center', value: 'center' },
  { label: 'End', value: 'end' },
  { label: 'Stretch', value: 'stretch' },
  { label: 'Baseline', value: 'baseline' },
] as const;

const gapOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
] as const;

const defaultState: Readonly<UiFlexLabState> = Object.freeze({
  align: 'center',
  block: false,
  direction: 'row',
  gap: '4',
  inline: false,
  justify: 'start',
  matrixPresets: ['row', 'column', 'between', 'wrap'],
  subtreeTheme: 'inherit',
  wrap: false,
});

const definition: LabSurfaceDefinition<UiFlexLabState> = createSimpleSurfaceDefinition({
  id: 'ui-flex',
  title: 'UiFlex',
  description:
    'Thin token-driven flex utility for action rows, stacked metadata, and inline layouts.',
  packageName: '@ww/core',
  exportName: 'UiFlex',
  defaultState,
  controlSections: [
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        { id: 'direction', kind: 'segment', label: 'Direction', options: directionOptions },
        { id: 'justify', kind: 'select', label: 'Justify', options: justifyOptions },
        { id: 'align', kind: 'select', label: 'Align', options: alignOptions },
        { id: 'gap', kind: 'segment', label: 'Gap', options: gapOptions },
      ],
    },
    {
      id: 'states',
      title: 'States',
      controls: [
        { id: 'wrap', kind: 'boolean', label: 'Wrap' },
        { id: 'inline', kind: 'boolean', label: 'Inline' },
        { id: 'block', kind: 'boolean', label: 'Block width' },
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
            { label: 'Row', value: 'row' },
            { label: 'Column', value: 'column' },
            { label: 'Between', value: 'between' },
            { label: 'Wrap', value: 'wrap' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) => [
    ...(state.matrixPresets.includes('row') ? [{ id: 'row', title: 'Inline row', patch: {} }] : []),
    ...(state.matrixPresets.includes('column')
      ? [
          {
            id: 'column',
            title: 'Stacked column',
            patch: {
              direction: 'column' as const,
              align: 'stretch' as const,
            },
          },
        ]
      : []),
    ...(state.matrixPresets.includes('between')
      ? [
          {
            id: 'between',
            title: 'Distributed row',
            patch: {
              block: true,
              justify: 'between' as const,
            },
          },
        ]
      : []),
    ...(state.matrixPresets.includes('wrap')
      ? [
          {
            id: 'wrap',
            title: 'Wrapped badges',
            patch: {
              wrap: true,
            },
          },
        ]
      : []),
  ],
  component: UiFlex,
  buildComponentProps: (state) => ({
    align: state.align,
    block: state.block,
    direction: state.direction,
    gap: state.gap,
    inline: state.inline,
    justify: state.justify,
    wrap: state.wrap,
  }),
  buildPreviewSlots: () => ({
    default: () =>
      ['Review', 'Ship', 'Rollback'].map((label, index) =>
        h(
          UiBadge,
          {
            variant: index === 0 ? 'brand' : index === 1 ? 'success' : 'warning',
          },
          () => label
        )
      ),
  }),
  buildWrapperAttrs: (state, context) => buildThemeScopeAttrs(state, context),
  buildSnippetProps: (state) => ({
    ...(state.direction !== 'row' ? { direction: state.direction } : {}),
    ...(state.justify !== 'start' ? { justify: state.justify } : {}),
    ...(state.align !== 'center' ? { align: state.align } : {}),
    ...(state.gap !== '4' ? { gap: state.gap } : {}),
    ...(state.wrap ? { wrap: true } : {}),
    ...(state.inline ? { inline: true } : {}),
    ...(state.block ? { block: true } : {}),
  }),
  buildSnippetSlots: () => [
    {
      content: () => '<span>Review</span>\n    <span>Ship</span>\n    <span>Rollback</span>',
    },
  ],
});

export default definition;
