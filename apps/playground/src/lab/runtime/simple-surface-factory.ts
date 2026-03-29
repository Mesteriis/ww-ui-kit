import type { Component } from 'vue';

import type {
  LabControlSection,
  LabCopyFormat,
  LabMatrixItem,
  LabPreviewContext,
  LabPreviewMode,
  LabSlots,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import {
  createVueAttributes,
  createVueSnippet,
  markPreviewComponent,
  serializeByFormat,
} from './schema-helpers';
import SimpleSurfaceLabPreview from '../components/SimpleSurfaceLabPreview.vue';
import FieldSurfaceLabPreview from '../components/FieldSurfaceLabPreview.vue';

type SnippetSlot<State extends Record<string, unknown>> = {
  name?: string;
  content: (state: State) => string;
};

interface BaseFactoryOptions<State extends Record<string, unknown>> {
  id: string;
  title: string;
  description: string;
  packageName: string;
  exportName: string;
  defaultState: Readonly<State>;
  controlSections: readonly LabControlSection<Extract<keyof State, string>>[];
  buildMatrixItems: (state: State) => readonly LabMatrixItem<State>[];
  previewModes?: readonly LabPreviewMode[];
  defaultPreviewMode?: LabPreviewMode;
  copyFormats?: readonly LabCopyFormat[];
  defaultCopyFormat?: LabCopyFormat;
  buildPreviewSlots?: (state: State, context: LabPreviewContext) => LabSlots;
  buildSnippetProps: (state: State) => Record<string, unknown>;
  buildSnippetSlots?: (state: State) => readonly SnippetSlot<State>[];
}

interface SimpleFactoryOptions<
  State extends Record<string, unknown>,
> extends BaseFactoryOptions<State> {
  component: Component;
  buildComponentProps: (state: State, context: LabPreviewContext) => Record<string, unknown>;
  buildWrapperAttrs?: (state: State, context: LabPreviewContext) => Record<string, unknown>;
}

interface FieldFactoryOptions<
  State extends Record<string, unknown>,
> extends BaseFactoryOptions<State> {
  component: Component;
  buildComponentProps: (state: State, context: LabPreviewContext) => Record<string, unknown>;
  buildFieldProps: (state: State) => Record<string, unknown>;
  buildWrapperAttrs?: (state: State, context: LabPreviewContext) => Record<string, unknown>;
}

function buildSerializer<State extends Record<string, unknown>>(
  options: BaseFactoryOptions<State>
) {
  return (format: LabCopyFormat, state: State) =>
    serializeByFormat(format, options.buildSnippetProps(state), () =>
      createVueSnippet({
        packageName: options.packageName,
        exportName: options.exportName,
        attributes: createVueAttributes(options.buildSnippetProps(state)),
        ...(options.buildSnippetSlots
          ? {
              slots: options.buildSnippetSlots(state).map((slot) => ({
                ...(slot.name ? { name: slot.name } : {}),
                content: slot.content(state),
              })),
            }
          : {}),
      })
    );
}

export function createSimpleSurfaceDefinition<State extends Record<string, unknown>>(
  options: SimpleFactoryOptions<State>
): LabSurfaceDefinition<State> {
  const definition: LabSurfaceDefinition<State> = {
    id: options.id,
    title: options.title,
    description: options.description,
    defaultState: options.defaultState,
    controlSections: options.controlSections,
    previewModes: options.previewModes ?? ['single', 'matrix'],
    defaultPreviewMode: options.defaultPreviewMode ?? 'single',
    copyFormats: options.copyFormats ?? ['json', 'ts-object', 'vue'],
    defaultCopyFormat: options.defaultCopyFormat ?? 'json',
    previewComponent: markPreviewComponent(SimpleSurfaceLabPreview),
    buildMatrixItems: options.buildMatrixItems,
    serializeCopy: buildSerializer(options),
    buildPreviewProps: (state, context) => ({
      component: markPreviewComponent(options.component),
      componentProps: options.buildComponentProps(state, context),
      wrapperAttrs: options.buildWrapperAttrs?.(state, context),
    }),
  };

  if (options.buildPreviewSlots) {
    definition.buildPreviewSlots = options.buildPreviewSlots;
  }

  return definition;
}

export function createFieldSurfaceDefinition<State extends Record<string, unknown>>(
  options: FieldFactoryOptions<State>
): LabSurfaceDefinition<State> {
  const definition: LabSurfaceDefinition<State> = {
    id: options.id,
    title: options.title,
    description: options.description,
    defaultState: options.defaultState,
    controlSections: options.controlSections,
    previewModes: options.previewModes ?? ['single', 'matrix'],
    defaultPreviewMode: options.defaultPreviewMode ?? 'single',
    copyFormats: options.copyFormats ?? ['json', 'ts-object', 'vue'],
    defaultCopyFormat: options.defaultCopyFormat ?? 'json',
    previewComponent: markPreviewComponent(FieldSurfaceLabPreview),
    buildMatrixItems: options.buildMatrixItems,
    serializeCopy: buildSerializer(options),
    buildPreviewProps: (state, context) => ({
      component: markPreviewComponent(options.component),
      componentProps: options.buildComponentProps(state, context),
      fieldProps: options.buildFieldProps(state),
      wrapperAttrs: options.buildWrapperAttrs?.(state, context),
    }),
  };

  if (options.buildPreviewSlots) {
    definition.buildPreviewSlots = options.buildPreviewSlots;
  }

  return definition;
}
