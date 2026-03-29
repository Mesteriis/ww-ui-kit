import { UiCard } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { createSimpleMatrix } from '../runtime/schema-helpers';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiCardLabState = {
  headerText: string;
  bodyText: string;
  footerText: string;
  showHeader: boolean;
  showFooter: boolean;
  matrixLayouts: readonly string[];
};

const defaultState: Readonly<UiCardLabState> = Object.freeze({
  headerText: 'System summary',
  bodyText: 'Composable card surface for content, controls, and layout groupings.',
  footerText: 'Footer metadata',
  showHeader: true,
  showFooter: true,
  matrixLayouts: ['body-only', 'header-body', 'header-body-footer'],
});

const definition: LabSurfaceDefinition<UiCardLabState> = createSimpleSurfaceDefinition({
  id: 'ui-card',
  title: 'UiCard',
  description: 'Baseline container surface for grouped content, controls, and metadata.',
  packageName: '@ww/core',
  exportName: 'UiCard',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'headerText', kind: 'text', label: 'Header text' },
        { id: 'bodyText', kind: 'text', label: 'Body text' },
        { id: 'footerText', kind: 'text', label: 'Footer text' },
      ],
    },
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        { id: 'showHeader', kind: 'boolean', label: 'Show header' },
        { id: 'showFooter', kind: 'boolean', label: 'Show footer' },
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
            { label: 'Body only', value: 'body-only' },
            { label: 'Header + body', value: 'header-body' },
            { label: 'Header + body + footer', value: 'header-body-footer' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) =>
    createSimpleMatrix(state.matrixLayouts, ['card'], (layout) => ({
      showHeader: layout !== 'body-only',
      showFooter: layout === 'header-body-footer',
    })),
  component: UiCard,
  buildComponentProps: () => ({}),
  buildPreviewSlots: (state) => ({
    ...(state.showHeader ? { header: () => state.headerText } : {}),
    default: () => state.bodyText,
    ...(state.showFooter ? { footer: () => state.footerText } : {}),
  }),
  buildSnippetProps: () => ({}),
  buildSnippetSlots: (state) => [
    ...(state.showHeader ? [{ name: 'header', content: () => state.headerText }] : []),
    {
      content: () => state.bodyText,
    },
    ...(state.showFooter ? [{ name: 'footer', content: () => state.footerText }] : []),
  ],
});

export default definition;
