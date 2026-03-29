import { UiBadge } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { badgeVariantOptions } from '../runtime/core-control-options';
import { createSimpleMatrix } from '../runtime/schema-helpers';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiBadgeLabState = {
  label: string;
  variant: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
  matrixVariants: readonly string[];
};

const defaultState: Readonly<UiBadgeLabState> = Object.freeze({
  label: 'Theme-aware surface',
  variant: 'brand',
  matrixVariants: ['neutral', 'brand', 'success', 'warning', 'danger'],
});

const definition: LabSurfaceDefinition<UiBadgeLabState> = createSimpleSurfaceDefinition({
  id: 'ui-badge',
  title: 'UiBadge',
  description: 'Small emphasis surface for concise labels and status hints.',
  packageName: '@ww/core',
  exportName: 'UiBadge',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [{ id: 'label', kind: 'text', label: 'Label' }],
    },
    {
      id: 'variant',
      title: 'Variant',
      controls: [
        { id: 'variant', kind: 'segment', label: 'Variant', options: badgeVariantOptions },
      ],
    },
    {
      id: 'matrix',
      title: 'Matrix filters',
      controls: [
        {
          id: 'matrixVariants',
          kind: 'multi-toggle',
          label: 'Variants',
          options: badgeVariantOptions,
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) =>
    createSimpleMatrix(state.matrixVariants, ['badge'], (variant) => ({
      variant: variant as UiBadgeLabState['variant'],
    })),
  component: UiBadge,
  buildComponentProps: (state) => ({
    variant: state.variant,
  }),
  buildPreviewSlots: (state) => ({
    default: () => state.label,
  }),
  buildSnippetProps: (state) => ({
    ...(state.variant !== 'neutral' ? { variant: state.variant } : {}),
  }),
  buildSnippetSlots: (state) => [
    {
      content: () => state.label,
    },
  ],
});

export default definition;
