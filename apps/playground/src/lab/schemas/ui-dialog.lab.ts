import { UiDialog } from '@ww/core';

import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import OverlaySurfaceLabPreview from '../components/OverlaySurfaceLabPreview.vue';
import {
  buildThemeScopeAttrs,
  createVueAttributes,
  createVueSnippet,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type UiDialogLabState = {
  open: boolean;
  title: string;
  description: string;
  bodyText: string;
  closeOnOverlayClick: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const defaultState: Readonly<UiDialogLabState> = Object.freeze({
  open: true,
  title: 'Dialog baseline',
  description: 'Uses shared overlay stack, theme-aware portal resolution, and motion presets.',
  bodyText: 'Dialog content stays within the reusable foundation scope.',
  closeOnOverlayClick: true,
  subtreeTheme: 'inherit',
  matrixPresets: ['default', 'scoped-theme', 'strict-dismiss'],
});

function buildMatrixItems(state: UiDialogLabState): readonly LabMatrixItem<UiDialogLabState>[] {
  return state.matrixPresets.map((preset) => {
    if (preset === 'scoped-theme') {
      return {
        id: preset,
        title: 'Scoped theme dialog',
        patch: {
          subtreeTheme: 'belovodye',
        },
      };
    }

    if (preset === 'strict-dismiss') {
      return {
        id: preset,
        title: 'Dismiss locked',
        patch: {
          closeOnOverlayClick: false,
        },
      };
    }

    return {
      id: preset,
      title: 'Default dialog',
      patch: {},
    };
  });
}

function serializeCopy(format: LabCopyFormat, state: UiDialogLabState) {
  const payload = {
    open: state.open,
    title: state.title,
    ...(state.description ? { description: state.description } : {}),
    ...(state.closeOnOverlayClick === false ? { closeOnOverlayClick: false } : {}),
  };

  return serializeByFormat(format, payload, () =>
    createVueSnippet({
      packageName: '@ww/core',
      exportName: 'UiDialog',
      attributes: createVueAttributes(payload),
      slots: [
        {
          content: state.bodyText,
        },
        {
          name: 'footer',
          content: '<UiButton variant="secondary" size="sm">Cancel</UiButton>',
        },
      ],
      scriptSetup: [`import { UiButton } from '@ww/core';`],
    })
  );
}

const definition: LabSurfaceDefinition<UiDialogLabState> = {
  id: 'ui-dialog',
  title: 'UiDialog',
  description:
    'Reusable modal overlay with deterministic stacking and theme-aware portal resolution.',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'title', kind: 'text', label: 'Title' },
        { id: 'description', kind: 'text', label: 'Description' },
        { id: 'bodyText', kind: 'text', label: 'Body copy' },
      ],
    },
    {
      id: 'states',
      title: 'States',
      controls: [
        { id: 'open', kind: 'boolean', label: 'Open' },
        { id: 'closeOnOverlayClick', kind: 'boolean', label: 'Close on overlay click' },
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
            { label: 'Scoped theme', value: 'scoped-theme' },
            { label: 'Dismiss locked', value: 'strict-dismiss' },
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
  previewComponent: markPreviewComponent(OverlaySurfaceLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    component: markPreviewComponent(UiDialog),
    componentProps: {
      title: state.title,
      description: state.description,
      closeOnOverlayClick: state.closeOnOverlayClick,
      ariaLabel: state.title,
    },
    bodyText: state.bodyText,
    triggerLabel: state.open ? 'Reopen dialog' : 'Open dialog',
    footerActions: ['Cancel', 'Confirm'],
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
