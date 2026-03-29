import { UiCheckbox } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { createSimpleMatrix } from '../runtime/schema-helpers';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiCheckboxLabState = {
  label: string;
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  matrixStates: readonly string[];
};

const defaultState: Readonly<UiCheckboxLabState> = Object.freeze({
  label: 'Enable release channel',
  checked: true,
  disabled: false,
  invalid: false,
  matrixStates: ['default', 'checked', 'disabled'],
});

const definition: LabSurfaceDefinition<UiCheckboxLabState> = createSimpleSurfaceDefinition({
  id: 'ui-checkbox',
  title: 'UiCheckbox',
  description: 'Baseline binary selection control with explicit label and invalid state.',
  packageName: '@ww/core',
  exportName: 'UiCheckbox',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [{ id: 'label', kind: 'text', label: 'Label' }],
    },
    {
      id: 'states',
      title: 'States',
      controls: [
        { id: 'checked', kind: 'boolean', label: 'Checked' },
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
          label: 'States',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Checked', value: 'checked' },
            { label: 'Disabled', value: 'disabled' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) =>
    createSimpleMatrix(['checkbox'], state.matrixStates, (_variant, matrixState) => ({
      checked: matrixState === 'checked',
      disabled: matrixState === 'disabled',
    })),
  component: UiCheckbox,
  buildComponentProps: (state) => ({
    modelValue: state.checked,
    disabled: state.disabled,
    invalid: state.invalid,
  }),
  buildPreviewSlots: (state) => ({
    default: () => state.label,
  }),
  buildSnippetProps: (state) => ({
    ...(state.checked ? { modelValue: true } : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ...(state.invalid ? { invalid: true } : {}),
  }),
  buildSnippetSlots: (state) => [
    {
      content: () => state.label,
    },
  ],
});

export default definition;
