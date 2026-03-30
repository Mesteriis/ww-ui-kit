import { UiProgress } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiProgressLabState = {
  value: number;
  max: number;
  variant: 'linear' | 'circular';
  status: 'neutral' | 'success' | 'warning' | 'danger';
  showValue: boolean;
  indeterminate: boolean;
  matrixPresets: readonly string[];
};

const variantOptions = [
  { label: 'Linear', value: 'linear' },
  { label: 'Circular', value: 'circular' },
] as const;

const statusOptions = [
  { label: 'Neutral', value: 'neutral' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Danger', value: 'danger' },
] as const;

const defaultState: Readonly<UiProgressLabState> = Object.freeze({
  value: 64,
  max: 100,
  variant: 'linear',
  status: 'neutral',
  showValue: true,
  indeterminate: false,
  matrixPresets: ['linear', 'circular', 'indeterminate'],
});

const definition: LabSurfaceDefinition<UiProgressLabState> = createSimpleSurfaceDefinition({
  id: 'ui-progress',
  title: 'UiProgress',
  description: 'Linear and circular progress surface with determinate and indeterminate states.',
  packageName: '@ww/core',
  exportName: 'UiProgress',
  defaultState,
  controlSections: [
    {
      id: 'value',
      title: 'Value',
      controls: [
        { id: 'value', kind: 'number', label: 'Value', min: 0, max: 100, step: 1 },
        { id: 'max', kind: 'number', label: 'Max', min: 1, max: 200, step: 1 },
      ],
    },
    {
      id: 'surface',
      title: 'Surface',
      controls: [
        { id: 'variant', kind: 'segment', label: 'Variant', options: variantOptions },
        { id: 'status', kind: 'segment', label: 'Status', options: statusOptions },
        { id: 'showValue', kind: 'boolean', label: 'Show value' },
        { id: 'indeterminate', kind: 'boolean', label: 'Indeterminate' },
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
            { label: 'Linear', value: 'linear' },
            { label: 'Circular', value: 'circular' },
            { label: 'Indeterminate', value: 'indeterminate' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) => [
    ...(state.matrixPresets.includes('linear')
      ? [
          {
            id: 'linear',
            title: 'Linear progress',
            patch: {
              variant: 'linear' as const,
              indeterminate: false,
            },
          },
        ]
      : []),
    ...(state.matrixPresets.includes('circular')
      ? [
          {
            id: 'circular',
            title: 'Circular progress',
            patch: {
              variant: 'circular' as const,
              status: 'success' as const,
            },
          },
        ]
      : []),
    ...(state.matrixPresets.includes('indeterminate')
      ? [
          {
            id: 'indeterminate',
            title: 'Indeterminate progress',
            patch: {
              indeterminate: true,
              showValue: false,
              status: 'warning' as const,
            },
          },
        ]
      : []),
  ],
  component: UiProgress,
  buildComponentProps: (state) => ({
    value: state.value,
    max: state.max,
    variant: state.variant,
    status: state.status,
    showValue: state.showValue,
    indeterminate: state.indeterminate,
  }),
  buildSnippetProps: (state) => ({
    ...(state.value !== 64 ? { value: state.value } : { value: 64 }),
    ...(state.max !== 100 ? { max: state.max } : {}),
    ...(state.variant !== 'linear' ? { variant: state.variant } : {}),
    ...(state.status !== 'neutral' ? { status: state.status } : {}),
    ...(state.showValue ? { showValue: true } : {}),
    ...(state.indeterminate ? { indeterminate: true } : {}),
  }),
});

export default definition;
