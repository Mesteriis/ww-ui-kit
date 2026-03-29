import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import WidgetShellLabPreview from '../components/WidgetShellLabPreview.vue';
import {
  buildThemeScopeAttrs,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type UiWidgetShellLabState = {
  title: string;
  description: string;
  bodyText: string;
  footerText: string;
  surface: 'default' | 'subtle' | 'elevated';
  padded: boolean;
  loading: boolean;
  error: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const defaultState: Readonly<UiWidgetShellLabState> = Object.freeze({
  title: 'Login window shell',
  description: 'Reusable widget shell above core and systems.',
  bodyText:
    'Compose future widgets here without moving routing or backend orchestration into the UI kit.',
  footerText: 'Footer metadata stays shell-level.',
  surface: 'default',
  padded: true,
  loading: false,
  error: false,
  subtreeTheme: 'inherit',
  matrixPresets: ['default', 'subtle', 'loading', 'error'],
});

function buildMatrixItems(
  state: UiWidgetShellLabState
): readonly LabMatrixItem<UiWidgetShellLabState>[] {
  return state.matrixPresets.map((preset) => {
    if (preset === 'subtle') {
      return {
        id: preset,
        title: 'Subtle shell',
        patch: {
          surface: 'subtle',
        },
      };
    }

    if (preset === 'loading') {
      return {
        id: preset,
        title: 'Loading shell',
        patch: {
          loading: true,
        },
      };
    }

    if (preset === 'error') {
      return {
        id: preset,
        title: 'Error shell',
        patch: {
          error: true,
        },
      };
    }

    return {
      id: preset,
      title: 'Default shell',
      patch: {},
    };
  });
}

function serializeCopy(format: LabCopyFormat, state: UiWidgetShellLabState) {
  const payload = {
    ...(state.title ? { title: state.title } : {}),
    ...(state.description ? { description: state.description } : {}),
    ...(state.surface !== 'default' ? { surface: state.surface } : {}),
    ...(state.padded === false ? { padded: false } : {}),
    ...(state.loading ? { loading: true } : {}),
    ...(state.error ? { error: true } : {}),
  };

  return serializeByFormat(
    format,
    payload,
    () =>
      `<script setup lang="ts">\nimport { UiWidgetShell } from '@ww/widgets';\n</script>\n\n<template>\n  <UiWidgetShell${payload.title ? `\n    title=${JSON.stringify(state.title)}` : ''}${payload.description ? `\n    description=${JSON.stringify(state.description)}` : ''}${state.surface !== 'default' ? `\n    surface="${state.surface}"` : ''}${state.padded === false ? '\n    :padded="false"' : ''}${state.loading ? '\n    loading' : ''}${state.error ? '\n    error' : ''}\n  >\n    ${state.bodyText}\n  </UiWidgetShell>\n</template>\n`
  );
}

const definition: LabSurfaceDefinition<UiWidgetShellLabState> = {
  id: 'ui-widget-shell',
  title: 'UiWidgetShell',
  description: 'Reusable widget shell for black-box compositions above systems.',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'title', kind: 'text', label: 'Title' },
        { id: 'description', kind: 'text', label: 'Description' },
        { id: 'bodyText', kind: 'text', label: 'Body copy' },
        { id: 'footerText', kind: 'text', label: 'Footer copy' },
      ],
    },
    {
      id: 'surface',
      title: 'Surface',
      controls: [
        {
          id: 'surface',
          kind: 'segment',
          label: 'Shell surface',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Subtle', value: 'subtle' },
            { label: 'Elevated', value: 'elevated' },
          ],
        },
        { id: 'padded', kind: 'boolean', label: 'Padded body' },
        { id: 'loading', kind: 'boolean', label: 'Loading' },
        { id: 'error', kind: 'boolean', label: 'Error' },
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
            { label: 'Subtle', value: 'subtle' },
            { label: 'Loading', value: 'loading' },
            { label: 'Error', value: 'error' },
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
  previewComponent: markPreviewComponent(WidgetShellLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    widgetProps: {
      title: state.title,
      description: state.description,
      surface: state.surface,
      padded: state.padded,
      loading: state.loading,
      error: state.error,
    },
    bodyText: state.bodyText,
    footerText: state.footerText,
    badges: ['Widgets', 'Systems'],
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
