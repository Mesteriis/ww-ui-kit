import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import TabsSurfaceLabPreview from '../components/TabsSurfaceLabPreview.vue';
import {
  createVueAttributes,
  createVueSnippet,
  markPreviewComponent,
  serializeByFormat,
} from '../runtime/schema-helpers';

type UiTabsLabState = {
  orientation: 'horizontal' | 'vertical';
  firstLabel: string;
  secondLabel: string;
  thirdLabel: string;
  matrixLayouts: readonly string[];
};

const defaultState: Readonly<UiTabsLabState> = Object.freeze({
  orientation: 'horizontal',
  firstLabel: 'Overview',
  secondLabel: 'Motion',
  thirdLabel: 'Overlays',
  matrixLayouts: ['horizontal', 'vertical'],
});

function buildMatrixItems(state: UiTabsLabState): readonly LabMatrixItem<UiTabsLabState>[] {
  return state.matrixLayouts.map((layout) => ({
    id: layout,
    title: `${layout.charAt(0).toUpperCase()}${layout.slice(1)} tabs`,
    patch: {
      orientation: layout as UiTabsLabState['orientation'],
    },
  }));
}

function serializeCopy(format: LabCopyFormat, state: UiTabsLabState) {
  const payload = {
    ...(state.orientation !== 'horizontal' ? { orientation: state.orientation } : {}),
  };

  return serializeByFormat(format, payload, () =>
    createVueSnippet({
      packageName: '@ww/core',
      exportName: 'UiTabsRoot',
      tagName: 'UiTabsRoot',
      attributes: ['v-model="activeTab"', ...createVueAttributes(payload)],
      slots: [
        {
          content:
            '<UiTabsList>\n      <UiTabsTrigger value="overview">Overview</UiTabsTrigger>\n      <UiTabsTrigger value="motion">Motion</UiTabsTrigger>\n      <UiTabsTrigger value="overlays">Overlays</UiTabsTrigger>\n    </UiTabsList>\n    <UiTabsPanel value="overview">Overview content</UiTabsPanel>\n    <UiTabsPanel value="motion">Motion content</UiTabsPanel>\n    <UiTabsPanel value="overlays">Overlay content</UiTabsPanel>',
        },
      ],
      scriptSetup: [
        `import { UiTabsList, UiTabsPanel, UiTabsTrigger } from '@ww/core';`,
        `const activeTab = 'overview';`,
      ],
    })
  );
}

const definition: LabSurfaceDefinition<UiTabsLabState> = {
  id: 'ui-tabs-root',
  title: 'UiTabs',
  description:
    'Composite tabs surface that keeps root, list, triggers, and panels reviewed together.',
  defaultState,
  controlSections: [
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        {
          id: 'orientation',
          kind: 'segment',
          label: 'Orientation',
          options: [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ],
        },
      ],
    },
    {
      id: 'labels',
      title: 'Tab labels',
      controls: [
        { id: 'firstLabel', kind: 'text', label: 'First tab' },
        { id: 'secondLabel', kind: 'text', label: 'Second tab' },
        { id: 'thirdLabel', kind: 'text', label: 'Third tab' },
      ],
    },
    {
      id: 'matrix',
      title: 'Matrix filters',
      controls: [
        {
          id: 'matrixLayouts',
          kind: 'multi-toggle',
          label: 'Layouts',
          options: [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
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
  previewComponent: markPreviewComponent(TabsSurfaceLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state) => ({
    orientation: state.orientation,
    tabs: [
      {
        id: 'overview',
        label: state.firstLabel,
        content: 'Core CSS consumes semantic and component custom properties only.',
      },
      {
        id: 'motion',
        label: state.secondLabel,
        content: 'Motion presets, utilities, and runtime hooks stay in primitives.',
      },
      {
        id: 'overlays',
        label: state.thirdLabel,
        content: 'Dialogs and drawers share deterministic layer slots and theme-aware portals.',
      },
    ],
  }),
};

export default definition;
