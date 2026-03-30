import { UiTooltip } from '@ww/core';

import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import FloatingSurfaceLabPreview from '../components/FloatingSurfaceLabPreview.vue';
import {
  buildThemeScopeAttrs,
  createVueAttributes,
  createVueSnippet,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type UiTooltipLabState = {
  open: boolean;
  triggerLabel: string;
  content: string;
  placement: 'top' | 'right' | 'bottom-start' | 'left';
  arrow: boolean;
  maxWidth: number;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const placementOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Right', value: 'right' },
  { label: 'Bottom start', value: 'bottom-start' },
  { label: 'Left', value: 'left' },
] as const;

const defaultState: Readonly<UiTooltipLabState> = Object.freeze({
  open: true,
  triggerLabel: 'Tooltip anchor',
  content: 'Tooltip content stays lightweight, accessible, and viewport-safe.',
  placement: 'top',
  arrow: true,
  maxWidth: 240,
  subtreeTheme: 'inherit',
  matrixPresets: ['top', 'right', 'scoped-theme'],
});

function buildMatrixItems(state: UiTooltipLabState): readonly LabMatrixItem<UiTooltipLabState>[] {
  return state.matrixPresets.map((preset) => {
    if (preset === 'right') {
      return {
        id: preset,
        title: 'Right placement',
        patch: {
          placement: 'right',
        },
      };
    }

    if (preset === 'scoped-theme') {
      return {
        id: preset,
        title: 'Scoped theme',
        patch: {
          placement: 'bottom-start',
          subtreeTheme: 'belovodye',
        },
      };
    }

    return {
      id: preset,
      title: 'Top placement',
      patch: {},
    };
  });
}

function serializeCopy(format: LabCopyFormat, state: UiTooltipLabState) {
  const payload = {
    content: state.content,
    placement: state.placement,
    ...(state.arrow ? { arrow: true } : {}),
    ...(state.maxWidth !== 240 ? { maxWidth: state.maxWidth } : {}),
  };

  return serializeByFormat(format, payload, () =>
    createVueSnippet({
      packageName: '@ww/core',
      exportName: 'UiTooltip',
      attributes: createVueAttributes(payload),
      slots: [
        {
          content: `<UiButton variant="secondary">${state.triggerLabel}</UiButton>`,
        },
      ],
      scriptSetup: [`import { UiButton } from '@ww/core';`],
    })
  );
}

const definition: LabSurfaceDefinition<UiTooltipLabState> = {
  id: 'ui-tooltip',
  title: 'UiTooltip',
  description:
    'Lightweight overlay surface that stays on the sanctioned tooltip layer and supports reduced motion.',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'triggerLabel', kind: 'text', label: 'Trigger label' },
        { id: 'content', kind: 'text', label: 'Tooltip copy' },
      ],
    },
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        { id: 'placement', kind: 'segment', label: 'Placement', options: placementOptions },
        { id: 'arrow', kind: 'boolean', label: 'Arrow' },
        { id: 'maxWidth', kind: 'number', label: 'Max width', min: 160, max: 320, step: 8 },
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
            { label: 'Top', value: 'top' },
            { label: 'Right', value: 'right' },
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
    component: markPreviewComponent(UiTooltip),
    componentProps: {
      content: state.content,
      placement: state.placement,
      arrow: state.arrow,
      maxWidth: state.maxWidth,
      trigger: 'manual',
    },
    triggerLabel: state.triggerLabel,
    toggleLabel: state.open ? 'Hide tooltip preview' : 'Show tooltip preview',
    triggerSlot: 'default',
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
