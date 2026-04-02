import type {
  UiTsParticlesBackdropColorVar,
  UiTsParticlesBackdropOptions,
  UiTsParticlesBackdropSize,
} from '@ww/tsparticles';

import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import TsParticlesBackdropLabPreview from '../components/TsParticlesBackdropLabPreview.vue';
import {
  buildThemeScopeAttrs,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type DensityPreset = 'calm' | 'balanced' | 'dense';

type UiTsParticlesBackdropLabState = {
  size: UiTsParticlesBackdropSize;
  density: DensityPreset;
  disabled: boolean;
  particleColorVar: UiTsParticlesBackdropColorVar;
  linkColorVar: UiTsParticlesBackdropColorVar;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixSizes: readonly string[];
  matrixDensities: readonly string[];
  matrixStates: readonly string[];
};

const densityOptions: Record<DensityPreset, UiTsParticlesBackdropOptions> = {
  calm: {
    particles: {
      links: {
        distance: 168,
        opacity: 0.1,
      },
      move: {
        speed: 0.14,
      },
      number: {
        value: 12,
      },
      opacity: {
        value: 0.2,
      },
      size: {
        value: {
          min: 1,
          max: 2,
        },
      },
    },
  },
  balanced: {
    particles: {
      links: {
        distance: 140,
        opacity: 0.16,
      },
      move: {
        speed: 0.22,
      },
      number: {
        value: 24,
      },
      opacity: {
        value: 0.24,
      },
      size: {
        value: {
          min: 1,
          max: 2,
        },
      },
    },
  },
  dense: {
    particles: {
      links: {
        distance: 112,
        opacity: 0.2,
      },
      move: {
        speed: 0.18,
      },
      number: {
        value: 40,
      },
      opacity: {
        value: 0.3,
      },
      size: {
        value: {
          min: 1,
          max: 3,
        },
      },
    },
  },
};

const defaultState: Readonly<UiTsParticlesBackdropLabState> = Object.freeze({
  size: 'auto',
  density: 'balanced',
  disabled: false,
  particleColorVar: '--ui-border-focus',
  linkColorVar: '--ui-border-subtle',
  subtreeTheme: 'inherit',
  matrixSizes: ['auto', 'fill'],
  matrixDensities: ['calm', 'balanced', 'dense'],
  matrixStates: ['active', 'disabled'],
});

function buildOptions(state: UiTsParticlesBackdropLabState) {
  return densityOptions[state.density];
}

function buildMatrixItems(
  state: UiTsParticlesBackdropLabState
): readonly LabMatrixItem<UiTsParticlesBackdropLabState>[] {
  const items: LabMatrixItem<UiTsParticlesBackdropLabState>[] = [];

  for (const size of state.matrixSizes) {
    for (const density of state.matrixDensities) {
      for (const surfaceState of state.matrixStates) {
        items.push({
          id: `${size}-${density}-${surfaceState}`,
          title: `${size} / ${density} / ${surfaceState}`,
          patch: {
            size: size as UiTsParticlesBackdropSize,
            density: density as DensityPreset,
            disabled: surfaceState === 'disabled',
          },
        });
      }
    }
  }

  return items;
}

function serializeCopy(format: LabCopyFormat, state: UiTsParticlesBackdropLabState) {
  const options = buildOptions(state);
  const payload = {
    ...(state.size !== 'auto' ? { size: state.size } : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ...(state.particleColorVar !== '--ui-border-focus'
      ? { particleColorVar: state.particleColorVar }
      : {}),
    ...(state.linkColorVar !== '--ui-border-subtle' ? { linkColorVar: state.linkColorVar } : {}),
    options,
  };

  return serializeByFormat(format, payload, () => {
    const attributes = [
      ...(state.size !== 'auto' ? [`size="${state.size}"`] : []),
      ...(state.disabled ? ['disabled'] : []),
      ...(state.particleColorVar !== '--ui-border-focus'
        ? [`particle-color-var="${state.particleColorVar}"`]
        : []),
      ...(state.linkColorVar !== '--ui-border-subtle'
        ? [`link-color-var="${state.linkColorVar}"`]
        : []),
      ':options="options"',
    ];

    return `<script setup lang="ts">\nimport {\n  UiTsParticlesBackdrop,\n  type UiTsParticlesBackdropOptions,\n} from '@ww/tsparticles';\n\nconst options: UiTsParticlesBackdropOptions = ${JSON.stringify(options, null, 2)};\n</script>\n\n<template>\n  <UiTsParticlesBackdrop\n    ${attributes.join('\n    ')}\n  >\n    <div>Decorative backdrop content</div>\n  </UiTsParticlesBackdrop>\n</template>\n`;
  });
}

const definition: LabSurfaceDefinition<UiTsParticlesBackdropLabState> = {
  id: 'ui-tsparticles-backdrop',
  title: 'UiTsParticlesBackdrop',
  description:
    'Neutral vendor-backed particle backdrop wrapper that stays token-driven and layout-safe.',
  defaultState,
  controlSections: [
    {
      id: 'surface',
      title: 'Surface',
      controls: [
        {
          id: 'size',
          kind: 'segment',
          label: 'Size',
          options: [
            { label: 'Auto', value: 'auto' },
            { label: 'Fill', value: 'fill' },
          ],
        },
        {
          id: 'density',
          kind: 'segment',
          label: 'Density',
          options: [
            { label: 'Calm', value: 'calm' },
            { label: 'Balanced', value: 'balanced' },
            { label: 'Dense', value: 'dense' },
          ],
        },
        { id: 'disabled', kind: 'boolean', label: 'Disabled' },
        { id: 'subtreeTheme', kind: 'select', label: 'Theme scope', options: themeScopeOptions },
      ],
    },
    {
      id: 'tokens',
      title: 'Token colors',
      controls: [
        {
          id: 'particleColorVar',
          kind: 'select',
          label: 'Particle color',
          options: [
            { label: 'Border focus', value: '--ui-border-focus' },
            { label: 'Text primary', value: '--ui-text-primary' },
            { label: 'Text secondary', value: '--ui-text-secondary' },
          ],
        },
        {
          id: 'linkColorVar',
          kind: 'select',
          label: 'Link color',
          options: [
            { label: 'Border subtle', value: '--ui-border-subtle' },
            { label: 'Border strong', value: '--ui-border-strong' },
            { label: 'Text muted', value: '--ui-text-muted' },
          ],
        },
      ],
    },
    {
      id: 'matrix',
      title: 'Matrix filters',
      controls: [
        {
          id: 'matrixSizes',
          kind: 'multi-toggle',
          label: 'Sizes',
          options: [
            { label: 'Auto', value: 'auto' },
            { label: 'Fill', value: 'fill' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
        {
          id: 'matrixDensities',
          kind: 'multi-toggle',
          label: 'Densities',
          options: [
            { label: 'Calm', value: 'calm' },
            { label: 'Balanced', value: 'balanced' },
            { label: 'Dense', value: 'dense' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
        {
          id: 'matrixStates',
          kind: 'multi-toggle',
          label: 'States',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Disabled', value: 'disabled' },
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
  previewComponent: markPreviewComponent(TsParticlesBackdropLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    wrapperAttrs: buildThemeScopeAttrs(state, context),
    componentProps: {
      size: state.size,
      disabled: state.disabled,
      particleColorVar: state.particleColorVar,
      linkColorVar: state.linkColorVar,
      options: buildOptions(state),
    },
    densityLabel: state.density,
    frameStyle:
      state.size === 'fill'
        ? {
            minBlockSize: '22rem',
            inlineSize: 'min(100%, 42rem)',
            border: '1px dashed var(--ui-border-subtle)',
            borderRadius: 'var(--ui-radius-xl)',
            overflow: 'hidden',
          }
        : {
            inlineSize: 'min(100%, 24rem)',
            border: '1px dashed var(--ui-border-subtle)',
            borderRadius: 'var(--ui-radius-xl)',
            overflow: 'hidden',
          },
  }),
};

export default definition;
