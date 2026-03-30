import { UiNumberInput } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { createSimpleMatrix } from '../runtime/schema-helpers';
import { createFieldSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiNumberInputLabState = {
  label: string;
  hint: string;
  errorText: string;
  placeholder: string;
  modelValue: number;
  min: number;
  max: number;
  step: number;
  precision: number;
  allowEmpty: boolean;
  clampOnBlur: boolean;
  disabled: boolean;
  readonly: boolean;
  invalid: boolean;
  matrixStates: readonly string[];
};

const defaultState: Readonly<UiNumberInputLabState> = Object.freeze({
  label: 'Budget',
  hint: 'Decimal-only baseline numeric control.',
  errorText: 'Number validation message.',
  placeholder: 'Set a value',
  modelValue: 12.5,
  min: 0,
  max: 40,
  step: 0.5,
  precision: 1,
  allowEmpty: false,
  clampOnBlur: true,
  disabled: false,
  readonly: false,
  invalid: false,
  matrixStates: ['default', 'invalid', 'disabled', 'readonly'],
});

const definition: LabSurfaceDefinition<UiNumberInputLabState> = createFieldSurfaceDefinition({
  id: 'ui-number-input',
  title: 'UiNumberInput',
  description: 'Decimal number input with step controls, clamp-on-blur, and field integration.',
  packageName: '@ww/core',
  exportName: 'UiNumberInput',
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
      title: 'Numeric props',
      controls: [
        { id: 'placeholder', kind: 'text', label: 'Placeholder' },
        { id: 'modelValue', kind: 'number', label: 'Value', min: 0, max: 40, step: 0.5 },
        { id: 'min', kind: 'number', label: 'Min', min: 0, max: 40, step: 1 },
        { id: 'max', kind: 'number', label: 'Max', min: 1, max: 80, step: 1 },
        { id: 'step', kind: 'number', label: 'Step', min: 0.1, max: 10, step: 0.1 },
        { id: 'precision', kind: 'number', label: 'Precision', min: 0, max: 4, step: 1 },
      ],
    },
    {
      id: 'states',
      title: 'States',
      controls: [
        { id: 'allowEmpty', kind: 'boolean', label: 'Allow empty' },
        { id: 'clampOnBlur', kind: 'boolean', label: 'Clamp on blur' },
        { id: 'readonly', kind: 'boolean', label: 'Readonly' },
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
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Invalid', value: 'invalid' },
            { label: 'Disabled', value: 'disabled' },
            { label: 'Readonly', value: 'readonly' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) =>
    createSimpleMatrix(['number'], state.matrixStates, (_variant, matrixState) => ({
      invalid: matrixState === 'invalid',
      disabled: matrixState === 'disabled',
      readonly: matrixState === 'readonly',
    })),
  component: UiNumberInput,
  buildComponentProps: (state) => ({
    modelValue: state.modelValue,
    placeholder: state.placeholder,
    min: state.min,
    max: state.max,
    step: state.step,
    precision: state.precision,
    allowEmpty: state.allowEmpty,
    clampOnBlur: state.clampOnBlur,
    readonly: state.readonly,
    disabled: state.disabled,
    invalid: state.invalid,
  }),
  buildFieldProps: (state) => ({
    label: state.label,
    hint: state.hint,
    ...(state.invalid ? { error: state.errorText } : {}),
  }),
  buildSnippetProps: (state) => ({
    modelValue: state.modelValue,
    ...(state.placeholder ? { placeholder: state.placeholder } : {}),
    ...(state.min !== 0 ? { min: state.min } : {}),
    ...(state.max !== 40 ? { max: state.max } : { max: 40 }),
    ...(state.step !== 0.5 ? { step: state.step } : { step: 0.5 }),
    ...(state.precision !== 1 ? { precision: state.precision } : { precision: 1 }),
    ...(state.allowEmpty ? { allowEmpty: true } : {}),
    ...(state.clampOnBlur === false ? { clampOnBlur: false } : {}),
    ...(state.readonly ? { readonly: true } : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ...(state.invalid ? { invalid: true } : {}),
  }),
});

export default definition;
