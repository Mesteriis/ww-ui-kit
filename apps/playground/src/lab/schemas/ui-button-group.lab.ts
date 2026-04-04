import { h } from 'vue';

import { UiButton, UiButtonGroup } from '@ww/core';

import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import SimpleSurfaceLabPreview from '../components/SimpleSurfaceLabPreview.vue';
import {
  buildThemeScopeAttrs,
  createVueAttributes,
  createVueSnippet,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type UiButtonGroupLabState = {
  activeAction: 'review' | 'ship' | 'rollback';
  orientation: 'horizontal' | 'vertical';
  attached: boolean;
  wrap: boolean;
  block: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const actionOptions = [
  { label: 'Review', value: 'review' },
  { label: 'Ship', value: 'ship' },
  { label: 'Rollback', value: 'rollback' },
] as const;

const orientationOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
] as const;

const defaultState: Readonly<UiButtonGroupLabState> = Object.freeze({
  activeAction: 'review',
  orientation: 'horizontal',
  attached: true,
  wrap: false,
  block: false,
  subtreeTheme: 'inherit',
  matrixPresets: ['attached', 'loose', 'vertical', 'block'],
});

function buildMatrixItems(
  state: UiButtonGroupLabState
): readonly LabMatrixItem<UiButtonGroupLabState>[] {
  return state.matrixPresets.map((preset) => {
    if (preset === 'loose') {
      return {
        id: preset,
        title: 'Loose group',
        patch: {
          attached: false,
          wrap: true,
        },
      };
    }

    if (preset === 'vertical') {
      return {
        id: preset,
        title: 'Vertical stack',
        patch: {
          orientation: 'vertical',
          attached: false,
        },
      };
    }

    if (preset === 'block') {
      return {
        id: preset,
        title: 'Full width',
        patch: {
          block: true,
          attached: true,
        },
      };
    }

    return {
      id: preset,
      title: 'Attached group',
      patch: {},
    };
  });
}

function resolveButtons(activeAction: UiButtonGroupLabState['activeAction']) {
  return [
    {
      label: 'Review',
      variant: activeAction === 'review' ? 'primary' : 'secondary',
    },
    {
      label: 'Ship',
      variant: activeAction === 'ship' ? 'primary' : 'secondary',
    },
    {
      label: 'Rollback',
      variant: activeAction === 'rollback' ? 'danger' : 'secondary',
    },
  ] as const;
}

function serializeCopy(format: LabCopyFormat, state: UiButtonGroupLabState) {
  const payload = {
    ...(state.orientation !== 'horizontal' ? { orientation: state.orientation } : {}),
    ...(state.attached ? {} : { attached: false }),
    ...(state.wrap ? { wrap: true } : {}),
    ...(state.block ? { block: true } : {}),
    ariaLabel: 'Release actions',
  };

  return serializeByFormat(format, payload, () =>
    createVueSnippet({
      packageName: '@ww/core',
      exportName: 'UiButtonGroup',
      attributes: createVueAttributes(payload),
      slots: resolveButtons(state.activeAction).map((button) => ({
        content: `<UiButton variant="${button.variant}">${button.label}</UiButton>`,
      })),
      scriptSetup: [`import { UiButton } from '@ww/core';`],
    })
  );
}

const definition: LabSurfaceDefinition<UiButtonGroupLabState> = {
  id: 'ui-button-group',
  title: 'UiButtonGroup',
  description:
    'Attached or loose action clustering for adjacent button surfaces without introducing a second selection model.',
  defaultState,
  controlSections: [
    {
      id: 'selection',
      title: 'Selection',
      controls: [
        { id: 'activeAction', kind: 'segment', label: 'Active action', options: actionOptions },
      ],
    },
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        {
          id: 'orientation',
          kind: 'segment',
          label: 'Orientation',
          options: orientationOptions,
        },
        { id: 'attached', kind: 'boolean', label: 'Attached seams' },
        { id: 'wrap', kind: 'boolean', label: 'Wrap' },
        { id: 'block', kind: 'boolean', label: 'Block width' },
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
            { label: 'Attached', value: 'attached' },
            { label: 'Loose', value: 'loose' },
            { label: 'Vertical', value: 'vertical' },
            { label: 'Block', value: 'block' },
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
  previewComponent: markPreviewComponent(SimpleSurfaceLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    component: markPreviewComponent(UiButtonGroup),
    componentProps: {
      orientation: state.orientation,
      attached: state.wrap ? false : state.attached,
      wrap: state.wrap,
      block: state.block,
      ariaLabel: 'Release actions',
    },
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
  buildPreviewSlots: (state) => ({
    default: () =>
      resolveButtons(state.activeAction).map((button) =>
        h(
          UiButton,
          {
            variant: button.variant,
          },
          () => button.label
        )
      ),
  }),
};

export default definition;
