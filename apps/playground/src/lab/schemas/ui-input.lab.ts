import { UiInput } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { fieldStateOptions } from '../runtime/core-control-options';
import { createSimpleMatrix } from '../runtime/schema-helpers';
import { createFieldSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiInputLabState = {
  label: string;
  hint: string;
  errorText: string;
  placeholder: string;
  modelValue: string;
  type: 'text' | 'email' | 'search' | 'password';
  readonly: boolean;
  disabled: boolean;
  invalid: boolean;
  matrixStates: readonly string[];
};

const defaultState: Readonly<UiInputLabState> = Object.freeze({
  label: 'Project name',
  hint: 'Connected to field context.',
  errorText: 'Field validation message.',
  placeholder: 'Name your project',
  modelValue: 'Belovodye control room',
  type: 'text',
  readonly: false,
  disabled: false,
  invalid: false,
  matrixStates: ['default', 'invalid', 'disabled'],
});

const definition: LabSurfaceDefinition<UiInputLabState> = createFieldSurfaceDefinition({
  id: 'ui-input',
  title: 'UiInput',
  description: 'Single-line field surface with shared field context and invalid styling.',
  packageName: '@ww/core',
  exportName: 'UiInput',
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
      title: 'Input props',
      controls: [
        { id: 'placeholder', kind: 'text', label: 'Placeholder' },
        { id: 'modelValue', kind: 'text', label: 'Value' },
        {
          id: 'type',
          kind: 'segment',
          label: 'Type',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Search', value: 'search' },
            { label: 'Password', value: 'password' },
          ],
        },
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
    createSimpleMatrix(['input'], state.matrixStates, (_variant, matrixState) => ({
      invalid: matrixState === 'invalid',
      disabled: matrixState === 'disabled',
    })),
  component: UiInput,
  buildComponentProps: (state) => ({
    modelValue: state.modelValue,
    placeholder: state.placeholder,
    type: state.type,
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
    ...(state.type !== 'text' ? { type: state.type } : {}),
    ...(state.readonly ? { readonly: true } : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ...(state.invalid ? { invalid: true } : {}),
  }),
});

export default definition;
