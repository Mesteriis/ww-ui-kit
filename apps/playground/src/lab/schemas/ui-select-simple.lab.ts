import { UiSelectSimple } from '@ww/core';

import type { LabCopyFormat, LabSurfaceDefinition } from '../manifest/component-lab.types';
import FieldSurfaceLabPreview from '../components/FieldSurfaceLabPreview.vue';
import { fieldStateOptions } from '../runtime/core-control-options';
import {
  createSimpleMatrix,
  createVueAttributes,
  createVueSnippet,
  markPreviewComponent,
  serializeByFormat,
} from '../runtime/schema-helpers';

type UiSelectSimpleLabState = {
  label: string;
  hint: string;
  errorText: string;
  placeholder: string;
  modelValue: string;
  disabled: boolean;
  invalid: boolean;
  matrixStates: readonly string[];
};

const selectOptions = Object.freeze([
  { label: 'Design system', value: 'design-system' },
  { label: 'Internal tool', value: 'internal-tool' },
  { label: 'Customer surface', value: 'customer-surface' },
]);

const defaultState: Readonly<UiSelectSimpleLabState> = Object.freeze({
  label: 'Surface type',
  hint: 'Simple select built on the shared field contract.',
  errorText: 'Select validation message.',
  placeholder: 'Choose a surface',
  modelValue: 'design-system',
  disabled: false,
  invalid: false,
  matrixStates: ['default', 'invalid', 'disabled'],
});

function serializeCopy(format: LabCopyFormat, state: UiSelectSimpleLabState) {
  const payload = {
    options: selectOptions,
    ...(state.modelValue ? { modelValue: state.modelValue } : {}),
    ...(state.placeholder ? { placeholder: state.placeholder } : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ...(state.invalid ? { invalid: true } : {}),
  };

  return serializeByFormat(format, payload, () =>
    createVueSnippet({
      packageName: '@ww/core',
      exportName: 'UiSelectSimple',
      attributes: [
        ':options="options"',
        ...createVueAttributes({
          ...(state.modelValue ? { modelValue: state.modelValue } : {}),
          ...(state.placeholder ? { placeholder: state.placeholder } : {}),
          ...(state.disabled ? { disabled: true } : {}),
          ...(state.invalid ? { invalid: true } : {}),
        }),
      ],
      scriptSetup: [`const options = ${JSON.stringify(selectOptions, null, 2)};`],
    })
  );
}

const definition: LabSurfaceDefinition<UiSelectSimpleLabState> = {
  id: 'ui-select-simple',
  title: 'UiSelectSimple',
  description: 'Baseline select surface for compact option lists.',
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
      title: 'Select props',
      controls: [
        { id: 'placeholder', kind: 'text', label: 'Placeholder' },
        {
          id: 'modelValue',
          kind: 'segment',
          label: 'Selected value',
          options: selectOptions,
        },
      ],
    },
    {
      id: 'states',
      title: 'States',
      controls: [
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
  previewModes: ['single', 'matrix'],
  defaultPreviewMode: 'single',
  copyFormats: ['json', 'ts-object', 'vue'],
  defaultCopyFormat: 'json',
  previewComponent: markPreviewComponent(FieldSurfaceLabPreview),
  buildMatrixItems: (state) =>
    createSimpleMatrix(['select'], state.matrixStates, (_variant, matrixState) => ({
      invalid: matrixState === 'invalid',
      disabled: matrixState === 'disabled',
    })),
  serializeCopy,
  buildPreviewProps: (state) => ({
    component: markPreviewComponent(UiSelectSimple),
    componentProps: {
      options: selectOptions,
      modelValue: state.modelValue,
      placeholder: state.placeholder,
      disabled: state.disabled,
      invalid: state.invalid,
    },
    fieldProps: {
      label: state.label,
      hint: state.hint,
      ...(state.invalid ? { error: state.errorText } : {}),
    },
  }),
};

export default definition;
