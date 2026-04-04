import { UiImage } from '@ww/core';

import type { LabMatrixItem, LabSurfaceDefinition } from '../manifest/component-lab.types';
import { buildThemeScopeAttrs, themeScopeOptions } from '../runtime/schema-helpers';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiImageLabState = {
  contentMode: 'loaded' | 'fallback';
  aspect: 'auto' | 'square' | 'landscape' | 'portrait' | 'video';
  fit: 'cover' | 'contain' | 'fill';
  bordered: boolean;
  rounded: boolean;
  caption: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const previewImageSrc = new URL('../../../../assets/img/banner.svg', import.meta.url).href;

const contentModeOptions = [
  { label: 'Loaded', value: 'loaded' },
  { label: 'Fallback', value: 'fallback' },
] as const;

const aspectOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Square', value: 'square' },
  { label: 'Landscape', value: 'landscape' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Video', value: 'video' },
] as const;

const fitOptions = [
  { label: 'Cover', value: 'cover' },
  { label: 'Contain', value: 'contain' },
  { label: 'Fill', value: 'fill' },
] as const;

const defaultState: Readonly<UiImageLabState> = Object.freeze({
  aspect: 'landscape',
  bordered: true,
  caption: true,
  contentMode: 'loaded',
  fit: 'cover',
  matrixPresets: ['loaded', 'fallback', 'contain', 'video'],
  rounded: true,
  subtreeTheme: 'inherit',
});

const definition: LabSurfaceDefinition<UiImageLabState> = createSimpleSurfaceDefinition({
  id: 'ui-image',
  title: 'UiImage',
  description:
    'Base image surface with sanctioned framing, aspect presets, fallback behavior, and caption support.',
  packageName: '@ww/core',
  exportName: 'UiImage',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'contentMode', kind: 'segment', label: 'Content', options: contentModeOptions },
        { id: 'caption', kind: 'boolean', label: 'Caption' },
      ],
    },
    {
      id: 'surface',
      title: 'Surface',
      controls: [
        { id: 'aspect', kind: 'segment', label: 'Aspect', options: aspectOptions },
        { id: 'fit', kind: 'segment', label: 'Fit', options: fitOptions },
        { id: 'bordered', kind: 'boolean', label: 'Bordered' },
        { id: 'rounded', kind: 'boolean', label: 'Rounded' },
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
            { label: 'Loaded', value: 'loaded' },
            { label: 'Fallback', value: 'fallback' },
            { label: 'Contain', value: 'contain' },
            { label: 'Video', value: 'video' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) => {
    const items: LabMatrixItem<UiImageLabState>[] = [];

    if (state.matrixPresets.includes('loaded')) {
      items.push({
        id: 'loaded',
        title: 'Loaded surface',
        patch: {},
      });
    }

    if (state.matrixPresets.includes('fallback')) {
      items.push({
        id: 'fallback',
        title: 'Fallback state',
        patch: {
          aspect: 'square',
          contentMode: 'fallback',
        },
      });
    }

    if (state.matrixPresets.includes('contain')) {
      items.push({
        id: 'contain',
        title: 'Contain fit',
        patch: {
          fit: 'contain',
        },
      });
    }

    if (state.matrixPresets.includes('video')) {
      items.push({
        id: 'video',
        title: 'Video frame',
        patch: {
          aspect: 'video',
        },
      });
    }

    return items;
  },
  component: UiImage,
  buildComponentProps: (state) => ({
    ...(state.contentMode === 'loaded' ? { src: previewImageSrc } : {}),
    alt: state.contentMode === 'loaded' ? 'Core image proof' : 'Fallback-only proof',
    ...(state.caption
      ? { caption: state.contentMode === 'loaded' ? 'Preview surface' : 'Fallback proof' }
      : {}),
    aspect: state.aspect,
    bordered: state.bordered,
    fit: state.fit,
    rounded: state.rounded,
  }),
  buildWrapperAttrs: (state, context) => buildThemeScopeAttrs(state, context),
  buildSnippetProps: (state) => ({
    ...(state.contentMode === 'loaded' ? { src: '/image.png' } : {}),
    ...(state.contentMode === 'loaded'
      ? { alt: 'Core image proof' }
      : { alt: 'Fallback-only proof' }),
    ...(state.caption
      ? {
          caption: state.contentMode === 'loaded' ? 'Preview surface' : 'Fallback proof',
        }
      : {}),
    ...(state.aspect !== 'landscape' ? { aspect: state.aspect } : {}),
    ...(state.fit !== 'cover' ? { fit: state.fit } : {}),
    ...(state.bordered ? { bordered: true } : {}),
    ...(state.rounded === false ? { rounded: false } : {}),
  }),
});

export default definition;
