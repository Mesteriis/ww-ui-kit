import type { Component, ComputedRef, Ref } from 'vue';

import type { ThemeMeta, ThemeName } from '@ww/themes';

export type LabPreviewMode = 'single' | 'matrix';
export type LabCopyFormat = 'json' | 'ts-object' | 'vue';

export interface LabOption<Value extends string | number = string> {
  label: string;
  value: Value;
  description?: string;
}

type BaseControl<Key extends string = string> = {
  id: Key;
  label: string;
  help?: string;
};

export type LabControl<Key extends string = string> =
  | (BaseControl<Key> & {
      kind: 'select' | 'segment';
      options: readonly LabOption[];
    })
  | (BaseControl<Key> & {
      kind: 'boolean';
    })
  | (BaseControl<Key> & {
      kind: 'text';
      placeholder?: string;
    })
  | (BaseControl<Key> & {
      kind: 'number';
      min?: number;
      max?: number;
      step?: number;
    })
  | (BaseControl<Key> & {
      kind: 'multi-toggle';
      options: readonly LabOption[];
      enableAllLabel?: string;
      disableAllLabel?: string;
    });

export interface LabControlSection<Key extends string = string> {
  id: string;
  title: string;
  description?: string;
  controls: readonly LabControl<Key>[];
}

export interface LabMatrixItem<State extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  title: string;
  description?: string;
  patch: Partial<State>;
}

export interface LabPreset<State extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  label: string;
  description?: string;
  patch: Partial<State>;
}

export type LabSlotRenderer = (slotProps?: Record<string, unknown>) => unknown;
export type LabSlots = Record<string, LabSlotRenderer>;

export interface LabPreviewContext {
  themeName: ThemeName;
  themeMeta: ThemeMeta;
}

export interface LabSurfaceDefinition<
  State extends Record<string, unknown> = Record<string, unknown>,
> {
  id: string;
  title: string;
  description: string;
  defaultState: Readonly<State>;
  controlSections: readonly LabControlSection<Extract<keyof State, string>>[];
  previewModes: readonly LabPreviewMode[];
  defaultPreviewMode: LabPreviewMode;
  copyFormats: readonly LabCopyFormat[];
  defaultCopyFormat: LabCopyFormat;
  previewComponent: Component;
  buildMatrixItems: (state: State) => readonly LabMatrixItem<State>[];
  serializeCopy: (format: LabCopyFormat, state: State) => string;
  buildPreviewProps?: (state: State, context: LabPreviewContext) => Record<string, unknown>;
  buildPreviewSlots?: (state: State, context: LabPreviewContext) => LabSlots;
  presets?: readonly LabPreset<State>[];
}

export interface GovernanceLabSurfaceEntry {
  id: string;
  title: string;
  packageName: string;
  packageLayer: string;
  stability: string;
  exportName: string;
  family: string;
  previewModes: readonly LabPreviewMode[];
  copyFormats: readonly LabCopyFormat[];
  usageSource: string;
  runtimeFiles: {
    schema: string;
    preview: string;
  };
}

export interface UsageFileReference {
  file: string;
  area: string;
}

export interface UsageGroupReference {
  area: string;
  count: number;
  files: readonly string[];
}

export interface DownstreamPackageReference {
  packageName: string;
  packageLayer: string;
  count: number;
  files: readonly string[];
}

export interface StorybookReference {
  variant: string;
  title: string;
  file: string;
}

export interface HarnessReference {
  id: string;
  label: string;
  description: string;
  path: string;
}

export interface DocsReference {
  type: string;
  file: string;
}

export interface LabUsageRecord {
  id: string;
  title: string;
  exportName: string;
  packageName: string;
  packageLayer: string;
  stability: string;
  family: string;
  labEligible: boolean;
  labExemptionReason?: string;
  sourcePublicSurface: string;
  downstreamPackages: readonly DownstreamPackageReference[];
  usageGroups: readonly UsageGroupReference[];
  relatedStorybook: readonly StorybookReference[];
  relatedHarnesses: readonly HarnessReference[];
  relatedDocs: readonly DocsReference[];
  requiredTestLayers: readonly string[];
  tags: readonly string[];
  knownUsages: readonly UsageFileReference[];
}

export type ComponentLabCatalogEntry = GovernanceLabSurfaceEntry;

export interface ComponentLabEntry<
  State extends Record<string, unknown> = Record<string, unknown>,
> extends ComponentLabCatalogEntry {
  definition: LabSurfaceDefinition<State>;
  usage: LabUsageRecord;
}

export interface LabSession<State extends Record<string, unknown> = Record<string, unknown>> {
  state: Ref<State>;
  previewMode: Ref<LabPreviewMode>;
  copyFormat: Ref<LabCopyFormat>;
  activePresetId: Ref<string | null>;
  matrixItems: ComputedRef<readonly LabMatrixItem<State>[]>;
  update: <Key extends Extract<keyof State, string>>(key: Key, value: State[Key]) => void;
  reset: () => void;
  applyPreset: (preset: LabPreset<State> | null) => void;
  setMultiToggleMode: (controlId: string, mode: 'all' | 'none') => void;
  copyText: ComputedRef<string>;
}
