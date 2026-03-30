import { UiPopover } from '@ww/core';

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

type UiPopoverLabState = {
  open: boolean;
  triggerLabel: string;
  bodyText: string;
  placement: 'bottom-start' | 'bottom' | 'right-start' | 'top-start';
  arrow: boolean;
  width: 'auto' | 'trigger' | 'wide';
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const placementOptions = [
  { label: 'Bottom start', value: 'bottom-start' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Right start', value: 'right-start' },
  { label: 'Top start', value: 'top-start' },
] as const;

const widthOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Trigger width', value: 'trigger' },
  { label: '320px', value: 'wide' },
] as const;

const defaultState: Readonly<UiPopoverLabState> = Object.freeze({
  open: true,
  triggerLabel: 'Popover anchor',
  bodyText: 'Interactive floating content closes on Escape and returns focus to the trigger.',
  placement: 'bottom-start',
  arrow: false,
  width: 'trigger',
  subtreeTheme: 'inherit',
  matrixPresets: ['default', 'arrow', 'scoped-theme'],
});

function buildMatrixItems(state: UiPopoverLabState): readonly LabMatrixItem<UiPopoverLabState>[] {
  return state.matrixPresets.map((preset) => {
    if (preset === 'arrow') {
      return {
        id: preset,
        title: 'Arrow + right start',
        patch: {
          arrow: true,
          placement: 'right-start',
          width: 'auto',
        },
      };
    }

    if (preset === 'scoped-theme') {
      return {
        id: preset,
        title: 'Scoped theme',
        patch: {
          subtreeTheme: 'belovodye',
          width: 'wide',
        },
      };
    }

    return {
      id: preset,
      title: 'Default popover',
      patch: {},
    };
  });
}

function serializeCopy(format: LabCopyFormat, state: UiPopoverLabState) {
  const payload = {
    placement: state.placement,
    ...(state.arrow ? { arrow: true } : {}),
    ...(state.width === 'trigger'
      ? { width: 'trigger' }
      : state.width === 'wide'
        ? { width: 320 }
        : {}),
  };

  return serializeByFormat(format, payload, () =>
    createVueSnippet({
      packageName: '@ww/core',
      exportName: 'UiPopover',
      attributes: createVueAttributes(payload),
      slots: [
        {
          name: 'trigger',
          content: `<UiButton variant="secondary">${state.triggerLabel}</UiButton>`,
        },
        {
          content: state.bodyText,
        },
      ],
      scriptSetup: [`import { UiButton } from '@ww/core';`],
    })
  );
}

const definition: LabSurfaceDefinition<UiPopoverLabState> = {
  id: 'ui-popover',
  title: 'UiPopover',
  description:
    'Interactive floating surface that stays outside focus-trap semantics while still restoring focus to the trigger.',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'triggerLabel', kind: 'text', label: 'Trigger label' },
        { id: 'bodyText', kind: 'text', label: 'Body copy' },
      ],
    },
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        { id: 'placement', kind: 'segment', label: 'Placement', options: placementOptions },
        { id: 'width', kind: 'segment', label: 'Width', options: widthOptions },
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
    component: markPreviewComponent(UiPopover),
    componentProps: {
      placement: state.placement,
      width: state.width === 'wide' ? 320 : state.width,
      arrow: state.arrow,
      trigger: 'manual',
    },
    bodyText: state.bodyText,
    triggerLabel: state.triggerLabel,
    toggleLabel: state.open ? 'Hide popover preview' : 'Show popover preview',
    triggerSlot: 'trigger',
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
