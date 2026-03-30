import { UiAlert } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';
import { createSimpleMatrix } from '../runtime/schema-helpers';

type UiAlertLabState = {
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  appearance: 'soft' | 'outline' | 'solid';
  closable: boolean;
  showIcon: boolean;
  banner: boolean;
  matrixTypes: readonly string[];
  matrixAppearances: readonly string[];
};

const alertTypeOptions = [
  { label: 'Info', value: 'info' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
] as const;

const alertAppearanceOptions = [
  { label: 'Soft', value: 'soft' },
  { label: 'Outline', value: 'outline' },
  { label: 'Solid', value: 'solid' },
] as const;

const defaultState: Readonly<UiAlertLabState> = Object.freeze({
  title: 'Contract review pending',
  description: 'Alert semantics stay structural and live within the baseline feedback family.',
  type: 'warning',
  appearance: 'soft',
  closable: true,
  showIcon: true,
  banner: false,
  matrixTypes: ['info', 'success', 'warning', 'error'],
  matrixAppearances: ['soft', 'outline'],
});

const definition: LabSurfaceDefinition<UiAlertLabState> = createSimpleSurfaceDefinition({
  id: 'ui-alert',
  title: 'UiAlert',
  description: 'Baseline feedback surface for inline status, warnings, and errors.',
  packageName: '@ww/core',
  exportName: 'UiAlert',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'title', kind: 'text', label: 'Title' },
        { id: 'description', kind: 'text', label: 'Description' },
      ],
    },
    {
      id: 'variants',
      title: 'Variants',
      controls: [
        { id: 'type', kind: 'segment', label: 'Type', options: alertTypeOptions },
        {
          id: 'appearance',
          kind: 'segment',
          label: 'Appearance',
          options: alertAppearanceOptions,
        },
      ],
    },
    {
      id: 'states',
      title: 'States',
      controls: [
        { id: 'closable', kind: 'boolean', label: 'Closable' },
        { id: 'showIcon', kind: 'boolean', label: 'Show icon' },
        { id: 'banner', kind: 'boolean', label: 'Banner' },
      ],
    },
    {
      id: 'matrix',
      title: 'Matrix filters',
      controls: [
        {
          id: 'matrixTypes',
          kind: 'multi-toggle',
          label: 'Types',
          options: alertTypeOptions,
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
        {
          id: 'matrixAppearances',
          kind: 'multi-toggle',
          label: 'Appearances',
          options: alertAppearanceOptions,
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) =>
    createSimpleMatrix(state.matrixTypes, state.matrixAppearances, (type, appearance) => ({
      type: type as UiAlertLabState['type'],
      appearance: appearance as UiAlertLabState['appearance'],
      banner: false,
    })),
  component: UiAlert,
  buildComponentProps: (state) => ({
    title: state.title,
    description: state.description,
    type: state.type,
    appearance: state.appearance,
    closable: state.closable,
    showIcon: state.showIcon,
    banner: state.banner,
  }),
  buildSnippetProps: (state) => ({
    title: state.title,
    description: state.description,
    ...(state.type !== 'info' ? { type: state.type } : {}),
    ...(state.appearance !== 'soft' ? { appearance: state.appearance } : {}),
    ...(state.closable ? { closable: true } : {}),
    ...(state.showIcon === false ? { showIcon: false } : {}),
    ...(state.banner ? { banner: true } : {}),
  }),
});

export default definition;
