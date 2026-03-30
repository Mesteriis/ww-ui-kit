import { UiAvatar } from '@ww/core';

import type { LabMatrixItem, LabSurfaceDefinition } from '../manifest/component-lab.types';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiAvatarLabState = {
  alt: string;
  contentMode: 'initials' | 'icon' | 'default';
  initials: string;
  icon: string;
  size: 'sm' | 'md' | 'lg';
  shape: 'circle' | 'square';
  tone: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  matrixPresets: readonly string[];
};

const contentModeOptions = [
  { label: 'Initials', value: 'initials' },
  { label: 'Icon', value: 'icon' },
  { label: 'Default', value: 'default' },
] as const;

const sizeOptions = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
] as const;

const shapeOptions = [
  { label: 'Circle', value: 'circle' },
  { label: 'Square', value: 'square' },
] as const;

const toneOptions = [
  { label: 'Neutral', value: 'neutral' },
  { label: 'Brand', value: 'brand' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Danger', value: 'danger' },
  { label: 'Info', value: 'info' },
] as const;

const defaultState: Readonly<UiAvatarLabState> = Object.freeze({
  alt: 'Belovodye avatar',
  contentMode: 'initials',
  initials: 'BV',
  icon: '⚙',
  size: 'md',
  shape: 'circle',
  tone: 'brand',
  matrixPresets: ['default', 'square', 'tones'],
});

const definition: LabSurfaceDefinition<UiAvatarLabState> = createSimpleSurfaceDefinition({
  id: 'ui-avatar',
  title: 'UiAvatar',
  description: 'Avatar surface with initials, icon, and themed fallback states.',
  packageName: '@ww/core',
  exportName: 'UiAvatar',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'alt', kind: 'text', label: 'Alt text' },
        { id: 'contentMode', kind: 'segment', label: 'Fallback mode', options: contentModeOptions },
        { id: 'initials', kind: 'text', label: 'Initials' },
        { id: 'icon', kind: 'text', label: 'Icon' },
      ],
    },
    {
      id: 'surface',
      title: 'Surface',
      controls: [
        { id: 'size', kind: 'segment', label: 'Size', options: sizeOptions },
        { id: 'shape', kind: 'segment', label: 'Shape', options: shapeOptions },
        { id: 'tone', kind: 'select', label: 'Tone', options: toneOptions },
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
            { label: 'Square', value: 'square' },
            { label: 'Tone sweep', value: 'tones' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) => {
    const items: LabMatrixItem<UiAvatarLabState>[] = [];

    if (state.matrixPresets.includes('default')) {
      items.push({
        id: 'default',
        title: 'Default avatar',
        patch: {},
      });
    }

    if (state.matrixPresets.includes('square')) {
      items.push({
        id: 'square',
        title: 'Square avatar',
        patch: { shape: 'square' },
      });
    }

    if (state.matrixPresets.includes('tones')) {
      items.push(
        ...toneOptions.map((tone) => ({
          id: `tone-${tone.value}`,
          title: `${tone.label} tone`,
          patch: {
            tone: tone.value,
          },
        }))
      );
    }

    return items;
  },
  component: UiAvatar,
  buildComponentProps: (state) => ({
    alt: state.alt,
    ...(state.contentMode === 'initials' ? { initials: state.initials } : {}),
    ...(state.contentMode === 'icon' ? { icon: state.icon } : {}),
    size: state.size,
    shape: state.shape,
    tone: state.tone,
  }),
  buildSnippetProps: (state) => ({
    alt: state.alt,
    ...(state.contentMode === 'initials' ? { initials: state.initials } : {}),
    ...(state.contentMode === 'icon' ? { icon: state.icon } : {}),
    ...(state.size !== 'md' ? { size: state.size } : {}),
    ...(state.shape !== 'circle' ? { shape: state.shape } : {}),
    ...(state.tone !== 'brand' ? { tone: state.tone } : { tone: 'brand' }),
  }),
});

export default definition;
