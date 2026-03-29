import { UiDrawer } from '@ww/core';

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

type UiDrawerLabState = {
  open: boolean;
  title: string;
  description: string;
  bodyText: string;
  side: 'left' | 'right';
  closeOnOverlayClick: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const defaultState: Readonly<UiDrawerLabState> = Object.freeze({
  open: true,
  title: 'Drawer baseline',
  description: 'Open the drawer to inspect stack ordering, portal behavior, and side placement.',
  bodyText: 'Drawer content stays inside the reusable overlay contract.',
  side: 'right',
  closeOnOverlayClick: true,
  subtreeTheme: 'inherit',
  matrixPresets: ['right', 'left', 'scoped-theme'],
});

function buildMatrixItems(state: UiDrawerLabState): readonly LabMatrixItem<UiDrawerLabState>[] {
  return state.matrixPresets.map((preset) => {
    if (preset === 'left') {
      return {
        id: preset,
        title: 'Left drawer',
        patch: {
          side: 'left',
        },
      };
    }

    if (preset === 'scoped-theme') {
      return {
        id: preset,
        title: 'Scoped theme drawer',
        patch: {
          subtreeTheme: 'belovodye',
        },
      };
    }

    return {
      id: preset,
      title: 'Right drawer',
      patch: {
        side: 'right',
      },
    };
  });
}

function serializeCopy(format: LabCopyFormat, state: UiDrawerLabState) {
  const payload = {
    open: state.open,
    title: state.title,
    ...(state.description ? { description: state.description } : {}),
    ...(state.side !== 'right' ? { side: state.side } : {}),
    ...(state.closeOnOverlayClick === false ? { closeOnOverlayClick: false } : {}),
  };

  return serializeByFormat(format, payload, () =>
    createVueSnippet({
      packageName: '@ww/core',
      exportName: 'UiDrawer',
      attributes: createVueAttributes(payload),
      slots: [
        {
          content: state.bodyText,
        },
      ],
    })
  );
}

const definition: LabSurfaceDefinition<UiDrawerLabState> = {
  id: 'ui-drawer',
  title: 'UiDrawer',
  description: 'Reusable drawer overlay with deterministic stacking and side placement.',
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
        {
          id: 'side',
          kind: 'segment',
          label: 'Side',
          options: [
            { label: 'Right', value: 'right' },
            { label: 'Left', value: 'left' },
          ],
        },
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
            { label: 'Right', value: 'right' },
            { label: 'Left', value: 'left' },
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
  previewComponent: markPreviewComponent(OverlaySurfaceLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    component: markPreviewComponent(UiDrawer),
    componentProps: {
      title: state.title,
      description: state.description,
      side: state.side,
      closeOnOverlayClick: state.closeOnOverlayClick,
      ariaLabel: state.title,
    },
    bodyText: state.bodyText,
    triggerLabel: state.open ? 'Reopen drawer' : 'Open drawer',
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
