import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import LayoutLabPreview from '../components/LayoutLabPreview.vue';
import {
  buildThemeScopeAttrs,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type UiLayoutLabState = {
  title: string;
  description: string;
  width: 'full' | 'content' | 'narrow';
  hasSider: boolean;
  padded: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const defaultState: Readonly<UiLayoutLabState> = Object.freeze({
  title: 'Operations workspace',
  description: 'Reusable layout shell above widgets and systems.',
  width: 'content',
  hasSider: true,
  padded: true,
  subtreeTheme: 'inherit',
  matrixPresets: ['content', 'full', 'narrow'],
});

function buildMatrixItems(state: UiLayoutLabState): readonly LabMatrixItem<UiLayoutLabState>[] {
  return state.matrixPresets.map((preset) => ({
    id: preset,
    title: `${preset.charAt(0).toUpperCase()}${preset.slice(1)} width`,
    patch: {
      width: preset as UiLayoutLabState['width'],
    },
  }));
}

function serializeCopy(format: LabCopyFormat, state: UiLayoutLabState) {
  const payload = {
    ...(state.title ? { title: state.title } : {}),
    ...(state.description ? { description: state.description } : {}),
    ...(state.width !== 'content' ? { width: state.width } : {}),
    ...(state.hasSider ? { hasSider: true } : {}),
    ...(state.padded === false ? { padded: false } : {}),
  };

  return serializeByFormat(
    format,
    payload,
    () =>
      `<script setup lang="ts">\nimport {\n  UiLayout,\n  UiLayoutContent,\n  UiLayoutHeader,\n  UiLayoutSection,\n  UiLayoutSider,\n} from '@ww/page-templates';\n</script>\n\n<template>\n  <UiLayout${state.width !== 'content' ? `\n    width="${state.width}"` : ''}\n  >\n    <template #header>\n      <UiLayoutHeader>\n        <div style="display: grid; gap: var(--ui-space-2);">\n          <h1 style="margin: 0;">${state.title}</h1>\n          <p style="margin: 0; color: var(--ui-text-secondary);">\n            ${state.description}\n          </p>\n        </div>\n      </UiLayoutHeader>\n    </template>\n\n    <UiLayoutContent${state.padded === false ? ' :padded="false"' : ''}>\n      <UiLayoutSection title="Workspace section" description="Reusable layout-shell content.">\n        Shell content\n      </UiLayoutSection>\n    </UiLayoutContent>\n${state.hasSider ? `\n    <template #sider>\n      <UiLayoutSider${state.padded === false ? ' :padded="false"' : ''}>\n        <UiLayoutSection title="Sidebar notes">\n          Sidebar content\n        </UiLayoutSection>\n      </UiLayoutSider>\n    </template>` : ''}\n  </UiLayout>\n</template>\n`
  );
}

const definition: LabSurfaceDefinition<UiLayoutLabState> = {
  id: 'ui-layout',
  title: 'UiLayout',
  description: 'Reusable structural shell above widgets, systems, and core components.',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Copy',
      controls: [
        { id: 'title', kind: 'text', label: 'Title' },
        { id: 'description', kind: 'text', label: 'Description' },
      ],
    },
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        {
          id: 'width',
          kind: 'segment',
          label: 'Width',
          options: [
            { label: 'Full', value: 'full' },
            { label: 'Content', value: 'content' },
            { label: 'Narrow', value: 'narrow' },
          ],
        },
        { id: 'hasSider', kind: 'boolean', label: 'Sider' },
        { id: 'padded', kind: 'boolean', label: 'Padded' },
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
          label: 'Widths',
          options: [
            { label: 'Content', value: 'content' },
            { label: 'Full', value: 'full' },
            { label: 'Narrow', value: 'narrow' },
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
  previewComponent: markPreviewComponent(LayoutLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    layoutProps: {
      width: state.width,
    },
    hasSider: state.hasSider,
    padded: state.padded,
    title: state.title,
    description: state.description,
    sectionTitle: 'Workspace section',
    sectionDescription: 'Reusable layout-shell content that remains route-agnostic.',
    widgetTitle: 'Workspace widget',
    widgetDescription: 'Nested widget shell inside the layout shell.',
    sidebarNotes: ['Widgets', 'Systems', 'Theme-aware'],
    footerText: 'Layer order: core + systems -> widgets -> page-templates -> apps',
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
