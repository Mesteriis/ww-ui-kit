import {
  createSignal,
  signalGraphFocusEdges,
  signalGraphFocusNodes,
  signalGraphNodeDefinitions,
  signalGraphOverviewEdges,
  signalGraphOverviewNodes,
} from '../../signal-graph-demo';

import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import SignalGraphLabPreview from '../components/SignalGraphLabPreview.vue';
import {
  buildThemeScopeAttrs,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type UiSignalGraphLabState = {
  mode: 'default' | 'loading' | 'empty' | 'error';
  depthMode: 'full' | 'lite';
  interactionMode: 'interactive' | 'readonly';
  showMiniMap: boolean;
  showControls: boolean;
  reducedMotion: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const defaultState: Readonly<UiSignalGraphLabState> = Object.freeze({
  mode: 'default',
  depthMode: 'full',
  interactionMode: 'interactive',
  showMiniMap: true,
  showControls: true,
  reducedMotion: false,
  subtreeTheme: 'inherit',
  matrixPresets: ['default', 'lite-depth', 'reduced-motion'],
});

function buildMatrixItems(
  state: UiSignalGraphLabState
): readonly LabMatrixItem<UiSignalGraphLabState>[] {
  return state.matrixPresets.map((preset) => {
    if (preset === 'lite-depth') {
      return {
        id: preset,
        title: 'Lite depth',
        patch: {
          depthMode: 'lite',
        },
      };
    }

    if (preset === 'reduced-motion') {
      return {
        id: preset,
        title: 'Reduced motion',
        patch: {
          reducedMotion: true,
        },
      };
    }

    return {
      id: preset,
      title: 'Default graph',
      patch: {},
    };
  });
}

function serializeCopy(format: LabCopyFormat, state: UiSignalGraphLabState) {
  const payload = {
    ...(state.depthMode !== 'full' ? { depthMode: state.depthMode } : {}),
    ...(state.interactionMode !== 'interactive' ? { interactionMode: state.interactionMode } : {}),
    ...(state.showMiniMap ? { showMiniMap: true } : {}),
    ...(state.showControls ? { showControls: true } : {}),
    ...(state.reducedMotion ? { options: { motionMode: 'reduced' } } : {}),
    ...(state.mode === 'loading' ? { loading: true } : {}),
    ...(state.mode === 'empty' ? { empty: true } : {}),
    ...(state.mode === 'error' ? { error: 'Unable to render graph.' } : {}),
  };

  return serializeByFormat(
    format,
    payload,
    () =>
      `<script setup lang="ts">\nimport { UiSignalGraph } from '@ww/signal-graph';\n\nconst nodes = sampleNodes;\nconst edges = sampleEdges;\nconst nodeDefinitions = sampleNodeDefinitions;\n</script>\n\n<template>\n  <UiSignalGraph\n    :nodes="nodes"\n    :edges="edges"\n    :node-definitions="nodeDefinitions"\n${state.depthMode !== 'full' ? `    depth-mode="${state.depthMode}"\n` : ''}${state.interactionMode !== 'interactive' ? `    interaction-mode="${state.interactionMode}"\n` : ''}${state.showMiniMap ? '    show-mini-map\n' : ''}${state.showControls ? '    show-controls\n' : ''}${state.reducedMotion ? `    :options="{ motionMode: 'reduced' }"\n` : ''}${state.mode === 'loading' ? '    loading\n' : ''}${state.mode === 'empty' ? '    empty\n' : ''}${state.mode === 'error' ? '    error="Unable to render graph."\n' : ''}  />\n</template>\n`
  );
}

const definition: LabSurfaceDefinition<UiSignalGraphLabState> = {
  id: 'ui-signal-graph',
  title: 'UiSignalGraph',
  description:
    'Feature-first graph runtime with node components, depth focus, signals, and theme-aware overlays.',
  defaultState,
  controlSections: [
    {
      id: 'surface',
      title: 'Surface',
      controls: [
        {
          id: 'mode',
          kind: 'segment',
          label: 'Mode',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Loading', value: 'loading' },
            { label: 'Empty', value: 'empty' },
            { label: 'Error', value: 'error' },
          ],
        },
        {
          id: 'depthMode',
          kind: 'segment',
          label: 'Depth',
          options: [
            { label: 'Full', value: 'full' },
            { label: 'Lite', value: 'lite' },
          ],
        },
        {
          id: 'interactionMode',
          kind: 'segment',
          label: 'Interaction',
          options: [
            { label: 'Interactive', value: 'interactive' },
            { label: 'Readonly', value: 'readonly' },
          ],
        },
      ],
    },
    {
      id: 'controls',
      title: 'Runtime',
      controls: [
        { id: 'showMiniMap', kind: 'boolean', label: 'Mini map' },
        { id: 'showControls', kind: 'boolean', label: 'Controls' },
        { id: 'reducedMotion', kind: 'boolean', label: 'Reduced motion' },
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
            { label: 'Lite depth', value: 'lite-depth' },
            { label: 'Reduced motion', value: 'reduced-motion' },
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
  previewComponent: markPreviewComponent(SignalGraphLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    graphProps: {
      ariaLabel: 'Component lab signal graph',
      nodes: state.depthMode === 'lite' ? signalGraphFocusNodes : signalGraphOverviewNodes,
      edges: state.depthMode === 'lite' ? signalGraphFocusEdges : signalGraphOverviewEdges,
      nodeDefinitions: signalGraphNodeDefinitions,
      depthMode: state.depthMode,
      interactionMode: state.interactionMode,
      showBackground: true,
      showControls: state.showControls,
      showMiniMap: state.showMiniMap,
      loading: state.mode === 'loading',
      empty: state.mode === 'empty',
      error: state.mode === 'error' ? 'Unable to render graph.' : false,
      options: {
        motionMode: state.reducedMotion ? 'reduced' : 'full',
      },
    },
    signalBursts: [
      {
        id: 'info',
        label: 'Info burst',
        signals: [createSignal('ingress-router', 'info', 'lab-1')],
      },
      {
        id: 'danger',
        label: 'Danger burst',
        signals: [createSignal('worker-overlay', 'danger', 'lab-2')],
      },
    ],
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
