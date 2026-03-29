import { UiSwitch } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { createSimpleMatrix } from '../runtime/schema-helpers';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiSwitchLabState = {
  label: string;
  checked: boolean;
  disabled: boolean;
  matrixStates: readonly string[];
};

const defaultState: Readonly<UiSwitchLabState> = Object.freeze({
  label: 'Route notifications',
  checked: false,
  disabled: false,
  matrixStates: ['default', 'checked', 'disabled'],
});

const definition: LabSurfaceDefinition<UiSwitchLabState> = createSimpleSurfaceDefinition({
  id: 'ui-switch',
  title: 'UiSwitch',
  description: 'Compact switch surface for on/off settings and inspector toggles.',
  packageName: '@ww/core',
  exportName: 'UiSwitch',
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
    createSimpleMatrix(['switch'], state.matrixStates, (_variant, matrixState) => ({
      checked: matrixState === 'checked',
      disabled: matrixState === 'disabled',
    })),
  component: UiSwitch,
  buildComponentProps: (state) => ({
    modelValue: state.checked,
    disabled: state.disabled,
    ariaLabel: state.label,
  }),
  buildPreviewSlots: (state) => ({
    default: () => state.label,
  }),
  buildSnippetProps: (state) => ({
    ...(state.checked ? { modelValue: true } : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ariaLabel: state.label,
  }),
  buildSnippetSlots: (state) => [
    {
      content: () => state.label,
    },
  ],
});

export default definition;
