import { UiSlider } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { fieldStateOptions } from '../runtime/core-control-options';
import { createSimpleMatrix } from '../runtime/schema-helpers';
import { createFieldSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiSliderLabState = {
  label: string;
  hint: string;
  errorText: string;
  modelValue: number;
  min: number;
  max: number;
  step: number;
  orientation: 'horizontal' | 'vertical';
  showInput: boolean;
  tooltipMode: 'auto' | 'always' | 'off';
  disabled: boolean;
  invalid: boolean;
  matrixStates: readonly string[];
};

const defaultState: Readonly<UiSliderLabState> = Object.freeze({
  label: 'Rollout target',
  hint: 'Slider field surface with governed keyboard semantics.',
  errorText: 'Slider validation message.',
  modelValue: 65,
  min: 0,
  max: 100,
  step: 5,
  orientation: 'horizontal',
  showInput: true,
  tooltipMode: 'auto',
  disabled: false,
  invalid: false,
  matrixStates: ['default', 'invalid', 'disabled'],
});

const definition: LabSurfaceDefinition<UiSliderLabState> = createFieldSurfaceDefinition({
  id: 'ui-slider',
  title: 'UiSlider',
  description: 'Single-value slider surface with optional numeric input, marks, and keyboard flow.',
  packageName: '@ww/core',
  exportName: 'UiSlider',
  defaultState,
  controlSections: [
    {
      id: 'field',
      title: 'Field context',
      controls: [
        { id: 'label', kind: 'text', label: 'Label' },
        { id: 'hint', kind: 'text', label: 'Hint' },
        { id: 'errorText', kind: 'text', label: 'Error message' },
      ],
    },
    {
      id: 'value',
      title: 'Slider props',
      controls: [
        { id: 'modelValue', kind: 'number', label: 'Value', min: 0, max: 100, step: 5 },
        { id: 'min', kind: 'number', label: 'Min', min: 0, max: 50, step: 1 },
        { id: 'max', kind: 'number', label: 'Max', min: 50, max: 200, step: 1 },
        { id: 'step', kind: 'number', label: 'Step', min: 1, max: 25, step: 1 },
        {
          id: 'orientation',
          kind: 'segment',
          label: 'Orientation',
          options: [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ],
        },
        {
          id: 'tooltipMode',
          kind: 'segment',
          label: 'Tooltip',
          options: [
            { label: 'Auto', value: 'auto' },
            { label: 'Always', value: 'always' },
            { label: 'Off', value: 'off' },
          ],
        },
      ],
    },
    {
      id: 'states',
      title: 'States',
      controls: [
        { id: 'showInput', kind: 'boolean', label: 'Show input' },
        { id: 'disabled', kind: 'boolean', label: 'Disabled' },
        { id: 'invalid', kind: 'boolean', label: 'Invalid' },
      ],
    },
    {
      id: 'matrix',
      title: 'Matrix filters',
      controls: [
        {
          id: 'matrixStates',
          kind: 'multi-toggle',
          label: 'Field states',
          options: fieldStateOptions,
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) =>
    createSimpleMatrix(
      ['horizontal', 'vertical'],
      state.matrixStates,
      (orientation, matrixState) => ({
        orientation: orientation as UiSliderLabState['orientation'],
        invalid: matrixState === 'invalid',
        disabled: matrixState === 'disabled',
      })
    ),
  component: UiSlider,
  buildComponentProps: (state) => ({
    modelValue: state.modelValue,
    min: state.min,
    max: state.max,
    step: state.step,
    orientation: state.orientation,
    showInput: state.showInput,
    tooltip: state.tooltipMode === 'always' ? 'always' : state.tooltipMode === 'off' ? false : true,
    marks: [
      { value: state.min, label: String(state.min) },
      { value: (state.min + state.max) / 2, label: 'Mid' },
      { value: state.max, label: String(state.max) },
    ],
    disabled: state.disabled,
    invalid: state.invalid,
  }),
  buildFieldProps: (state) => ({
    label: state.label,
    hint: state.hint,
    ...(state.invalid ? { error: state.errorText } : {}),
  }),
  buildWrapperAttrs: (state) =>
    state.orientation === 'vertical' ? { style: 'min-block-size: 16rem; inline-size: 12rem;' } : {},
  buildSnippetProps: (state) => ({
    modelValue: state.modelValue,
    ...(state.min !== 0 ? { min: state.min } : {}),
    ...(state.max !== 100 ? { max: state.max } : {}),
    ...(state.step !== 5 ? { step: state.step } : { step: 5 }),
    ...(state.orientation !== 'horizontal' ? { orientation: state.orientation } : {}),
    ...(state.showInput ? { showInput: true } : {}),
    ...(state.tooltipMode === 'always'
      ? { tooltip: 'always' }
      : state.tooltipMode === 'off'
        ? { tooltip: false }
        : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ...(state.invalid ? { invalid: true } : {}),
  }),
});

export default definition;
