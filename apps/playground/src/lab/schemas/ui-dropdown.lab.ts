import { UiDropdown } from '@ww/core';

import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import FloatingSurfaceLabPreview from '../components/FloatingSurfaceLabPreview.vue';
import {
  buildThemeScopeAttrs,
  createVueAttributes,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type UiDropdownLabState = {
  open: boolean;
  triggerLabel: string;
  placement: 'bottom-start' | 'bottom' | 'right-start';
  arrow: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const placementOptions = [
  { label: 'Bottom start', value: 'bottom-start' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Right start', value: 'right-start' },
] as const;

const dropdownItems = [
  { label: 'Review queue', value: 'review' },
  { label: 'Promote release', value: 'promote' },
  { type: 'divider' as const },
  {
    type: 'group' as const,
    label: 'Deploy',
    items: [
      { label: 'Bravo', value: 'bravo' },
      { label: 'Charlie', value: 'charlie' },
    ],
  },
] as const;

const defaultState: Readonly<UiDropdownLabState> = Object.freeze({
  open: true,
  triggerLabel: 'Dropdown anchor',
  placement: 'bottom-start',
  arrow: false,
  subtreeTheme: 'inherit',
  matrixPresets: ['default', 'arrow', 'scoped-theme'],
});

function buildMatrixItems(state: UiDropdownLabState): readonly LabMatrixItem<UiDropdownLabState>[] {
  return state.matrixPresets.map((preset) => {
    if (preset === 'arrow') {
      return {
        id: preset,
        title: 'Arrow + right start',
        patch: {
          arrow: true,
          placement: 'right-start',
        },
      };
    }

    if (preset === 'scoped-theme') {
      return {
        id: preset,
        title: 'Scoped theme',
        patch: {
          subtreeTheme: 'belovodye',
        },
      };
    }

    return {
      id: preset,
      title: 'Default dropdown',
      patch: {},
    };
  });
}

function serializeCopy(format: LabCopyFormat, state: UiDropdownLabState) {
  const payload = {
    items: dropdownItems,
    placement: state.placement,
    ...(state.arrow ? { arrow: true } : {}),
  };

  return serializeByFormat(
    format,
    payload,
    () =>
      `<script setup lang="ts">\nimport { UiButton, UiDropdown } from '@ww/core';\n\nconst items = ${JSON.stringify(dropdownItems, null, 2)};\n</script>\n\n<template>\n  <UiDropdown\n    :items="items"\n    ${createVueAttributes(
        {
          placement: state.placement,
          ...(state.arrow ? { arrow: true } : {}),
        }
      ).join(
        '\n    '
      )}\n  >\n    <template #trigger><UiButton variant="secondary">${state.triggerLabel}</UiButton></template>\n  </UiDropdown>\n</template>\n`
  );
}

const definition: LabSurfaceDefinition<UiDropdownLabState> = {
  id: 'ui-dropdown',
  title: 'UiDropdown',
  description:
    'Single-level menu surface with menu semantics, roving focus, typeahead, and the shared floating runtime.',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [{ id: 'triggerLabel', kind: 'text', label: 'Trigger label' }],
    },
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        { id: 'placement', kind: 'segment', label: 'Placement', options: placementOptions },
        { id: 'arrow', kind: 'boolean', label: 'Arrow' },
        { id: 'open', kind: 'boolean', label: 'Open' },
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
            { label: 'Default', value: 'default' },
            { label: 'Arrow', value: 'arrow' },
            { label: 'Scoped theme', value: 'scoped-theme' },
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
  defaultCopyFormat: 'vue',
  previewComponent: markPreviewComponent(FloatingSurfaceLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    component: markPreviewComponent(UiDropdown),
    componentProps: {
      items: dropdownItems,
      placement: state.placement,
      arrow: state.arrow,
      trigger: 'manual',
    },
    triggerLabel: state.triggerLabel,
    toggleLabel: state.open ? 'Hide dropdown preview' : 'Show dropdown preview',
    triggerSlot: 'trigger',
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
