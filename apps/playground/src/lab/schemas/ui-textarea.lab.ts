import { UiTextarea } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { fieldStateOptions } from '../runtime/core-control-options';
import { createSimpleMatrix } from '../runtime/schema-helpers';
import { createFieldSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiTextareaLabState = {
  label: string;
  hint: string;
  errorText: string;
  placeholder: string;
  modelValue: string;
  rows: number;
  readonly: boolean;
  disabled: boolean;
  invalid: boolean;
  matrixStates: readonly string[];
};

const defaultState: Readonly<UiTextareaLabState> = Object.freeze({
  label: 'Notes',
  hint: 'Long-form field with shared context.',
  errorText: 'Textarea validation message.',
  placeholder: 'Document the decision context',
  modelValue: 'Composable and theme-aware field surface.',
  rows: 4,
  readonly: false,
  disabled: false,
  invalid: false,
  matrixStates: ['default', 'invalid', 'disabled'],
});

const definition: LabSurfaceDefinition<UiTextareaLabState> = createFieldSurfaceDefinition({
  id: 'ui-textarea',
  title: 'UiTextarea',
  description: 'Multi-line field surface with shared field context and invalid styling.',
  packageName: '@ww/core',
  exportName: 'UiTextarea',
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
      title: 'Textarea props',
      controls: [
        { id: 'placeholder', kind: 'text', label: 'Placeholder' },
        { id: 'modelValue', kind: 'text', label: 'Value' },
        { id: 'rows', kind: 'number', label: 'Rows', min: 2, max: 8, step: 1 },
      ],
    },
    {
      id: 'states',
      title: 'States',
      controls: [
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
          options: fieldStateOptions,
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) =>
    createSimpleMatrix(['textarea'], state.matrixStates, (_variant, matrixState) => ({
      invalid: matrixState === 'invalid',
      disabled: matrixState === 'disabled',
    })),
  component: UiTextarea,
  buildComponentProps: (state) => ({
    modelValue: state.modelValue,
    placeholder: state.placeholder,
    rows: state.rows,
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
    ...(state.modelValue ? { modelValue: state.modelValue } : {}),
    ...(state.placeholder ? { placeholder: state.placeholder } : {}),
    ...(state.rows !== 4 ? { rows: state.rows } : {}),
    ...(state.readonly ? { readonly: true } : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ...(state.invalid ? { invalid: true } : {}),
  }),
});

export default definition;
