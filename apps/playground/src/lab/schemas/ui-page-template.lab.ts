import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import PageTemplateLabPreview from '../components/PageTemplateLabPreview.vue';
import {
  buildThemeScopeAttrs,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type UiPageTemplateLabState = {
  title: string;
  description: string;
  width: 'full' | 'content' | 'narrow';
  hasSidebar: boolean;
  padded: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const defaultState: Readonly<UiPageTemplateLabState> = Object.freeze({
  title: 'Operations workspace',
  description: 'Reusable page shell above widgets and systems.',
  width: 'content',
  hasSidebar: true,
  padded: true,
  subtreeTheme: 'inherit',
  matrixPresets: ['content', 'full', 'narrow'],
});

function buildMatrixItems(
  state: UiPageTemplateLabState
): readonly LabMatrixItem<UiPageTemplateLabState>[] {
  return state.matrixPresets.map((preset) => ({
    id: preset,
    title: `${preset.charAt(0).toUpperCase()}${preset.slice(1)} width`,
    patch: {
      width: preset as UiPageTemplateLabState['width'],
    },
  }));
}

function serializeCopy(format: LabCopyFormat, state: UiPageTemplateLabState) {
  const payload = {
    ...(state.title ? { title: state.title } : {}),
    ...(state.description ? { description: state.description } : {}),
    ...(state.width !== 'content' ? { width: state.width } : {}),
    ...(state.hasSidebar ? { hasSidebar: true } : {}),
    ...(state.padded === false ? { padded: false } : {}),
  };

  return serializeByFormat(
    format,
    payload,
    () =>
      `<script setup lang="ts">\nimport { UiPageSection, UiPageTemplate } from '@ww/page-templates';\n</script>\n\n<template>\n  <UiPageTemplate${payload.title ? `\n    title=${JSON.stringify(state.title)}` : ''}${payload.description ? `\n    description=${JSON.stringify(state.description)}` : ''}${state.width !== 'content' ? `\n    width="${state.width}"` : ''}${state.hasSidebar ? '\n    has-sidebar' : ''}${state.padded === false ? '\n    :padded="false"' : ''}\n  >\n    <UiPageSection title="Workspace section" description="Reusable page-shell content.">\n      Shell content\n    </UiPageSection>\n  </UiPageTemplate>\n</template>\n`
  );
}

const definition: LabSurfaceDefinition<UiPageTemplateLabState> = {
  id: 'ui-page-template',
  title: 'UiPageTemplate',
  description: 'Reusable layout shell above widgets, systems, and core components.',
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
        { id: 'hasSidebar', kind: 'boolean', label: 'Sidebar' },
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
  previewComponent: markPreviewComponent(PageTemplateLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    templateProps: {
      title: state.title,
      description: state.description,
      width: state.width,
      hasSidebar: state.hasSidebar,
      padded: state.padded,
    },
    sectionTitle: 'Workspace section',
    sectionDescription: 'Reusable page-shell content that remains route-agnostic.',
    widgetTitle: 'Workspace widget',
    widgetDescription: 'Nested widget shell inside the page template.',
    sidebarNotes: ['Widgets', 'Systems', 'Theme-aware'],
    footerText: 'Layer order: core + systems -> widgets -> page-templates -> apps',
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
