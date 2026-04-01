import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import FlowLayoutLabPreview from '../components/FlowLayoutLabPreview.vue';
import {
  buildThemeScopeAttrs,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type UiHorizontalLayoutLabState = {
  gap: string;
  scroll: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
};

const defaultState: Readonly<UiHorizontalLayoutLabState> = Object.freeze({
  gap: 'var(--ui-space-3)',
  scroll: false,
  subtreeTheme: 'inherit',
});

const defaultItems = ['North lane', 'Bravo lane', 'Charlie lane'] as const;
const scrollItems = [
  'Executive summary',
  'Delivery desk',
  'Incident review',
  'Quarter close',
  'Launch readiness',
  'Archive queue',
] as const;

function serializeCopy(format: LabCopyFormat, state: UiHorizontalLayoutLabState) {
  const payload = {
    gap: state.gap,
    ...(state.scroll ? { scroll: true } : {}),
  };

  return serializeByFormat(
    format,
    payload,
    () =>
      `<script setup lang="ts">\nimport { UiHorizontalLayout } from '@ww/page-templates';\n</script>\n\n<template>\n  <div${state.scroll ? '\n    style="max-inline-size: 18rem;"' : ''}\n  >\n    <UiHorizontalLayout\n      gap="${state.gap}"${state.scroll ? '\n      scroll' : ''}\n    >\n${(state.scroll
        ? scrollItems
        : defaultItems
      )
        .map(
          (item) =>
            `      <div style="padding: var(--ui-space-3) var(--ui-space-4); border: 1px solid var(--ui-border-subtle); border-radius: var(--ui-radius-lg); white-space: nowrap;">${item}</div>`
        )
        .join('\n')}\n    </UiHorizontalLayout>\n  </div>\n</template>\n`
  );
}

function buildMatrixItems(): readonly LabMatrixItem<UiHorizontalLayoutLabState>[] {
  return [
    {
      id: 'default',
      title: 'Shrink-wrap default',
      patch: {
        scroll: false,
      },
    },
    {
      id: 'scroll',
      title: 'Horizontal scroll',
      patch: {
        scroll: true,
      },
    },
  ];
}

const definition: LabSurfaceDefinition<UiHorizontalLayoutLabState> = {
  id: 'ui-horizontal-layout',
  title: 'UiHorizontalLayout',
  description: 'Horizontal flow shell with consumer-defined gap and opt-in horizontal scrolling.',
  defaultState,
  controlSections: [
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        { id: 'gap', kind: 'text', label: 'Gap CSS value', placeholder: 'var(--ui-space-3)' },
        { id: 'scroll', kind: 'boolean', label: 'Horizontal scroll' },
        { id: 'subtreeTheme', kind: 'select', label: 'Theme scope', options: themeScopeOptions },
      ],
    },
  ],
  previewModes: ['single', 'matrix'],
  defaultPreviewMode: 'single',
  copyFormats: ['json', 'ts-object', 'vue'],
  defaultCopyFormat: 'vue',
  previewComponent: markPreviewComponent(FlowLayoutLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    description:
      'Keeps natural content width by default and only scrolls on the horizontal axis when the container is constrained.',
    direction: 'horizontal',
    gap: state.gap,
    items: state.scroll ? scrollItems : defaultItems,
    scroll: state.scroll,
    title: 'UiHorizontalLayout',
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
