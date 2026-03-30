import { UiSelect } from '@ww/core';

import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import FieldSurfaceLabPreview from '../components/FieldSurfaceLabPreview.vue';
import {
  createSimpleMatrix,
  createVueSnippet,
  markPreviewComponent,
  serializeByFormat,
} from '../runtime/schema-helpers';

type UiSelectLabState = {
  label: string;
  hint: string;
  errorText: string;
  placeholder: string;
  selectionMode: 'single' | 'multiple';
  searchable: boolean;
  clearable: boolean;
  disabled: boolean;
  invalid: boolean;
  matrixPresets: readonly string[];
};

const selectionModeOptions = [
  { label: 'Single', value: 'single' },
  { label: 'Multiple', value: 'multiple' },
] as const;

const selectOptions = Object.freeze([
  { label: 'Overview queue', value: 'overview', icon: '⌘' },
  {
    type: 'group' as const,
    label: 'Deploy lanes',
    options: [
      { label: 'Bravo lane', value: 'bravo', icon: 'B' },
      { label: 'Charlie lane', value: 'charlie', disabled: true, icon: 'C' },
    ],
  },
]);

const defaultState: Readonly<UiSelectLabState> = Object.freeze({
  label: 'Deploy lane',
  hint: 'Searchable select on the sanctioned floating path.',
  errorText: 'Select validation message.',
  placeholder: 'Pick a lane',
  selectionMode: 'single',
  searchable: true,
  clearable: true,
  disabled: false,
  invalid: false,
  matrixPresets: ['single', 'multiple', 'invalid', 'disabled'],
});

function buildModelValue(state: UiSelectLabState) {
  return state.selectionMode === 'multiple' ? ['overview', 'bravo'] : 'bravo';
}

function serializeCopy(format: LabCopyFormat, state: UiSelectLabState) {
  const payload = {
    options: selectOptions,
    modelValue: buildModelValue(state),
    placeholder: state.placeholder,
    ...(state.selectionMode === 'multiple' ? { multiple: true } : {}),
    ...(state.searchable ? { searchable: true } : {}),
    ...(state.clearable ? { clearable: true } : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ...(state.invalid ? { invalid: true } : {}),
  };

  const modelValue = JSON.stringify(buildModelValue(state), null, 2);

  return serializeByFormat(format, payload, () =>
    createVueSnippet({
      packageName: '@ww/core',
      exportName: 'UiSelect',
      attributes: [
        ':options="options"',
        ':model-value="modelValue"',
        ...(state.placeholder ? [`placeholder="${state.placeholder}"`] : []),
        ...(state.selectionMode === 'multiple' ? ['multiple'] : []),
        ...(state.searchable ? ['searchable'] : []),
        ...(state.clearable ? ['clearable'] : []),
        ...(state.disabled ? ['disabled'] : []),
        ...(state.invalid ? ['invalid'] : []),
      ],
      scriptSetup: [
        `const options = ${JSON.stringify(selectOptions, null, 2)};`,
        `const modelValue = ${modelValue};`,
      ],
    })
  );
}

const definition: LabSurfaceDefinition<UiSelectLabState> = {
  id: 'ui-select',
  title: 'UiSelect',
  description: 'Rich select surface with grouped options, search, clearing, and multiple mode.',
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
      id: 'surface',
      title: 'Select props',
      controls: [
        { id: 'placeholder', kind: 'text', label: 'Placeholder' },
        {
          id: 'selectionMode',
          kind: 'segment',
          label: 'Selection mode',
          options: selectionModeOptions,
        },
        { id: 'searchable', kind: 'boolean', label: 'Searchable' },
        { id: 'clearable', kind: 'boolean', label: 'Clearable' },
        { id: 'disabled', kind: 'boolean', label: 'Disabled' },
        { id: 'invalid', kind: 'boolean', label: 'Invalid' },
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
            { label: 'Single', value: 'single' },
            { label: 'Multiple', value: 'multiple' },
            { label: 'Invalid', value: 'invalid' },
            { label: 'Disabled', value: 'disabled' },
          ],
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
  buildMatrixItems: (state) => {
    const items: LabMatrixItem<UiSelectLabState>[] = [
      ...createSimpleMatrix(
        ['select'],
        state.matrixPresets.filter((preset) => preset === 'invalid' || preset === 'disabled'),
        (_variant, preset) => ({
          invalid: preset === 'invalid',
          disabled: preset === 'disabled',
        })
      ),
    ] as LabMatrixItem<UiSelectLabState>[];

    if (state.matrixPresets.includes('single')) {
      items.push({
        id: 'single',
        title: 'Single select',
        patch: {
          selectionMode: 'single',
          searchable: true,
          clearable: true,
        },
      });
    }

    if (state.matrixPresets.includes('multiple')) {
      items.push({
        id: 'multiple',
        title: 'Multiple select',
        patch: {
          selectionMode: 'multiple',
          searchable: true,
          clearable: true,
        },
      });
    }

    return items;
  },
  serializeCopy,
  buildPreviewProps: (state) => ({
    component: markPreviewComponent(UiSelect),
    componentProps: {
      options: selectOptions,
      modelValue: buildModelValue(state),
      placeholder: state.placeholder,
      multiple: state.selectionMode === 'multiple',
      searchable: state.searchable,
      clearable: state.clearable,
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
