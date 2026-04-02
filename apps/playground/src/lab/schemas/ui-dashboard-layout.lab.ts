import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import DashboardLayoutLabPreview from '../components/DashboardLayoutLabPreview.vue';
import {
  buildThemeScopeAttrs,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type UiDashboardLayoutLabState = {
  productTitle: string;
  slogan: string;
  headerTitle: string;
  headerDescription: string;
  primaryActionLabel: string;
  showSecondaryAction: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const defaultState: Readonly<UiDashboardLayoutLabState> = Object.freeze({
  productTitle: 'Willow Works Analytics',
  slogan: 'Governed dashboard shell for operations, rollout, and review work.',
  headerTitle: 'Operations cockpit',
  headerDescription:
    'Slot-driven dashboard framing with a persistent aside, structured header, and pure layout-only composition.',
  primaryActionLabel: 'Create insight',
  showSecondaryAction: true,
  subtreeTheme: 'inherit',
  matrixPresets: ['default', 'single-action', 'scoped-theme'],
});

function buildMatrixItems(
  state: UiDashboardLayoutLabState
): readonly LabMatrixItem<UiDashboardLayoutLabState>[] {
  return state.matrixPresets.map((preset) => {
    if (preset === 'single-action') {
      return {
        id: preset,
        title: 'Single aside action',
        patch: {
          showSecondaryAction: false,
        },
      };
    }

    if (preset === 'scoped-theme') {
      return {
        id: preset,
        title: 'Scoped theme',
        patch: {
          subtreeTheme: 'belovodye',
        },
      };
    }

    return {
      id: preset,
      title: 'Default dashboard shell',
      patch: {},
    };
  });
}

function serializeCopy(format: LabCopyFormat, state: UiDashboardLayoutLabState) {
  const payload = {
    ...(state.productTitle ? { productTitle: state.productTitle } : {}),
    ...(state.slogan ? { slogan: state.slogan } : {}),
    ...(state.headerTitle ? { headerTitle: state.headerTitle } : {}),
    ...(state.headerDescription ? { headerDescription: state.headerDescription } : {}),
    ...(state.primaryActionLabel ? { primaryActionLabel: state.primaryActionLabel } : {}),
    ...(state.showSecondaryAction === false ? { showSecondaryAction: false } : {}),
  };

  return serializeByFormat(
    format,
    payload,
    () =>
      `<script setup lang="ts">\nimport { UiButton, UiCard, UiDropdown, UiIconButton } from '@ww/core';\nimport { UiDashboardLayout } from '@ww/page-templates';\n\nconst menuItems = [{ label: 'GitHub repository', href: 'https://github.com/Mesteriis/ww-ui-kit' }];\n</script>\n\n<template>\n  <UiDashboardLayout>\n    <template #aside-header>\n      <div style="display: grid; gap: var(--ui-space-3);">\n        <strong>${state.productTitle}</strong>\n        <p style="margin: 0; color: var(--ui-text-secondary);">\n          ${state.slogan}\n        </p>\n      </div>\n    </template>\n\n    <template #aside-content>\n      <nav aria-label="Dashboard navigation">Sidebar navigation</nav>\n    </template>\n\n    <template #aside-actions>\n      <div style="display: grid; gap: var(--ui-space-3);">\n        <UiButton>${state.primaryActionLabel}</UiButton>${state.showSecondaryAction ? `\n        <UiButton variant="secondary">Invite analyst</UiButton>` : ''}\n      </div>\n    </template>\n\n    <template #header>\n      <UiCard>\n        <div style="display: grid; gap: var(--ui-space-2);">\n          <h1 style="margin: 0;">${state.headerTitle}</h1>\n          <p style="margin: 0; color: var(--ui-text-secondary);">\n            ${state.headerDescription}\n          </p>\n        </div>\n      </UiCard>\n    </template>\n\n    <template #header-actions>\n      <UiDropdown :items="menuItems">\n        <template #trigger>\n          <UiIconButton ariaLabel="Open workspace menu" variant="secondary">☰</UiIconButton>\n        </template>\n      </UiDropdown>\n    </template>\n\n    <UiCard>\n      <template #header>Primary content</template>\n      Placeholder dashboard panels\n    </UiCard>\n  </UiDashboardLayout>\n</template>\n`
  );
}

const definition: LabSurfaceDefinition<UiDashboardLayoutLabState> = {
  id: 'ui-dashboard-layout',
  title: 'UiDashboardLayout',
  description: 'Reusable dashboard-like page shell with governed aside and header slot zones.',
  defaultState,
  controlSections: [
    {
      id: 'copy',
      title: 'Copy',
      controls: [
        { id: 'productTitle', kind: 'text', label: 'Product title' },
        { id: 'slogan', kind: 'text', label: 'Slogan' },
        { id: 'headerTitle', kind: 'text', label: 'Header title' },
        { id: 'headerDescription', kind: 'text', label: 'Header description' },
        { id: 'primaryActionLabel', kind: 'text', label: 'Primary action' },
      ],
    },
    {
      id: 'layout',
      title: 'Layout',
      controls: [
        { id: 'showSecondaryAction', kind: 'boolean', label: 'Secondary aside action' },
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
            { label: 'Single action', value: 'single-action' },
            { label: 'Scoped theme', value: 'scoped-theme' },
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
  previewComponent: markPreviewComponent(DashboardLayoutLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    productTitle: state.productTitle,
    slogan: state.slogan,
    headerTitle: state.headerTitle,
    headerDescription: state.headerDescription,
    primaryActionLabel: state.primaryActionLabel,
    showSecondaryAction: state.showSecondaryAction,
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
