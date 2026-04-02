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

type UiVerticalLayoutLabState = {
  gap: string;
  scroll: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
};

const defaultState: Readonly<UiVerticalLayoutLabState> = Object.freeze({
  gap: 'var(--ui-space-3)',
  scroll: false,
  subtreeTheme: 'inherit',
});

const defaultItems = ['Filters', 'Approvals', 'Escalations'] as const;
const scrollItems = [
  'Daily ops review',
  'Revenue handoff',
  'Launch audit',
  'Incident follow-up',
  'Quarter close',
  'Vendor sync',
] as const;

function serializeCopy(format: LabCopyFormat, state: UiVerticalLayoutLabState) {
  const payload = {
    gap: state.gap,
    ...(state.scroll ? { scroll: true } : {}),
  };

  return serializeByFormat(
    format,
    payload,
    () =>
      `<script setup lang="ts">\nimport { UiVerticalLayout } from '@ww/page-templates';\n</script>\n\n<template>\n  <div${state.scroll ? '\n    style="max-block-size: 12rem;"' : ''}\n  >\n    <UiVerticalLayout\n      gap="${state.gap}"${state.scroll ? '\n      scroll' : ''}\n    >\n${(state.scroll
        ? scrollItems
        : defaultItems
      )
        .map(
          (item) =>
            `      <div style="padding: var(--ui-space-3) var(--ui-space-4); border: 1px solid var(--ui-border-subtle); border-radius: var(--ui-radius-lg);">${item}</div>`
        )
        .join('\n')}\n    </UiVerticalLayout>\n  </div>\n</template>\n`
  );
}

function buildMatrixItems(): readonly LabMatrixItem<UiVerticalLayoutLabState>[] {
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
      title: 'Vertical scroll',
      patch: {
        scroll: true,
      },
    },
  ];
}

const definition: LabSurfaceDefinition<UiVerticalLayoutLabState> = {
  id: 'ui-vertical-layout',
  title: 'UiVerticalLayout',
  description: 'Vertical flow shell with consumer-defined gap and opt-in vertical scrolling.',
  defaultState,
  controlSections: [
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        { id: 'gap', kind: 'text', label: 'Gap CSS value', placeholder: 'var(--ui-space-3)' },
        { id: 'scroll', kind: 'boolean', label: 'Vertical scroll' },
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
      'Shrink-wraps to content by default and only scrolls on the vertical axis when the container is constrained.',
    direction: 'vertical',
    gap: state.gap,
    items: state.scroll ? scrollItems : defaultItems,
    scroll: state.scroll,
    title: 'UiVerticalLayout',
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
